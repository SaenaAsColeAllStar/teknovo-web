import type { RuntimeBindings } from "../http";
import { hasPrisma } from "../runtime";
import {
  prismaApproveSiteContent,
  prismaListPendingSiteContent,
  prismaRejectSiteContent,
  prismaReorderSiteContent,
  prismaSubmitSiteContent,
  type SiteContentApprovalRow,
  type SiteContentEntityPath,
  type SiteContentPendingItem,
} from "../prisma/site-content-approval";

export type {
  SiteContentApprovalRow,
  SiteContentEntityPath,
  SiteContentPendingItem,
};

export class SiteContentApprovalUnavailableError extends Error {
  constructor() {
    super("Approval workflow memerlukan Prisma (Node API).");
    this.name = "SiteContentApprovalUnavailableError";
  }
}

function requirePrisma(env: RuntimeBindings) {
  if (!hasPrisma(env)) throw new SiteContentApprovalUnavailableError();
  return env.prisma;
}

export async function submitSiteContent(
  env: RuntimeBindings,
  entity: SiteContentEntityPath,
  id: string,
): Promise<SiteContentApprovalRow | null> {
  return prismaSubmitSiteContent(requirePrisma(env), entity, id);
}

export async function approveSiteContent(
  env: RuntimeBindings,
  entity: SiteContentEntityPath,
  id: string,
  reviewerId: string,
): Promise<SiteContentApprovalRow | null> {
  return prismaApproveSiteContent(requirePrisma(env), entity, id, reviewerId);
}

export async function rejectSiteContent(
  env: RuntimeBindings,
  entity: SiteContentEntityPath,
  id: string,
  reviewerId: string,
  note: string,
): Promise<SiteContentApprovalRow | null> {
  return prismaRejectSiteContent(
    requirePrisma(env),
    entity,
    id,
    reviewerId,
    note,
  );
}

export async function listPendingSiteContent(
  env: RuntimeBindings,
  limitPerEntity = 50,
): Promise<SiteContentPendingItem[]> {
  return prismaListPendingSiteContent(requirePrisma(env), limitPerEntity);
}

export async function reorderSiteContent(
  env: RuntimeBindings,
  entity: SiteContentEntityPath,
  items: { id: string; sortOrder: number }[],
): Promise<{ updated: number }> {
  return prismaReorderSiteContent(requirePrisma(env), entity, items);
}
