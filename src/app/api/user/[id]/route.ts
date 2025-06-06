import { errorHandler } from "@/app/middleware/errorHandler";
import { AppError } from "@/utils/CustomError";
import { NextResponse } from "next/server";

import prisma from "@/app/lib/prisma";
import sendResponse from "@/app/lib/responseWrapper";
import { headers } from "next/headers";



interface Skill {
    dribbling: number,
    passing: number,
    shooting: number,
    defending: number,
    speed: number
}
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }): Promise<NextResponse> {
    const { id } = await params;
    const payload = await req.json()
    const { age, position, bio, skills } = payload;
    const { dribbling, passing, shooting, defending, speed } = skills as Skill

    const ratings = { dribbling, passing, shooting, defending, speed }
    try {

        if (!payload || typeof payload !== "object") {
            throw new AppError("Invalid request body. Please send valid JSON.", 400, false);
        }
        const user = await prisma.user.findUnique({
            where: { id: id }
        })
        if (!user) {
            throw new AppError("User Not Found", 404, false)
        }

        for (const [key, value] of Object.entries(ratings)) {
            if (value < 1 || value > 10) {
                throw new AppError(`${key} must be between 1 and 10.`, 400, false);
            }
        }
        if (!age || !bio || !position || !skills) {
            throw new AppError("Enter All details", 404, false)
        }
        if (!dribbling ||
            !passing ||
            !shooting ||
            !defending ||
            !speed) {

            throw new AppError("Please fill all the skills", 404, false)
        }


        const updatedUser = await prisma.user.update({
            where: { id: id },
            include: { skills: true },
            data: {
                age,
                bio,
                position,
                skills: {
                    upsert: {
                        update: {
                            dribbling: dribbling,
                            passing: passing,
                            shooting: shooting,
                            defending: defending,
                            speed: speed,
                        },
                        create: {
                            dribbling: dribbling,
                            passing: passing,
                            shooting: shooting,
                            defending: defending,
                            speed: speed,
                        },
                    },
                }
            }

        })
        return sendResponse("success", updatedUser, "User Updated");
    } catch (error) {
        return errorHandler(error)
    }
}


export async function GET() {
    const headersList = await headers()
    const userData = JSON.parse(await headersList.get('X-User-Data') as string)

    try {
        const user = await prisma.user.findUnique({
            include: {
                skills: true,
                teams: true
            },
            where: {
                id: userData.id
            }
        })
        if (!user) {
            throw new AppError("Cannot find user", 404, true)
        }
        return sendResponse("success", user)
    } catch (error) {
        return errorHandler(error)
    }
}