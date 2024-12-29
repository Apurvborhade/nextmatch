import RABBITMQ_CONFIG from "@/app/lib/rabbitmq/config";
import { getRabbitMqConnection } from "@/app/lib/rabbitmq/connection";
import { publishMessage } from "@/app/lib/rabbitmq/publisher";
import { initializeQueues } from "@/app/lib/rabbitmq/queues";
import sendResponse from "@/app/lib/responseWrapper";
import { errorHandler } from "@/app/middleware/errorHandler";
import { NextResponse } from "next/server";

async function init() {
    await initializeQueues()
}
export async function GET(req: Request) {
    try {
        await init();
  
        return sendResponse("success");
    } catch (error) {
        return errorHandler(error)
    }
}