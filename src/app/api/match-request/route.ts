import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import { AppError } from "@/utils/CustomError";
import { errorHandler } from "@/app/middleware/errorHandler";

export async function POST(req: Request) {
    const { senderId, receiverId, message } = await req.json();

    try {
        // Validate required fields
        if (!senderId || !receiverId) {
            throw new AppError("Sender and Receiver IDs are required", 400, false);
        }

        // Check if sender and receiver teams exist
        const sender = await prisma.team.findUnique({ where: { id: senderId } });
        const receiver = await prisma.team.findUnique({ where: { id: receiverId } });

        if (!sender || !receiver) {
            throw new AppError("One or both teams do not exist", 404, false);
        }

        // Create match request
        const matchRequest = await prisma.matchRequest.create({
            data: {
                senderId,
                receiverId,
                message,
                status: "PENDING",
            },
        });

        return NextResponse.json({ message: "Match request sent", matchRequest });
    } catch (error) {
        return errorHandler(error)
    }
}

