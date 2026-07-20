import { d1AnalyticsOverview } from "../d1/analytics-repo";
import { prismaAnalyticsOverview } from "../prisma/analytics-repo";
import type { RuntimeBindings } from "../http";
import { hasPrisma } from "../runtime";

export async function analyticsOverview(env: RuntimeBindings) {
  if (hasPrisma(env)) return prismaAnalyticsOverview(env.prisma);
  return d1AnalyticsOverview(env.DB);
}
