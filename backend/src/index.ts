import { app } from "@/app";
import { logger } from "@/core/logger";
import { env } from "@/config/env";
import { connectDrizzle } from "@/db";

const PORT = env.PORT;

connectDrizzle();

app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});
