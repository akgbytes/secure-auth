import { User } from "@/db/schema";

declare global {
  namespace Express {
    export interface Request {
      user?: User;
    }
  }
}
