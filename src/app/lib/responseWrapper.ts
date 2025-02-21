import { NextResponse } from "next/server";

interface apiResponse<T> {
    status: "success" | "error";
    data?: T;
    message?: string;
}

export default function sendResponse<T>(status: "success" | "error", data?: T, message?: string) {
    const response: apiResponse<T> = {
        status,
        data,
        message
    }

   return NextResponse.json(response, { status: status === "success" ? 200 : 400 });
}