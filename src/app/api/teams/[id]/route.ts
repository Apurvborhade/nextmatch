import prisma from "@/app/lib/prisma";
import sendResponse from "@/app/lib/responseWrapper";
import { errorHandler } from "@/app/middleware/errorHandler";
import { AppError } from "@/utils/CustomError";

/**
 * @method PUT
 * @route /api/teams/[id]
 * @description Adds a new achievement to a specific team by ID.
 * 
 * @param {Request} req - The request object containing the payload in JSON format.
 *    - `title` (string): Title of the achievement (required).
 *    - `date` (string): Date of the achievement in ISO format (required).
 * 
 * @param {Object} params - Route parameters.
 *    - `id` (string): The ID of the team to update (required).
 * 
 * @throws {AppError} 404 - If the team with the given ID does not exist.
 * 
 * @returns {Promise<Response>} 200 - JSON object of the updated team, including its achievements, players, and captain.
 *    Example:
 *    {
 *      id: "teamId",
 *      name: "Team Name",
 *      players: [...],
 *      captain: {...},
 *      achievement: [
 *        { title: "Achievement Title", date: "2024-12-18T00:00:00Z" }
 *      ]
 *    }
 */
export async function PUT(req: Request, { params }: { params: { id: string } }) {
    const { id: teamId } = await params;
    const { title, date } = await req.json();
    try {
        // Fetch the team by ID to ensure it exists
        const team = await prisma.team.findUnique({
            where: { id: teamId },
        });

        if (!team) {
            throw new AppError("Cannot find team", 404, false);
        }

        // Add a new achievement to the team
        const updatedTeam = await prisma.team.update({
            where: { id: teamId },
            include: {
                achievement: true,
                players: true,
                captain: true,
            },
            data: {
                achievement: {
                    create: { title, date },
                },
            },
        });

        return sendResponse("success",updatedTeam);
    } catch (error) {
        return errorHandler(error);
    }
}

/**
 * @method DELETE
 * @route /api/teams/[id]
 * @description Deletes a specific team by ID.
 * 
 * @param {Request} req - The request object (no body required).
 * @param {Object} params - Route parameters.
 *    - `id` (string): The ID of the team to delete (required).
 * 
 * @throws {AppError} 404 - If the team with the given ID does not exist.
 * 
 * @returns {Promise<Response>} 200 - JSON object indicating the team was successfully deleted.
 *    Example:
 *    {
 *      success: true,
 *      deletedTeam: { id: "teamId", name: "Team Name", ... }
 *    }
 */
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    const { id: teamId } = await params;
    try {
        // Fetch the team by ID to ensure it exists
        const team = await prisma.team.findUnique({
            where: { id: teamId },
        });

        if (!team) {
            throw new AppError("Cannot find team", 404, false);
        }

        // Delete the team
        const deletedTeam = await prisma.team.delete({
            where: { id: teamId },
        });

        return sendResponse("success", deletedTeam);
    } catch (error) {
        return errorHandler(error);
    }
}
