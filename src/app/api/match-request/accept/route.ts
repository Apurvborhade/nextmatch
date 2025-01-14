import { matchRequestNotificationData, MatchRequestNotificationType } from "@/app/lib/notificationConfig";
import prisma from "@/app/lib/prisma";
import RABBITMQ_CONFIG from "@/app/lib/rabbitmq/config";
import { publishMessage } from "@/app/lib/rabbitmq/publisher";
import sendResponse from "@/app/lib/responseWrapper"
import { errorHandler } from "@/app/middleware/errorHandler"
import { AppError } from "@/utils/CustomError";
import { NextRequest } from "next/server"

/**
 * @method PATCH
 * @route /api/match-request/accept?requestId={requestId}
 * @description Accepts a match request and updates the associated match details. Also sends a notification to the relevant teams.
 * 
 * @param {NextRequest} req - The HTTP request object
 *    Query Parameters:
 *    - requestId (string): ID of the match request to be accepted (required)
 * 
 * @throws {AppError} 404 - If the match request does not exist
 * @throws {AppError} 409 - If the request is already accepted or rejected
 * 
 * @returns {Promise<Response>} 200 - JSON response indicating success
 *    Example:
 *    {
 *      status: "success",
 *      data: {},
 *      message: "Match Request Accepted"
 *    }
 */
export async function PATCH(req: NextRequest) {
    try {

        const searchparams = req.nextUrl.searchParams
        const requestId = searchparams.get('requestId') as string;

        const validMatchRequest = await prisma.matchRequest.findUnique({
            where: {
                id: requestId
            }
        })
        if (!validMatchRequest) {
            throw new AppError("Cannot find the request", 404, false);
        }

        if (validMatchRequest.status === 'ACCEPTED') {
            throw new AppError("Request Already Accepted", 409, false);
        }
        if (validMatchRequest.status === 'REJECTED') {
            throw new AppError("Request Already Rejected", 409, false);
        }

        const matchRequest = await prisma.matchRequest.update({
            where: { id: requestId },
            include: {
                match: true,
                sender: {
                    include: { captain: true }
                },
                receiver: {
                    include: { captain: true }
                }
            },
            data: {
                status: "ACCEPTED"
            },
        });

        // Update the match details
        const match = await prisma.match.update({
            where: { id: matchRequest?.match?.id },
            data: {
                team1Id: matchRequest.senderId,
                team2Id: matchRequest.receiverId,
                date: new Date(), // Example: Use the current date or a provided one
            },
        });
        const sender = matchRequest.receiver // Now The reciever becomes sender when updating 
        const receiver = matchRequest.sender // And here the sender of matchRequest becomes reciever when accepting or declining request

        const notification = await matchRequestNotificationData(receiver, sender, MatchRequestNotificationType.ACCEPTED, match, matchRequest?.id);
        await publishMessage(RABBITMQ_CONFIG.queues.notificationQueue, notification)

        return sendResponse("success", {}, "Match Request Accepted");
    } catch (error) {
        return errorHandler(error)
    }
}