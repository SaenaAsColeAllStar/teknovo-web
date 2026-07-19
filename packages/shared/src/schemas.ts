import { z } from "zod";

export const beritaFormSchema = z.object({
  judul: z.string().min(3).max(200),
  slug: z
    .string()
    .min(3)
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  ringkasan: z.string().max(500).optional(),
  konten: z.string().min(1),
  kategoriId: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
  coverUrl: z.string().url().optional().or(z.literal("")),
  metaTitle: z.string().max(70).optional().or(z.literal("")),
  metaDescription: z.string().max(160).optional().or(z.literal("")),
  metaKeywords: z.string().max(200).optional().or(z.literal("")),
  ogImageUrl: z.string().url().optional().or(z.literal("")),
  canonicalUrl: z.string().url().optional().or(z.literal("")),
});

export type BeritaFormValues = z.infer<typeof beritaFormSchema>;

export const artikelSiswaFormSchema = z.object({
  judul: z.string().min(3).max(200),
  slug: z
    .string()
    .min(3)
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  ringkasan: z.string().max(500).optional(),
  konten: z.string().min(1),
  kategoriId: z.string().optional(),
  status: z.enum(["DRAFT", "REVIEW", "PUBLISHED", "ARCHIVED"]),
  coverUrl: z.string().url().optional().or(z.literal("")),
  penulisKelas: z.string().max(50).optional(),
  metaTitle: z.string().max(70).optional().or(z.literal("")),
  metaDescription: z.string().max(160).optional().or(z.literal("")),
  metaKeywords: z.string().max(200).optional().or(z.literal("")),
  ogImageUrl: z.string().url().optional().or(z.literal("")),
  canonicalUrl: z.string().url().optional().or(z.literal("")),
});

export type ArtikelSiswaFormValues = z.infer<typeof artikelSiswaFormSchema>;

export const kategoriFormSchema = z.object({
  nama: z.string().min(2).max(100),
  slug: z
    .string()
    .min(2)
    .max(100)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  deskripsi: z.string().max(500).optional(),
});

export type KategoriFormValues = z.infer<typeof kategoriFormSchema>;

const siteContentStatus = z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]);

const optionalUrl = z.string().url().optional().or(z.literal(""));

export const fasilitasFormSchema = z.object({
  title: z.string().min(2).max(160),
  slug: z
    .string()
    .min(2)
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  navLabel: z.string().min(1).max(60),
  description: z.string().min(1).max(800),
  coverUrl: optionalUrl,
  highlights: z.array(z.string().min(1).max(120)).max(12).default([]),
  paragraphs: z.array(z.string().min(1).max(4000)).max(20).default([]),
  extras: z
    .object({
      features: z
        .array(
          z.object({
            id: z.string().min(1).max(60),
            title: z.string().min(1).max(120),
            description: z.string().min(1).max(500),
          }),
        )
        .max(12)
        .optional(),
      hours: z
        .array(
          z.object({
            label: z.string().min(1).max(80),
            value: z.string().min(1).max(120),
          }),
        )
        .max(12)
        .optional(),
      services: z
        .array(
          z.object({
            audience: z.string().min(1).max(80),
            items: z.array(z.string().min(1).max(200)).max(12),
          }),
        )
        .max(8)
        .optional(),
      stats: z
        .array(
          z.object({
            label: z.string().min(1).max(80),
            value: z.string().min(1).max(120),
          }),
        )
        .max(8)
        .optional(),
      pathwaySteps: z
        .array(
          z.object({
            step: z.string().min(1).max(12),
            title: z.string().min(1).max(120),
            description: z.string().min(1).max(500),
          }),
        )
        .max(12)
        .optional(),
      quote: z
        .object({
          text: z.string().min(1).max(800),
          attribution: z.string().min(1).max(160),
        })
        .optional(),
      splitNarrative: z
        .object({
          title: z.string().min(1).max(160),
          paragraphs: z.array(z.string().min(1).max(4000)).max(12),
        })
        .optional(),
    })
    .default({}),
  sortOrder: z.number().int().min(0).max(9999).default(0),
  showInNav: z.boolean().default(true),
  status: siteContentStatus,
});

export type FasilitasFormValues = z.infer<typeof fasilitasFormSchema>;

export const ekstrakurikulerFormSchema = z.object({
  name: z.string().min(2).max(160),
  slug: z
    .string()
    .min(2)
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  detail: z.string().min(1).max(400),
  fullDescription: z.string().min(1).max(4000),
  kategori: z.enum(["TEKNOLOGI", "OLAHRAGA", "AKADEMIK", "SENI"]),
  previewUrl: optionalUrl,
  relatedAchievements: z.array(z.string().min(1).max(200)).max(12).default([]),
  jadwalRingkas: z.string().max(200).optional().or(z.literal("")),
  lokasiLatihan: z.string().max(200).optional().or(z.literal("")),
  pembinaNama: z.string().max(120).optional().or(z.literal("")),
  sortOrder: z.number().int().min(0).max(9999).default(0),
  status: siteContentStatus,
});

export type EkstrakurikulerFormValues = z.infer<
  typeof ekstrakurikulerFormSchema
>;

export const prestasiFormSchema = z.object({
  judul: z.string().min(3).max(200),
  penyelenggara: z.string().min(2).max(160),
  tanggalIso: z.string().min(4).max(40),
  siswaLabel: z.string().min(1).max(160),
  ringkasan: z.string().min(1).max(800),
  fileUrl: z.string().url(),
  sortOrder: z.number().int().min(0).max(9999).default(0),
  status: siteContentStatus,
});

export type PrestasiFormValues = z.infer<typeof prestasiFormSchema>;

export const siteMediaPatchSchema = z.object({
  url: z.string().url(),
  label: z.string().min(1).max(160).optional(),
});

export type SiteMediaPatchValues = z.infer<typeof siteMediaPatchSchema>;

const marqueeItemSchema = z.object({
  label: z.string().trim().min(1).max(240),
  href: z.string().trim().max(500),
});

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

/**
 * Create / invite CMS user via Clerk.
 * Assignable roles are further restricted by actor in the API
 * (`admin` → admin|editor|siswa|viewer; `editor` → siswa).
 */
export const cmsUserCreateSchema = z.object({
  email: z.string().trim().email().max(120),
  nama: z.union([z.string().trim().max(160), z.literal("")]).optional(),
  role: z.enum(["admin", "editor", "siswa", "viewer"]),
  /** If set (≥8), create account immediately with derived Clerk username.
   * Must be a unique login password (not DB/D1 secrets). Clerk rejects
   * passwords found in Have I Been Pwned. If omitted/empty, send invitation. */
  password: z
    .union([z.literal(""), z.string().min(8).max(128)])
    .optional(),
});

export type CmsUserCreateInput = z.infer<typeof cmsUserCreateSchema>;

export const cmsUserPatchSchema = z
  .object({
    /** Super Admin may assign `admin`; editors are limited by API matrix. */
    role: z.enum(["admin", "editor", "viewer", "siswa"]).optional(),
    nama: z.string().trim().max(160).optional().or(z.literal("")),
  })
  .refine((v) => v.role !== undefined || v.nama !== undefined, {
    message: "Minimal satu field (role atau nama) wajib diisi.",
  });

export type CmsUserPatchInput = z.infer<typeof cmsUserPatchSchema>;

export type CmsUserListItem = {
  id: string;
  email: string | null;
  name: string | null;
  role: "admin" | "editor" | "viewer" | "siswa";
  createdAt: string;
};

export function slugifyJudul(judul: string): string {
  return judul
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 200);
}
