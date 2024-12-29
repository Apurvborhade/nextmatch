import { Channel } from "amqplib";
import { getRabbitMqConnection } from "./connection";

export async function publishMessage(queue: string, message: object) {
    const connection = await getRabbitMqConnection();
    const channel = await connection?.createChannel() as Channel;

    await channel.assertQueue(queue, { durable: true });

    channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));

    console.log(`Message published to queue ${queue}:`, JSON.stringify(message));
}