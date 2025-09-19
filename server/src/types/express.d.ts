import { userTable } from "@/db/schema/user.schema";
import { InferSelectModel } from "drizzle-orm";

type User = Pick<InferSelectModel<typeof userTable>, "id" | "email" | "role">;

declare global {
  namespace Express {
    export interface Request {
      user?: User;
      userSessionId?: string;
    }
  }
}
