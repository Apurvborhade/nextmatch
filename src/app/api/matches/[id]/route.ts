import prisma from "@/app/lib/prisma";
import { errorHandler } from "@/app/middleware/errorHandler";
import { AppError } from "@/utils/CustomError";
import { NextResponse } from "next/server";

/**
 * @method DELETE
 * @route /api/matches/[id]
 * @description Deletes a match by its unique ID.
 * 
 * @param {Request} req - The request object (no body required).
 * @param {Object} params - Route parameters.
 *    - `id` (string): The unique ID of the match to delete (required).
 * 
 * @throws {AppError} 404 - If the match with the provided ID is not found.
 * 
 * @returns {Promise<Response>} 200 - JSON object indicating success and a confirmation message.
 *    Example:
 *    {
 *      success: true,
 *      message: "Match Deleted"
 *    }
 */
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    const { id } = params;

    try {
        // Check if the match exists
        const match = await prisma.match.findUnique({
            where: { id },
        });

        if (!match) {
            throw new AppError("Cannot find the match", 404, false);
        }

        // Delete the match
        await prisma.match.delete({
            where: { id },
        });

        return NextResponse.json({ success: true, message: "Match Deleted" });
    } catch (error) {
        return errorHandler(error);
    }
}
