import prisma from "@/app/lib/prisma"
import sendResponse from "@/app/lib/responseWrapper"
import { errorHandler } from "@/app/middleware/errorHandler"
import { headers } from "next/headers"

export async function GET(req: Request) {
    const headersList = await headers()
    const userData = JSON.parse(await headersList.get('X-User-Data') as string)
    try {
        const today = new Date()
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        const endOfDay = new Date(today.setHours(23, 59, 59, 999));

        const matches = await prisma.match.findMany({
            include: {
                team1: true,
                team2: true
            },
            where: {
                AND: [
                    {
                        team1: {
                            players: {
                                some: {
                                    id: userData.id
                                }
                            }
                        }
                    },
                    {
                        date: {
                            gte: startOfDay,
                            lte: endOfDay
                        }
                    }

                ],
            }
        })

        return sendResponse("success", matches, "")
    } catch (error) {
        return errorHandler(error)
    }
}