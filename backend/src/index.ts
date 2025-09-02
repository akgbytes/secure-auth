import { app } from "@/app";
import { logger } from "@/utils/logger";
import { env } from "@/config/env";

const PORT = env.PORT;

app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});
