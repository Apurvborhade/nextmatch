
import { errorHandler } from "@/app/middleware/errorHandler";
import { AppError } from "@/utils/CustomError";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
const prisma = new PrismaClient()

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const { name, players, captainId } = body;
        if (!body || typeof body !== 'object') {
            throw new AppError("Payload must be a valid object.", 400, false);
        }
        if (!name || !captainId) {
            throw new AppError("Enter all details", 400, false);
        }
        if (!players || players.length == 0) {
            throw new AppError("Need at least 1 player", 400, false)
        }
        const alreadyExists = await prisma.team.findUnique({
            where: {
                name
            }
        })
        if (alreadyExists) {
            throw new AppError("Team with this name already exists", 409, false);
        }
        const newTeam = await prisma.team.create({
            include: { players: true, captain: true },
            data: {
                name: name,
                captainId: captainId,
                players: {
                    connect: players.map((userId: string) => ({ id: userId }))
                }
            }
        })
        return await NextResponse.json(newTeam, { status: 201 })
    } catch (error) {
        return errorHandler(error)
    }
}

export async function GET(req: Request) {
    try {
        const teams = await prisma.team.findMany();

        if (!teams || teams.length == 0) {
            throw new AppError("No Teams Available", 404, false);
        }
    } catch (error) {
        return errorHandler(error);
    }
}