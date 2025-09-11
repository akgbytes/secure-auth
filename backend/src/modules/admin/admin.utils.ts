import { userTable } from "@/db/schema";

export const userPublicFields = {
  createdAt: userTable.createdAt,
  updatedAt: userTable.updatedAt,
  id: userTable.id,
  name: userTable.name,
  email: userTable.email,
  emailVerified: userTable.emailVerified,
  role: userTable.role,
  provider: userTable.provider,
  avatar: userTable.avatar,
};
