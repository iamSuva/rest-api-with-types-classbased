import { EmailJob } from "../jobs/email.job";
import { Job, Worker } from "bullmq";
import { IEmailJob } from "../interface/emailJob";
import { logger } from "../utils/logger";

export class EmailWorker {
    private emailJob: EmailJob;
    private worker: Worker;

    constructor() {
        this.emailJob = new EmailJob();
        this.worker = new Worker(
            "emailQueue",
            this.processJob.bind(this),
            {
                connection: {
                    host: "localhost",
                    port: 6379,
                },
            }
        );
        this.worker.on("completed", (job) => {
            logger.info(`Job ${job.id} completed`);
          });
      
        this.worker.on("failed", (job, err) => {
            logger.error(`Job ${job?.id} failed: \n ${err.message}`);
        });
    }
    private async processJob(job: Job<IEmailJob>) {
       switch (job.name) {
        case "welcomeEmail":
            return this.emailJob.handleWelcomeEmail(job);
       default:
        throw new Error(`Unknown job name: ${job.name}`);
    }
  }
}