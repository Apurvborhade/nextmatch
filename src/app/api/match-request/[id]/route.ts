import prisma from "@/app/lib/prisma";
import { errorHandler } from "@/app/middleware/errorHandler";
import { AppError } from "@/utils/CustomError";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    const { id } = await params; // MatchRequest ID
    const { status, matchId } = await req.json();

    try {
        // Validate status
        if (!["ACCEPTED", "REJECTED"].includes(status)) {
            throw new AppError("Invalid status", 400, false);
        }

        const matchRequestValid = await prisma.matchRequest.findUnique({
            where: { id }
        })
        if (!matchRequestValid) {
            throw new AppError("Cannot find the request", 404, false);
        }
        if (status === "ACCEPTED") {
            const matchValid = await prisma.match.findUnique({
                where: { id: matchId }
            })
            if (!matchValid)
                throw new AppError("Cannot find match", 404, false);
            
            // Find and update the match request
            const matchRequest = await prisma.matchRequest.update({
                where: { id },
                data: { status },
            });

            // Create a match when accepted

            const match = await prisma.match.update({
                where: { id: matchId },
                data: {
                    team1Id: matchRequest.receiverId,
                    team2Id: matchRequest.senderId,
                    date: new Date(), // Example: Auto-generate a date or ask during request
                    // Example: Default value
                },
            });

            return NextResponse.json({ message: "Match Updated", match });
        }

        return NextResponse.json({ message: `Match request ${status.toLowerCase()}` });
    } catch (error) {
        return errorHandler(error)
    }
}
