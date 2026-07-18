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

/** Create CMS user via Clerk (admin only). */
export const cmsUserCreateSchema = z.object({
  email: z.string().trim().email().max(120),
  nama: z.union([z.string().trim().max(160), z.literal("")]).optional(),
  role: z.enum(["admin", "editor", "siswa"]),
  /** If set (≥8), create account immediately. If omitted/empty, send Clerk invitation. */
  password: z
    .union([z.literal(""), z.string().min(8).max(128)])
    .optional(),
});

export type CmsUserCreateInput = z.infer<typeof cmsUserCreateSchema>;

export const cmsUserPatchSchema = z
  .object({
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
