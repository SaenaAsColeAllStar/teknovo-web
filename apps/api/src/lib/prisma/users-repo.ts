/**
 * CMS users are Clerk-backed (`routes/users.ts`) — there is no tenant
 * `users` table in the current Prisma schema (Platform DB lands in Fase 10).
 *
 * This module reserves the Prisma repo surface for a future local mirror /
 * membership sync. Until then, call Clerk via the existing users routes.
 */
import type { PrismaClient } from "@prisma/client";

export type CmsUserSyncStub = {
  source: "clerk";
  note: string;
};

/** Connectivity / readiness probe — does not list Clerk users. */
export async function prismaUsersRepoReady(
  prisma: PrismaClient,
): Promise<CmsUserSyncStub> {
  await prisma.$queryRaw`SELECT 1`;
  return {
    source: "clerk",
    note: "Users remain Clerk-only until Platform DB (PRP Fase 10). No Prisma User model yet.",
  };
}
