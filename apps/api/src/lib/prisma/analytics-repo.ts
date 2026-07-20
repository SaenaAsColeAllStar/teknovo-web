import type { PrismaClient } from "@prisma/client";
import type { CmsAnalyticsOverview } from "@teknovo/shared";
import { getAnalyticsOverview } from "../procedures/analytics";

/** Overview via `fn_get_analytics_overview` (single round-trip). */
export async function prismaAnalyticsOverview(
  prisma: PrismaClient,
): Promise<CmsAnalyticsOverview> {
  return getAnalyticsOverview(prisma);
}
