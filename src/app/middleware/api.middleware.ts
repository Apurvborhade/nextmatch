import { AppError } from "@/utils/CustomError";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const secret = process.env.AUTH_SECRET

export async function apiMiddleware(req: NextRequest) {
    const token = await getToken({ req, secret })

    if (!token) {
        throw new AppError("Access Denied", 401, false);
    }
    return NextResponse.next();
}

export const config = {
    matcher: ["/api/:path*"]
}