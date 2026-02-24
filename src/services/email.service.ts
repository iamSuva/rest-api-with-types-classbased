import nodemailer, { Transporter } from 'nodemailer';

export class EmailService {
    private transporter: Transporter;
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
    }

    async sendWelcomeEmail(email:string, name:string){
        await this.transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Welcome to our app',
            text: `Hello ${name}, Welcome to our app`,
        });
    }

}