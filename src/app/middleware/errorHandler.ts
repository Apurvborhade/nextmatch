import { AppError } from "@/utils/CustomError";
import { NextResponse } from "next/server";

export function errorHandler(error: any) {
    let statusCode = 500;
    let message = "Something went wrong"

    if (error instanceof AppError) {
        statusCode = error.statusCode
        message = error.message
    } else if (error instanceof SyntaxError) {
        statusCode = 400
        message = "Invalid Json payload"
    }

    console.error('Error : ', error);


    return NextResponse.json(
        {
            success: false,
            message
        },
        {
            status: statusCode
        }
    )
}