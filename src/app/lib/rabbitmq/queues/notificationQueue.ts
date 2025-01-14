import { consumeMessages } from '../consumer';
import RABBITMQ_CONFIG from '../config';
import prisma from '@/app/lib/prisma';
import { MatchRequestNotificationType } from '../../notificationConfig';
import sendMaillWithTemplate from '@/app/services/mail';

const templateId = {
    requestSent: "d-c640f3eb09a9408c9301d406dd0c15ca",
    requestAccept: "d-5035cf2562d044bea35737e8cec904dc",
    requestDeclined: "d-d685b6ac2b844230979d8d5c2fea466f"
}
export async function processNotificationQueue() {
    await consumeMessages(RABBITMQ_CONFIG.queues.notificationQueue, async (message) => {
        console.log('Processing notification...');
        // Add your notification logic here (e.g., send email or push notification)
        const { title, description, sender, user, status, matchDetails, matchRequestId } = await message;

        const notification = await prisma.notification.create({
            data: {
                title,
                description,
                userId: user?.captain?.id,
            }
        })

        if (status === MatchRequestNotificationType.SENT) {
            await sendMaillWithTemplate(user?.captain?.email, templateId.requestSent, {
                recipient_name: user.captain?.name ? user.captain?.name : '',
                sender_name: sender?.captain?.name,
                sender_team: sender?.name,
                matchDate: matchDetails?.date?.toString(),
                match_time: "6:00 PM",
                match_venue: matchDetails?.location,
                accept_link: `http://localhost:3000/matches/accept?requestId=${matchRequestId}`,
                decline_link: `http://localhost:3000/matches/reject?requestId=${matchRequestId}`,
            });
        } else if (status === MatchRequestNotificationType.ACCEPTED) {

            await sendMaillWithTemplate(user?.captain?.email, templateId.requestAccept, {
                recipient_name: user.captain?.name ? user.captain?.name : '',
                sender_name: sender?.captain?.name,
                match_details_link: `https://localhost:3000/matches/${matchDetails.id}`
            });
        } else {
            await sendMaillWithTemplate(user?.captain?.email, templateId.requestDeclined, {

                recipient_name: user.captain?.name ? user.captain?.name : '',
                sender_name: sender?.captain?.name,
                match_details_link: `https://localhost:3000/matches/${matchDetails.id}`
            });
        }
        return notification
    });
}
