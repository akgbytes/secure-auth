import { logger } from "@/core/logger";
import { sendResetPasswordMail, sendVerificationMail } from "@/utils/mail";
import { Worker } from "bullmq";
import { connection } from "@/config/redis";

const worker = new Worker(
  "email",
  async (job) => {
    console.log("job data: ", job.data);
    const { type, email, token } = job.data;

    if (type === "verify") {
      await sendVerificationMail(email, token);
      logger.info({ email }, "Verification email sent");
    }

    if (type === "reset") {
      await sendResetPasswordMail(email, token);
      logger.info({ email }, "Password reset email sent");
    }
  },
  { connection }
);

logger.info("Email worker started and listening for jobs...");
