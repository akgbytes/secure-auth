import { logger } from "@/core/logger";
import { sendResetPasswordMail, sendVerificationMail } from "@/utils/mail";
import { Worker } from "bullmq";
import { connection } from "@/config/redis";

const worker = new Worker(
  "email",
  async (job) => {
    const { type, name, email, otp, token } = job.data;

    console.log("job data: ", job.data);

    if (type === "verify") {
      await sendVerificationMail(name, email, otp);
      logger.info({ email }, "Verification email sent");
    }

    if (type === "reset") {
      await sendResetPasswordMail(name, email, token);
      logger.info({ email }, "Password reset email sent");
    }
  },
  { connection }
);

logger.info("Email worker started and listening for jobs...");
