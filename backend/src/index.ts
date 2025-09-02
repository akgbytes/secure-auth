import { app } from "@/app";
import { logger } from "@/utils/logger";
import { env } from "@/config/env";
import { connectDrizzle } from "@/db";

const PORT = env.PORT;

connectDrizzle();

app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});
