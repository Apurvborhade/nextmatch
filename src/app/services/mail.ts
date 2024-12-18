import sgMail from '@sendgrid/mail'
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY as string
sgMail.setApiKey(SENDGRID_API_KEY);

export default async function sendMaillWithTemplate(
    toEmail: string,
    templateId: string,
    templateData: { [key: string]: string }
) {
    try {

        const msg = {
            to: toEmail,
            from: 'apurvaborhadee@outlook.com',
            templateId,
            dynamicTemplateData: templateData
        };

        await sgMail.send(msg);
        console.log("Mail Sent Successfully")
    } catch (error) {
        console.log(error)
    }
}