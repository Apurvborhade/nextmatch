import prisma from "@/app/lib/prisma";
import { errorHandler } from "@/app/middleware/errorHandler"
import { AppError } from "@/utils/CustomError";
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    const { date, location, team1Id, status } = await req.json()
    const userdata = req.headers.get("x-user-data") as string

    try {
        if (!date || !location) {
            throw new AppError("Please Enter all details", 404, false)
        }

        if (!team1Id) {
            throw new AppError("Please add the team 1", 403, false);
        }
        const match = await prisma.match.create({
            data: {
                date,
                location,
                team1Id,
                status
            }
        })
        return NextResponse.json({ success: true, match })
    } catch (error) {
        return errorHandler(error)
    }
}