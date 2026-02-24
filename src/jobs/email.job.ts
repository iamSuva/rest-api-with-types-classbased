import { Job } from "bullmq";
import { IEmailJob } from "../interface/emailJob";
import { EmailService } from "../services/email.service";

export class EmailJob {
  private emailService: EmailService;
  constructor() {
    this.emailService = new EmailService();
  }

  async handleWelcomeEmail(job: Job<IEmailJob>) {
    const { email, name } = job.data;
    await this.emailService.sendWelcomeEmail(email, name);
    console.log(`Welcome email sent to ${email}`);
  }
}