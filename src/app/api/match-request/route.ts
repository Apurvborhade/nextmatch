import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import { AppError } from "@/utils/CustomError";
import { errorHandler } from "@/app/middleware/errorHandler";
import sendMaillWithTemplate from "@/app/services/mail";

const templateId = 'd-c640f3eb09a9408c9301d406dd0c15ca'
export async function POST(req: Request) {
    const { senderId, receiverId, message, matchId } = await req.json();

    try {
        // Validate required fields
        if (!senderId || !receiverId) {
            throw new AppError("Sender and Receiver IDs are required", 400, false);
        }

        // Check if sender and receiver teams exist
        const sender = await prisma.team.findUnique({ where: { id: senderId } });
        const receiver = await prisma.team.findUnique({ where: { id: receiverId }, include: { captain: true } });

        if (!sender || !receiver) {
            throw new AppError("One or both teams do not exist", 404, false);
        }

        const match = await prisma.match.findUnique({
            where: { id: matchId }
        })

        if (!match) {
            throw new AppError("Cannot Find match", 404, false);
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

        const captainMail: string = receiver.captain?.email ? receiver.captain?.email : '';

        await sendMaillWithTemplate(captainMail, templateId, {
            "userName": "John Doe",
            "team1Name": sender.name,
            "team2Name": receiver.name,
            "matchDate": match.date.toString(),
            "matchTime": "6:00 PM",
            "matchLocation": match.location,
            "acceptLink": "https://nextmatch.com/matches/accept?requestId=12345",
            "rejectLink": "https://nextmatch.com/matches/reject?requestId=12345"
        })
        return NextResponse.json({ message: "Match request sent", matchRequest });
    } catch (error) {
        return errorHandler(error)
    }
}

