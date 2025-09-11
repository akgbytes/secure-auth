import { UserRole } from "@/constants";
import {
  ApiError,
  ApiResponse,
  asyncHandler,
  HttpStatus,
  logger,
} from "@/core";
import { db } from "@/db";
import { sessionTable, userTable } from "@/db/schema";
import { and, desc, eq, ne } from "drizzle-orm";
import { userPublicFields } from "./admin.utils";

export const getAllUsers = asyncHandler(async (req, res) => {
  const adminId = req.user?.id;

  if (!adminId) {
    throw new ApiError(HttpStatus.UNAUTHORIZED, "Unauthorized");
  }

  const users = await db
    .select(userPublicFields)
    .from(userTable)
    .where(ne(userTable.id, adminId))
    .orderBy(desc(userTable.createdAt));

  logger.info(`Admin fetched all users`);

  res
    .status(HttpStatus.OK)
    .json(
      new ApiResponse(HttpStatus.OK, "All users fetched successfully", users)
    );
});

export const getUserById = asyncHandler(async (req, res) => {
  const userId = req.params.id as string;

  const [user] = await db
    .select(userPublicFields)
    .from(userTable)
    .where(eq(userTable.id, userId));

  if (!user) {
    throw new ApiError(HttpStatus.NOT_FOUND, "User not found");
  }

  logger.info(`Admin fetched user with id ${userId}`);

  res
    .status(HttpStatus.OK)
    .json(new ApiResponse(HttpStatus.OK, "User fetched successfully", user));
});

export const logoutUserSession = asyncHandler(async (req, res) => {
  const sessionId = req.params.id as string;

  const [session] = await db
    .delete(sessionTable)
    .where(eq(sessionTable.id, sessionId))
    .returning();

  if (!session) {
    throw new ApiError(HttpStatus.NOT_FOUND, "Session not found");
  }

  res
    .status(HttpStatus.OK)
    .json(
      new ApiResponse(HttpStatus.OK, "User session deleted successfully", null)
    );
});

export const updateUserRole = asyncHandler(async (req, res) => {
  const userId = req.params.id as string;

  const role = req.body.role as UserRole;

  const [user] = await db
    .update(userTable)
    .set({
      role,
    })
    .where(eq(userTable.id, userId))
    .returning(userPublicFields);

  if (!user) {
    throw new ApiError(HttpStatus.NOT_FOUND, "User not found");
  }

  res
    .status(HttpStatus.OK)
    .json(
      new ApiResponse(HttpStatus.OK, "User role updated successfully", user)
    );
});

export const deleteUserById = asyncHandler(async (req, res) => {
  const userId = req.params.id as string;

  const [deletedUser] = await db
    .delete(userTable)
    .where(eq(userTable.id, userId))
    .returning(userPublicFields);

  if (!deletedUser) {
    throw new ApiError(HttpStatus.NOT_FOUND, "User not found");
  }

  res
    .status(HttpStatus.OK)
    .json(
      new ApiResponse(HttpStatus.OK, "User deleted successfully", deletedUser)
    );
});
