import { app } from "@/app";
import { logger } from "@/config/logger";

const PORT = 8080;
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});
