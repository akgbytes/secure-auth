import { db } from "@/db";
import { RegisterInput, hashPassword } from "@/modules/auth";
import { userTable } from "@/db/schemas";
import { eq } from "drizzle-orm";
import { ApiError, HttpStatus } from "@/core";

export async function registerUser({ name, email, password }: RegisterInput) {
  const [existingUser] = await db
    .select()
    .from(userTable)
    .where(eq(userTable.email, email));

  if (existingUser)
    throw new ApiError(HttpStatus.CONFLICT, "Email already registered");

  const hashedPassword = await hashPassword(password);

  const [user] = await db
    .insert(userTable)
    .values({ name, email, password: hashedPassword })
    .returning();

  if (!user)
    throw new ApiError(
      HttpStatus.INTERNAL_SERVER_ERROR,
      "Failed to register, Please try again."
    );

  return user;
}
