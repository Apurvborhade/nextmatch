import prisma from "@/app/lib/prisma";
import sendResponse from "@/app/lib/responseWrapper";
import { errorHandler } from "@/app/middleware/errorHandler";
import { AppError } from "@/utils/CustomError";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }): Promise<NextResponse> {
    const { id } = await params
    try {
        const teams = await prisma.team.findMany({
            where: {
                OR: [
                    { captainId: id },
                    { players: { some: { id } } }
                ]
            },
            include: {
                players: true
            }
        })

        if (!teams)
            throw new AppError("Cannot find any team", 404, true)

        return sendResponse("success", teams)
    } catch (error) {
        return errorHandler(error)
    }
}