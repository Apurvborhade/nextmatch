import { errorHandler } from "@/app/middleware/errorHandler";
import { AppError } from "@/utils/CustomError";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const secret = process.env.NEXTAUTH_SECRET;
export async function GET(req: NextRequest): Promise<NextResponse> {
    try {
        return NextResponse.json({ message: "Hello World" });
    } catch (error) {
        return errorHandler(error)
    }
} 