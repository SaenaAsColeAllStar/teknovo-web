/**
 * CMS users are Clerk-backed (`routes/users.ts`).
 * Platform DB has `users` + `tenant_memberships` (PRP Fase 10) for SaaS
 * control-plane membership — school CMS roles remain in Clerk metadata.
 *
 * This module reserves a Prisma repo surface for optional local mirror /
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
    note: "School CMS users remain Clerk-only. Platform `users` / memberships live in Platform DB when PLATFORM_ENABLED=true.",
  };
}
