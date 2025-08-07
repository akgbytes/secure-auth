import { PrismaClient } from "../generated/prisma/client";

export const prisma = new PrismaClient();

async function connectPrisma() {
  try {
    await prisma.$connect();
    console.log("Prisma connected to the database");
  } catch (error) {
    console.log("Prisma failed to connect to the database", error);
    process.exit(1);
  }
}

connectPrisma();
