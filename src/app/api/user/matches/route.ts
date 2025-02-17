import prisma from "@/app/lib/prisma"
import sendResponse from "@/app/lib/responseWrapper"
import { errorHandler } from "@/app/middleware/errorHandler"
import { headers } from "next/headers"

export async function GET(req:Request) {
    const headersList = await headers()
    const userData = JSON.parse(await headersList.get('X-User-Data') as string)
    try {
        console.log(userData)
        const matches = await prisma.match.findMany({
            include:{
                team1:true,
                team2:true
            },
            where: {
                team1: {
                    players: {
                        some: {
                            id: userData.id
                        }
                    }
                }
            }
        })

        return sendResponse("success", matches, "")
    } catch (error) {
        return errorHandler(error)
    }
}