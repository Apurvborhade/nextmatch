import prisma from "@/app/lib/prisma";
import { AppError } from "@/utils/CustomError";
import { errorHandler } from "@/app/middleware/errorHandler";
import sendMaillWithTemplate from "@/app/services/mail";
import sendResponse from "@/app/lib/responseWrapper";
import { matchRequestNotificationData, MatchRequestNotificationType } from "@/app/lib/notificationConfig";
import { publishMessage } from "@/app/lib/rabbitmq/publisher";
import RABBITMQ_CONFIG from "@/app/lib/rabbitmq/config";

const templateId = 'd-c640f3eb09a9408c9301d406dd0c15ca';

/**
 * @method POST
 * @route /api/match-requests
 * @description Sends a match request from one team to another and notifies the recipient team's captain via email.
 * 
 * @param {Request} req - The request object containing the payload in JSON format.
 *    - `senderId` (string): ID of the team sending the request (required).
 *    - `receiverId` (string): ID of the team receiving the request (required).
 *    - `message` (string): Optional message to include in the match request.
 *    - `matchId` (string): ID of the match for which the request is being sent (required).
 * 
 * @throws {AppError} 400 - If `senderId` or `receiverId` is missing.
 * @throws {AppError} 404 - If the sender team, receiver team, or match does not exist.
 * 
 * @returns {Promise<Response>} 200 - JSON object confirming the match request was sent successfully.
 *    Example:
 *    {
 *      message: "Match request sent",
 *      matchRequest: {
 *        id: "requestId",
 *        senderId: "senderId",
 *        receiverId: "receiverId",
 *        message: "Good luck!",
 *        status: "PENDING"
 *      }
 *    }
 */
export async function POST(req: Request) {
    const { senderId, receiverId, message, matchId } = await req.json();

    try {
        // Validate required fields
        if (!senderId || !receiverId) {
            throw new AppError("Sender and Receiver IDs are required", 400, false);
        }

        // Check if sender and receiver teams exist
        const sender = await prisma.team.findUnique({ where: { id: senderId }, include: { captain: true } });
        const receiver = await prisma.team.findUnique({ where: { id: receiverId }, include: { captain: true } });

        if (!sender || !receiver) {
            throw new AppError("One or both teams do not exist", 404, false);
        }

        // Check if the match exists
        const match = await prisma.match.findUnique({
            where: { id: matchId },
        });

        if (!match) {
            throw new AppError("Cannot Find match", 404, false);
        }

        // Check if a match request already exists between these teams for this match
        const existingRequest = await prisma.matchRequest.findFirst({
            where: {
                AND: [
                    { matchId: matchId },
                    {
                        OR: [
                            {
                                AND: [
                                    { senderId: senderId },
                                    { receiverId: receiverId }
                                ]
                            },
                            {
                                AND: [
                                    { senderId: receiverId },
                                    { receiverId: senderId }
                                ]
                            }
                        ]
                    }
                ]
            }
        });

        if (existingRequest) {
            throw new AppError("A match request already exists between these teams for this match", 409, false);
        }
        
        // Create match request
        const matchRequest = await prisma.matchRequest.create({
            data: {
                senderId,
                receiverId,
                message,
                matchId,
                status: "PENDING",
            },
        });



        // Push Notifications
        const notification = await matchRequestNotificationData(receiver, sender, MatchRequestNotificationType.SENT, match, matchRequest?.id)
        await publishMessage(RABBITMQ_CONFIG.queues.notificationQueue, notification);



        return sendResponse("success", matchRequest, "Match request sent");
    } catch (error) {
        return errorHandler(error);
    }
}
