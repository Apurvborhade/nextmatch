import prisma from "@/app/lib/prisma"
import { errorHandler } from "@/app/middleware/errorHandler"
import { AppError } from "@/utils/CustomError"
import { NextResponse } from "next/server"

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    const { id: teamId } = await params
    const { title, date } = await req.json()
    try {
        const team = await prisma.team.findUnique({
            where: {
                id: teamId
            }
        })

        if (!team) {
            throw new AppError("Cannot find team", 404, false);
        }

        const updatedTeam = await prisma.team.update({
            where: {
                id: teamId
            },
            include: {
                achievement: true,
                players: true,
                captain: true,
            },
            data: {
                achievement: {
                    create: {
                        title,
                        date
                    }
                }
            }
        })
        return NextResponse.json(updatedTeam)
    } catch (error) {
        return errorHandler(error);
    }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    const { id: teamId } = await params
    try {
        const team = await prisma.team.findUnique({
            where: { id: teamId },
        })
        console.log(team)
        if (!team) {
            throw new AppError("Cannot find team", 404, false);
        }
        const deletedTeam = await prisma.team.delete({
            where: { id: teamId }
        })

        return NextResponse.json({ success: true, deletedTeam })
    } catch (error) {
        return errorHandler(error)
    }
}