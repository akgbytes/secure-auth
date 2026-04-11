import { app } from "@/app";
import { env } from "@/config/env";
import { connectDrizzle } from "@/db";
import { logger } from "@/utils/core/logger";

connectDrizzle();

const PORT = env.PORT;
app.listen(PORT, () => {
	logger.info(`Server is running on port ${PORT}`);
});
