import { AppError } from "@/utils/CustomError";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const secret = process.env.AUTH_SECRET

export async function apiMiddleware(req: NextRequest) {
    const token = await getToken({ req, secret })

    if (!token) {
        throw new AppError("Access Denied", 401, false);
    }

    const res = NextResponse.next();
    res.headers.set('X-User-Data', JSON.stringify(token || {}));
    return res;
}

export const config = {
    matcher: ["/api/:path*"]
}