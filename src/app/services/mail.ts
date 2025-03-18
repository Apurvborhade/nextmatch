import sgMail from '@sendgrid/mail'

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY as string
sgMail.setApiKey(SENDGRID_API_KEY);

export default async function sendMaillWithTemplate(
    toEmail: string,
    templateId: string,
    templateData: { [key: string]: string }
) {

    console.log("Mailing")
        const msg = {
            to: toEmail,// Adding cc recipient
            from: 'apurvaborhadee@outlook.com',
            subject: 'Match Request Sent',
            templateId,
            dynamicTemplateData: templateData
        };
        try {
            await sgMail.send(msg);
            console.log("Mail Sent Successfully")
        } catch (error) {
            console.error("Error:", (error as any).response?.body || error);
        }
}