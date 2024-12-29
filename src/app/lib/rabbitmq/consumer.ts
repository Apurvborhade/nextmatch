import { Channel, ConsumeMessage } from "amqplib";
import { getRabbitMqConnection } from "./connection";

export async function consumeMessages(queue: string, callback: (msg: any) => void) {
    const connection = await getRabbitMqConnection()
    const channel: Channel = await connection?.createChannel() as Channel;

    await channel.assertQueue(queue, { durable: true })

    await channel.consume(queue, (msg: ConsumeMessage | null) => {
        if (msg) {
            const content = JSON.parse(msg.content.toString());
            callback(content);
            channel.ack(msg);
        }
    })
    console.log(`Consuming messages from queue ${queue}`);
}