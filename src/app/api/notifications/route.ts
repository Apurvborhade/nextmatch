import prisma from "@/app/lib/prisma";
import sendResponse from "@/app/lib/responseWrapper";
import { errorHandler } from "@/app/middleware/errorHandler";
import { AppError } from "@/utils/CustomError";
import { NextRequest } from "next/server";


export async function GET(req: NextRequest) {
    const userId = req.nextUrl.searchParams.get("userId");

    try {
        if (!userId) {
            throw new AppError('User ID required', 400, true)
        }
    
        const notifications = await prisma.notification.findMany({
            where: { userId },
        });
    
        return sendResponse('success', notifications);
        
    } catch (error) {
        return errorHandler(error)
    }
}
