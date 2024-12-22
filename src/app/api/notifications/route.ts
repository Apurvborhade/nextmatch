import { getRabbitMqConnection } from "@/app/lib/rabbitmq/connection";
import sendResponse from "@/app/lib/responseWrapper";
import { errorHandler } from "@/app/middleware/errorHandler";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        console.log("Connecting RabbitMq")
        const connection = await getRabbitMqConnection();
        console.log("RabbitMQ Connection Success")
        return sendResponse("success");
    } catch (error) {
        return errorHandler(error)
    }
}