import * as amqp from 'amqplib'
import RABBITMQ_CONFIG from "./config";
let connection: amqp.Connection | null = null;

export async function getRabbitMqConnection(): Promise<amqp.Connection | undefined> {
    if (!connection) {
        connection = await amqp.connect(RABBITMQ_CONFIG.url);
    }
    return connection;

}