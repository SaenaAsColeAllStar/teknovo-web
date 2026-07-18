import { z } from "zod";

const marqueeItemSchema = z.object({
  label: z.string().trim().min(1).max(240),
  href: z.string().trim().max(500),
});

/** Empty or absolute URL (validated loosely — empty allowed). */
const optionalHttpUrl = z
  .string()
  .trim()
  .max(500)
  .refine((v) => !v || /^https?:\/\//i.test(v), {
    message: "URL harus diawali http:// atau https://",
  });

export const zPengaturanSitusPublikPatch = z.object({
  landingMarquee: z.array(marqueeItemSchema).min(1).max(12),
  landingMarqueeLabel: z.string().trim().min(1).max(40),
  ppdbTahunAjaran: z.string().trim().min(1).max(80),
  ppdbGelombang1Label: z.string().trim().min(1).max(200),
  ppdbGelombang2Label: z.string().trim().min(1).max(200),
  ppdbJamLayanan: z.string().trim().min(1).max(120),
  ppdbBiayaKeterangan: z.string().trim().min(1).max(500),
  kontakTelepon: z.string().trim().max(32).nullable().optional(),
  kontakEmail: z.string().trim().email().max(120),
  kontakAlamat: z.string().trim().max(500).nullable().optional(),
  whatsappPpdb: z.string().trim().min(8).max(32),
  sambutanNamaKepala: z.string().trim().max(160).nullable().optional(),
  sambutanJabatan: z.string().trim().max(120).nullable().optional(),
  siteTitle: z.string().trim().min(1).max(120),
  siteDescription: z.string().trim().min(1).max(320),
  defaultOgImageUrl: optionalHttpUrl,
  googleAnalyticsId: z.string().trim().max(40),
  sosialInstagramUrl: optionalHttpUrl,
  sosialYoutubeUrl: optionalHttpUrl,
  sosialFacebookUrl: optionalHttpUrl,
  sosialTiktokUrl: optionalHttpUrl,
});

export type PengaturanSitusPublikPatchInput = z.infer<
  typeof zPengaturanSitusPublikPatch
>;
