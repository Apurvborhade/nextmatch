import { errorHandler } from "@/app/middleware/errorHandler";
import { AppError } from "@/utils/CustomError";
import { NextResponse } from "next/server";

export async function GET(req:Request) {
    try {
        throw new AppError("Error",403,false)
        return NextResponse.json({message:"Hello World"});
    } catch (error) {
        return errorHandler(error)
    }
} 