import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

// interfaces
export interface IEmailProvider {
    sendHtml(to: string, subject: string, html: string, from?: string): Promise<void>
    sendText(to: string, subject: string, text: string, from?: string): Promise<void>
}

export class NodemailerEmailProvider implements IEmailProvider {

    private transporter: nodemailer.Transporter;

    constructor() {
        const options: SMTPTransport.Options = {
            host: process.env.EMAIL_HOST,
            port: Number(process.env.EMAIL_PORT),
            secure: process.env.EMAIL_SECURE === 'true',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            }
        };

        this.transporter = nodemailer.createTransport(options);
    }

    async sendHtml(to: string, subject: string, html: string, from: string = process.env.EMAIL_USER || ""): Promise<void> {
        // Verify transporter
        this.transporter.verify((error, success) => {
            if (error) throw new Error("Error with mailer configuration");
        });

        await this.transporter.sendMail({
            from: from,
            to: to,
            subject: subject,
            html: html,
        });
    }

    async sendText(to: string, subject: string, text: string, from: string): Promise<void> {
        // Verify transporter
        this.transporter.verify((error, success) => {
            if (error) throw new Error("Error with mailer configuration");
        });

        await this.transporter.sendMail({
            from: from,
            to: to,
            subject: subject,
            text: text,
        });
    }
}