
// utils
import { renderTemplate } from "@/utils/utility";

// interfaces
import { IEmailProvider } from "@/provider/emailProvider";
export interface INotificationService {
    sendOtpEmail(email: string, otp: string): Promise<void>;
    sendForgotPasswordEmail(email: string, verificationToken: string): Promise<void>;
}

export class NotificationService implements INotificationService {
    constructor(
        private emailProvider: IEmailProvider,
    ) { }

    async sendOtpEmail(email: string, otp: string): Promise<void> {
        const html = await renderTemplate("otp.html", { otp: otp, host: process.env.CLIENT_URL });
        await this.emailProvider.sendHtml(
            email,
            "Your OTP",
            html,
        );
    }

    async sendForgotPasswordEmail(email: string, verificationToken: string): Promise<void> {
        const html = await renderTemplate("forgot-password.html", {
            link: `${process.env.CLIENT_URL}/reset-password?token=${verificationToken}`,
            host: process.env.CLIENT_URL
        });
        await this.emailProvider.sendHtml(
            email,
            "Forgot Password",
            html,
        );
    }
}