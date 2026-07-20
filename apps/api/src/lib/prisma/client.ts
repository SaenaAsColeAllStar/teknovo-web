import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  __teknovoPrisma?: PrismaClient;
};

/** Prisma singleton — Node/VPS runtime only (not used on Workers). */
export function getPrisma(): PrismaClient {
  if (!globalForPrisma.__teknovoPrisma) {
    globalForPrisma.__teknovoPrisma = new PrismaClient({
      log:
        process.env.NODE_ENV === "development"
          ? ["warn", "error"]
          : ["error"],
    });
  }
  return globalForPrisma.__teknovoPrisma;
}

export async function disconnectPrisma(): Promise<void> {
  if (globalForPrisma.__teknovoPrisma) {
    await globalForPrisma.__teknovoPrisma.$disconnect();
    globalForPrisma.__teknovoPrisma = undefined;
  }
}
