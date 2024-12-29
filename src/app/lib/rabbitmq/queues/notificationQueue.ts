import { consumeMessages } from '../consumer';
import RABBITMQ_CONFIG from '../config';
import prisma from '@/app/lib/prisma';

export async function processNotificationQueue() {
    await consumeMessages(RABBITMQ_CONFIG.queues.notificationQueue, async (message) => {
        console.log('Processing notificatiosssn:', message);
        // Add your notification logic here (e.g., send email or push notification)
        console.log("Saved")
        const notification = await prisma.notification.create({
            data: message
        })

        console.log(notification)
        return notification
    });
}
