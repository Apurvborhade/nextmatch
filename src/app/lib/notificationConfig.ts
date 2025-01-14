export enum MatchRequestNotificationType {
    SENT = 'SENT',
    ACCEPTED = 'ACCEPTED',
    DECLINED = 'DECLINED'
}


export async function matchRequestNotificationData(user: object, sender: object, type: MatchRequestNotificationType, matchDetails: object,matchRequestId:string): Promise<{
    title: string;
    description: string;
    sender: object;
    user: object;
    status: MatchRequestNotificationType;
    matchDetails: object;
    matchRequestId:string;
}> {

    if (type === MatchRequestNotificationType.SENT) {
        return {
            title: `Match Request was sent `,
            description: `Match Request Check`,
            sender,
            user,
            status: MatchRequestNotificationType.SENT,
            matchDetails,
            matchRequestId
        }
    } else if (type === MatchRequestNotificationType.ACCEPTED) {
        return {
            title: `Match Request was Accepted `,
            description: `Match Request accepted`,
            sender,
            user,
            status: MatchRequestNotificationType.ACCEPTED,
            matchDetails,
            matchRequestId
        }
    } else {
        return {
            title: `Match Request was Declined `,
            description: `Match Request accepted`,
            sender,
            user,
            status: MatchRequestNotificationType.DECLINED,
            matchDetails,
            matchRequestId
        }
    }
}