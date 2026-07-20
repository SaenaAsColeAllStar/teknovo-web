import { PrismaClient } from "../../generated/platform-client/index.js";
import { getPlatformDatabaseUrl } from "./config";

const globalForPlatform = globalThis as unknown as {
  __teknovoPlatformPrisma?: PrismaClient;
};

/** Platform DB singleton — only used when PLATFORM_ENABLED=true (Node path). */
export function getPlatformPrisma(): PrismaClient {
  if (!globalForPlatform.__teknovoPlatformPrisma) {
    globalForPlatform.__teknovoPlatformPrisma = new PrismaClient({
      datasources: {
        db: { url: getPlatformDatabaseUrl() },
      },
      log:
        process.env.NODE_ENV === "development"
          ? ["warn", "error"]
          : ["error"],
    });
  }
  return globalForPlatform.__teknovoPlatformPrisma;
}

export async function disconnectPlatformPrisma(): Promise<void> {
  if (globalForPlatform.__teknovoPlatformPrisma) {
    await globalForPlatform.__teknovoPlatformPrisma.$disconnect();
    globalForPlatform.__teknovoPlatformPrisma = undefined;
  }
}
