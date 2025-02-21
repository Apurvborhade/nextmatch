import { NextRequest, NextResponse } from "next/server";
import { AppError } from "@/utils/CustomError";


const rateLimitMap = new Map<string, { count: number, lastReset: number }>()
export default function rateLimitMiddleware(req: NextRequest) {


    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const limit = 50 // 10 per minute per ip
    const windowMs = 60 * 1000 // 1 min

    if (!rateLimitMap.has(ip)) {
        rateLimitMap.set(ip, {
            count: 0,
            lastReset: Date.now()
        })
    }

    const ipData = rateLimitMap.get(ip);
    if (!ipData) return;
    if (Date.now() - ipData?.lastReset > windowMs) {
        ipData.count = 0;
        ipData.lastReset = Date.now();
    }
    if (ipData.count >= limit) {
        throw new AppError("Too Many Requests", 429, false)
    }

    ipData.count += 1;

    return NextResponse.next()



}