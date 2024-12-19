import prisma from "@/app/lib/prisma";
import sendResponse from "@/app/lib/responseWrapper";
import { errorHandler } from "@/app/middleware/errorHandler";
import { AppError } from "@/utils/CustomError";
import { NextResponse } from "next/server";

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
    const { date, location, team1Id, status } = await req.json();
    const userdata = req.headers.get("x-user-data") as string; // Optional user metadata

    try {
        // Validate required fields
        if (!date || !location) {
            throw new AppError("Please Enter all details", 404, false);
        }

        if (!team1Id) {
            throw new AppError("Please add the team 1", 403, false);
        }

        // Create the match
        const match = await prisma.match.create({
            data: {
                date,
                location,
                team1Id,
                status,
            },
        });

        return sendResponse("success", match);
    } catch (error) {
        return errorHandler(error);
    }
}
