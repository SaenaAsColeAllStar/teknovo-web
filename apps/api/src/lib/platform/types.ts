/** Shared platform tenant context — no Prisma import (safe for Worker typecheck). */

export type TenantStatus =
  | "PROVISIONING"
  | "ACTIVE"
  | "SUSPENDED"
  | "DELETING"
  | "DELETED";

export type TenantContext = {
  id: string;
  slug: string;
  domain: string | null;
  status: TenantStatus;
  minioBucket: string | null;
};

export type TenantResolveSource =
  | "header-id"
  | "header-slug"
  | "subdomain"
  | "path"
  | "none";
