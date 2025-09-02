import { db } from "@/db";
import { generateToken, hashPassword } from "./auth.utils";
import { RegisterInput } from "./auth.validators";
import { userTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { ApiError, HttpStatus } from "@/core";
import { emailQueue } from "@/queues/email";
import { sendVerificationMail } from "@/utils/mail";

export async function registerUser({ name, email, password }: RegisterInput) {
  const [existingUser] = await db
    .select()
    .from(userTable)
    .where(eq(userTable.email, email));

  if (existingUser)
    throw new ApiError(HttpStatus.CONFLICT, "Email already registered");

  const hashedPassword = await hashPassword(password);
  const { unHashedToken, hashedToken, tokenExpiry } = generateToken();

  const [user] = await db
    .insert(userTable)
    .values({ name, email, password: hashedPassword })
    .returning();

  if (!user)
    throw new ApiError(
      HttpStatus.INTERNAL_SERVER_ERROR,
      "Failed to register, Please try again."
    );

  emailQueue.add("sendVerifyEmail", {
    type: "verify",
    name: user.name,
    email: user.email,
    token: unHashedToken,
  });

  await sendVerificationMail(user.name, user.email, unHashedToken);

  return user;
}
