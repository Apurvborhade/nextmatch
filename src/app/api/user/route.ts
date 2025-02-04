import prisma from "@/app/lib/prisma";
import sendResponse from "@/app/lib/responseWrapper";
import { errorHandler } from "@/app/middleware/errorHandler";
import { AppError } from "@/utils/CustomError";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams
    const query = searchParams.get('username') as string
    if (!query || typeof query !== "string") {
        throw new AppError("Invalid Query", 400, true)
    }
    try {
        if(query.length === 0) {
            return sendResponse("success", [])
        }
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                position: true,
            },
            where: {
                name: { contains: query, mode: "insensitive" }
            }
        });

        
        return sendResponse("success", users)
    } catch (error) {
        return errorHandler(error)
    }
}