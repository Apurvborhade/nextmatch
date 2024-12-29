export async function matchRequestNotificationData(userId: string, sent: boolean): Promise<{
    title: string;
    description: string;
    userId:string;
}> {
    if (sent) {
        return {
            title: `Match Request was sent By ${userId}`,
            description: `Match Request Check`,
            userId,
        }
    } else {
        return {
            title: `Match Request was Accepted By ${userId}`,
            description: `Match Request accepted`,
            userId
        }
    }
}