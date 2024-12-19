import prisma from "@/app/lib/prisma";
import sendResponse from "@/app/lib/responseWrapper";
import { errorHandler } from "@/app/middleware/errorHandler";
import sendMaillWithTemplate from "@/app/services/mail";
import { AppError } from "@/utils/CustomError";
import { NextResponse } from "next/server";

const templateId = 'd-5035cf2562d044bea35737e8cec904dc';
/**
 * @method PATCH
 * @route /api/match-requests/{id}
 * @description Updates the status of a match request (ACCEPTED or REJECTED). If accepted, updates the match details.
 * 
 * @param {Request} req - The HTTP request object containing the payload in JSON format.
 *    - `status` (string): Status of the match request, either "ACCEPTED" or "REJECTED" (required).
 *    - `matchId` (string): ID of the match associated with the request (required for "ACCEPTED" status).
 * 
 * @param {Object} params - The route parameters.
 *    - `id` (string): ID of the match request to be updated (required).
 * 
 * @throws {AppError} 400 - If the provided status is invalid.
 * @throws {AppError} 404 - If the match request or match does not exist.
 * 
 * @returns {Promise<Response>} 200 - JSON object indicating the result of the update.
 *    Example for accepted match:
 *    {
 *      message: "Match Updated",
 *      match: {
 *        id: "matchId",
 *        team1Id: "receiverTeamId",
 *        team2Id: "senderTeamId",
 *        date: "2024-12-20T18:30:00.000Z"
 *      }
 *    }
 *    Example for rejected match:
 *    {
 *      message: "Match request rejected"
 *    }
 */
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    const { id } = params; // MatchRequest ID
    const { status, matchId } = await req.json();

    try {
        // Validate status
        if (!["ACCEPTED", "REJECTED"].includes(status)) {
            throw new AppError("Invalid status", 400, false);
        }

        // Check if the match request exists
        const matchRequestValid = await prisma.matchRequest.findUnique({
            where: { id },
        });

        if (!matchRequestValid) {
            throw new AppError("Cannot find the request", 404, false);
        }

        // Handle "ACCEPTED" status
        if (status !== "ACCEPTED") {
            // Validate the match
            const matchValid = await prisma.match.findUnique({
                where: { id: matchId },
            });

            if (!matchValid) {
                throw new AppError("Cannot find match", 404, false);
            }

            // Update the match request status
            const matchRequest = await prisma.matchRequest.update({
                where: { id },
                include: {
                    sender: {
                        include: { captain: true }
                    },
                    receiver: true
                },
                data: { status },
            });

            // Update the match details
            const match = await prisma.match.update({
                where: { id: matchId },
                data: {
                    team1Id: matchRequest.receiverId,
                    team2Id: matchRequest.senderId,
                    date: new Date(), // Example: Use the current date or a provided one
                },
            });
            const sender = matchRequest.sender
            const receiver = matchRequest.receiver
            await sendMaillWithTemplate(sender.captain?.email ? sender.captain.email : '', templateId, {
                team_captain_name: sender.captain?.name ?? '',
                opponent_team_name: receiver.name,
                match_date_time: match.date.toString(),
                venue_name_address: match.location,
                link_to_match_details: `/match/${match.id}`,
                contact_info_or_support_link: 'apurvaborhadee@outlook.com'
            });
            return sendResponse("success", match, "Match Updated");
        }

        return sendResponse("success", {}, `Match request ${status.toLowerCase()}`);
    } catch (error) {
        return errorHandler(error);
    }
}
