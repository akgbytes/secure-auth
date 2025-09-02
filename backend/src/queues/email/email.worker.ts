import { logger } from "@/utils/logger";
import { sendResetPasswordMail, sendVerificationMail } from "@/utils/mail";
import { Worker } from "bullmq";
import { connection } from "@/config/redis";

const worker = new Worker(
  "email",
  async (job) => {
    const { type, fullname, email, token } = job.data;

    if (type === "verify") {
      await sendVerificationMail(fullname, email, token);
      logger.info({ email }, "Verification email sent to: ");
    }

    if (type === "reset") {
      await sendResetPasswordMail(fullname, email, token);
      logger.info({ email }, "Password reset email sent to: ");
    }
  },
  { connection }
);

logger.info("Email worker started and listening for jobs...");
