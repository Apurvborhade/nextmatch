import prisma from "@/app/lib/prisma";
import sendResponse from "@/app/lib/responseWrapper";
import { errorHandler } from "@/app/middleware/errorHandler";
import { AppError } from "@/utils/CustomError";

/**
 * @method POST
 * @route /api/match
 * @description Creates a new match with the provided details.
 * 
 * @param {Request} req - The request object containing the payload in JSON format.
 *    - `date` (string): Date of the match in ISO format (required).
 *    - `location` (string): Location where the match will take place (required).
 *    - `team1Id` (string): ID of the first team participating in the match (required).
 *    - `status` (string): Status of the match (optional, e.g., "pending" or "confirmed").
 * 
 * @header {string} x-user-data - Metadata for the user creating the match (optional, but should be provided for traceability).
 * 
 * @throws {AppError} 404 - If `date` or `location` is missing.
 * @throws {AppError} 403 - If `team1Id` is not provided.
 * 
 * @returns {Promise<Response>} 200 - JSON object containing success confirmation and the created match details.
 *    Example:
 *    {
 *      success: true,
 *      match: {
 *        id: "matchId",
 *        date: "2024-12-18T00:00:00Z",
 *        location: "Match Location",
 *        team1Id: "team1Id",
 *        status: "pending"
 *      }
 *    }
 */
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { date, location, team1Id, team2Id, status } = body;

        // Validate required fields
        if (!date || !location) {
            throw new AppError("Please provide both date and location", 400, false);
        }

        if (!team1Id) {
            throw new AppError("Team 1 ID is required", 400, false);
        }

        // Validate date format
        const newDate = new Date(date);
        if (isNaN(newDate.getTime())) {
            throw new AppError("Invalid date format", 400, false);
        }

        // Validate teams exist
        const team1 = await prisma.team.findUnique({
            where: { id: team1Id }
        });

        if (!team1) {
            throw new AppError("Team 1 not found", 404, false);
        }

        if (team2Id) {
            const team2 = await prisma.team.findUnique({
                where: { id: team2Id }
            });

            if (!team2) {
                throw new AppError("Team 2 not found", 404, false);
            }

            if (team1Id === team2Id) {
                throw new AppError("Team 1 and Team 2 cannot be the same", 400, false);
            }
        }

        // Create the match
        const match = await prisma.match.create({
            data: {
                date: newDate,
                location,
                team1Id,
                team2Id: team2Id || null,
                status: status || 'active'
            },
            include: {
                team1: true,
                team2: true
            }
        });

        return sendResponse("success", match);
    } catch (error) {
        return errorHandler(error);
    }
}


/**
 * GET /api/matches
 * Retrieves all matches from the database.
 * 
 * @returns {Promise<Response>} 200 - JSON object containing success confirmation and array of matches.
 *    Example:
 *    {
 *      success: true,
 *      matches: [{
 *        id: "matchId",
 *        date: "2024-12-18T00:00:00Z", 
 *        location: "Match Location",
 *        team1Id: "team1Id",
 *        status: "pending"
 *      }]
 *    }
 */
export async function GET() {
    try {
        const matches = await prisma.match.findMany();
        return sendResponse("success", matches);
    } catch (error) {
        return errorHandler(error);
    }
}
