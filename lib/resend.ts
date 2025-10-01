import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;

if (!resendApiKey) {
    throw new Error("RESEND_API_KEY is not defined in environment variables");
}

const resend = new Resend(resendApiKey);

type EmailProps = {
    to: string;
    subject: string;
    text: string;
    html: string;
};

export async function sendEmail({ to, subject, text, html }: EmailProps) {
    try {
        console.log("\n\nSending email to:", to);
        const data = await resend.emails.send({
            from: "onboarding@resend.dev",
            to,
            subject,
            text,
            html,
        });
        console.log("Email sent successfully:", data);
        return { success: true, data };
    } catch (error: any) {
        console.error("Email send failed:", error);
        return { success: false, error };
    }
}