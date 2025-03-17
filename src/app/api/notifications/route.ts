import prisma from "@/app/lib/prisma";
import sendResponse from "@/app/lib/responseWrapper";
import { AppError } from "@/utils/CustomError";
import { NextRequest } from "next/server";


export async function GET(req: NextRequest) {
    const userId = req.nextUrl.searchParams.get("userId");

    console.log(userId)
    if (!userId) {
        throw new AppError('User ID required', 400, true)
    }

    const notifications = await prisma.notification.findMany({
        where: { userId },
    });

    console.log('backend:',notifications)
    return sendResponse('success', notifications);
}
