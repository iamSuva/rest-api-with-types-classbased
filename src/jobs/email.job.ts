import { Job } from "bullmq";
import { IEmailJob } from "../interface/emailJob";
import { EmailService } from "../services/email.service";
import { logger } from "../utils/logger";

export class EmailJob {
  private emailService: EmailService;
  constructor() {
    this.emailService = new EmailService();
  }

  async handleWelcomeEmail(job: Job<IEmailJob>) {
    const { email, name } = job.data;
    logger.info(`sending welcome email to ${email}`);
    await this.emailService.sendWelcomeEmail(email, name);
    logger.info(`Welcome email sent to ${email}`);
  }
}