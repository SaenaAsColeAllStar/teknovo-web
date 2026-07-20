import type { Prisma, PrismaClient } from "@prisma/client";
import {
  PENGATURAN_SITUS_PUBLIK_DEFAULTS,
  PENGATURAN_SITUS_PUBLIK_ID,
  type PengaturanSitusPublikData,
  type PengaturanSitusPublikPatchInput,
} from "@teknovo/shared";
import { toIsoRequired } from "./map-helpers";

function defaults(): PengaturanSitusPublikData {
  return {
    id: PENGATURAN_SITUS_PUBLIK_ID,
    ...PENGATURAN_SITUS_PUBLIK_DEFAULTS,
    updatedAt: null,
  };
}

function merge(
  partial: Partial<PengaturanSitusPublikData>,
): PengaturanSitusPublikData {
  return {
    ...defaults(),
    ...partial,
    id: PENGATURAN_SITUS_PUBLIK_ID,
    landingMarquee:
      partial.landingMarquee ?? PENGATURAN_SITUS_PUBLIK_DEFAULTS.landingMarquee,
  };
}

function parsePayload(
  payload: Prisma.JsonValue,
  updatedAt: Date,
): PengaturanSitusPublikData {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return defaults();
  }
  return merge({
    ...(payload as Partial<PengaturanSitusPublikData>),
    updatedAt: toIsoRequired(updatedAt),
  });
}

export async function prismaGetPengaturan(
  prisma: PrismaClient,
): Promise<PengaturanSitusPublikData> {
  const row = await prisma.pengaturan.findUnique({
    where: { id: PENGATURAN_SITUS_PUBLIK_ID },
  });
  if (!row) return defaults();
  return parsePayload(row.payload, row.updatedAt);
}

export async function prismaUpsertPengaturan(
  prisma: PrismaClient,
  input: PengaturanSitusPublikPatchInput,
): Promise<PengaturanSitusPublikData> {
  const now = new Date();
  const data = merge({ ...input, updatedAt: toIsoRequired(now) });
  const payload = {
    ...data,
    id: PENGATURAN_SITUS_PUBLIK_ID,
  };

  await prisma.pengaturan.upsert({
    where: { id: PENGATURAN_SITUS_PUBLIK_ID },
    create: {
      id: PENGATURAN_SITUS_PUBLIK_ID,
      payload,
    },
    update: {
      payload,
    },
  });
  return data;
}
