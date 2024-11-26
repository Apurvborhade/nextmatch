import prisma from "@/app/lib/prisma";
import { errorHandler } from "@/app/middleware/errorHandler";
import { AppError } from "@/utils/CustomError";
import { NextResponse } from "next/server";

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    const { id } = await params;
    try {
        const match = await prisma.match.findUnique({
            where: { id }
        })
        if (!match) {
            throw new AppError("Cannot find the match", 404, false);
        }

        await prisma.match.delete({
            where: { id }
        })

        return NextResponse.json({ success: true, message: "Match Deleted" })
    } catch (error) {
        return errorHandler(error)
    }

}