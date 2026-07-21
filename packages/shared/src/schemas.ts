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

const siteContentStatus = z.enum([
  "DRAFT",
  "PENDING_REVIEW",
  "PUBLISHED",
  "REJECTED",
  "ARCHIVED",
]);

export const siteContentRejectSchema = z.object({
  note: z.string().min(1).max(2000),
});

export type SiteContentRejectValues = z.infer<typeof siteContentRejectSchema>;

const optionalUrl = z.string().url().optional().or(z.literal(""));

export const siteContentLayoutConfigSchema = z
  .object({
    showHero: z.boolean().default(true),
    showFeatures: z.boolean().default(true),
    showHours: z.boolean().default(true),
    showStats: z.boolean().default(false),
    layoutTemplate: z.string().min(1).max(60).default("default"),
  })
  .default({
    showHero: true,
    showFeatures: true,
    showHours: true,
    showStats: false,
    layoutTemplate: "default",
  });

export type SiteContentLayoutConfigValues = z.infer<
  typeof siteContentLayoutConfigSchema
>;

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
  layoutConfig: siteContentLayoutConfigSchema,
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
  layoutConfig: siteContentLayoutConfigSchema,
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
  layoutConfig: siteContentLayoutConfigSchema,
  sortOrder: z.number().int().min(0).max(9999).default(0),
  status: siteContentStatus,
});

export type PrestasiFormValues = z.infer<typeof prestasiFormSchema>;

const siteContentSlug = z
  .string()
  .min(2)
  .max(120)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

export const kurikulumFormSchema = z.object({
  judul: z.string().min(2).max(200),
  slug: siteContentSlug,
  deskripsi: z.string().min(1).max(8000),
  coverUrl: optionalUrl,
  dokumenUrl: optionalUrl,
  tahunAjaran: z.string().min(1).max(40),
  jurusan: z.array(z.string().min(1).max(120)).max(20).default([]),
  strukturKurikulum: z.unknown().nullable().optional(),
  layoutConfig: siteContentLayoutConfigSchema,
  sortOrder: z.number().int().min(0).max(9999).default(0),
  showInNav: z.boolean().default(true),
  status: siteContentStatus,
});

export type KurikulumFormValues = z.infer<typeof kurikulumFormSchema>;

export const programSekolahFormSchema = z.object({
  judul: z.string().min(2).max(200),
  slug: siteContentSlug,
  deskripsi: z.string().min(1).max(8000),
  coverUrl: optionalUrl,
  ikon: z.string().max(500).optional().or(z.literal("")),
  kategori: z.enum(["AKADEMIK", "NON_AKADEMIK", "KEAGAMAAN"]),
  highlightItems: z.array(z.string().min(1).max(200)).max(20).default([]),
  layoutConfig: siteContentLayoutConfigSchema,
  sortOrder: z.number().int().min(0).max(9999).default(0),
  showInNav: z.boolean().default(true),
  status: siteContentStatus,
});

export type ProgramSekolahFormValues = z.infer<typeof programSekolahFormSchema>;

export const programJurusanFormSchema = z.object({
  nama: z.string().min(2).max(200),
  slug: siteContentSlug,
  singkatan: z.string().min(1).max(20),
  deskripsi: z.string().min(1).max(8000),
  coverUrl: optionalUrl,
  ikon: z.string().max(500).optional().or(z.literal("")),
  prospekKerja: z.array(z.string().min(1).max(200)).max(30).default([]),
  kompetensiDasar: z.array(z.string().min(1).max(200)).max(30).default([]),
  fasilitas: z.array(z.string().min(1).max(200)).max(30).default([]),
  jumlahSiswa: z.number().int().min(0).max(100000).nullable().optional(),
  linkPendaftaran: optionalUrl,
  layoutConfig: siteContentLayoutConfigSchema,
  sortOrder: z.number().int().min(0).max(9999).default(0),
  showInNav: z.boolean().default(true),
  status: siteContentStatus,
});

export type ProgramJurusanFormValues = z.infer<typeof programJurusanFormSchema>;

export const tenagaPengajarFormSchema = z.object({
  nama: z.string().min(2).max(160),
  slug: siteContentSlug,
  nip: z.string().max(40).optional().or(z.literal("")),
  fotoUrl: optionalUrl,
  jabatan: z.string().min(1).max(160),
  bidangKeahlian: z.string().max(200).optional().or(z.literal("")),
  mataPelajaran: z.array(z.string().min(1).max(120)).max(30).default([]),
  pendidikan: z.string().max(200).optional().or(z.literal("")),
  pengalaman: z.string().max(8000).optional().or(z.literal("")),
  kontakEmail: z
    .string()
    .email()
    .max(120)
    .optional()
    .or(z.literal("")),
  mediaSosial: z.record(z.string(), z.string().max(500)).nullable().optional(),
  layoutConfig: siteContentLayoutConfigSchema,
  sortOrder: z.number().int().min(0).max(9999).default(0),
  showInNav: z.boolean().default(true),
  status: siteContentStatus,
});

export type TenagaPengajarFormValues = z.infer<typeof tenagaPengajarFormSchema>;

const kontakJamOperasionalSchema = z.object({
  hari: z.string().min(1).max(80),
  buka: z.string().min(1).max(40),
  tutup: z.string().min(1).max(40),
});

export const kontakFormSchema = z.object({
  label: z.string().min(2).max(160),
  slug: siteContentSlug,
  alamatLengkap: z.string().min(1).max(4000),
  telepon: z.array(z.string().min(1).max(40)).max(10).default([]),
  email: z.array(z.string().email().max(120)).max(10).default([]),
  whatsapp: z.string().max(40).optional().or(z.literal("")),
  googleMapsUrl: optionalUrl,
  googleMapsEmbed: z.string().max(8000).optional().or(z.literal("")),
  jamOperasional: z
    .array(kontakJamOperasionalSchema)
    .max(14)
    .nullable()
    .optional(),
  mediaSosial: z.record(z.string(), z.string().max(500)).nullable().optional(),
  layoutConfig: siteContentLayoutConfigSchema,
  sortOrder: z.number().int().min(0).max(9999).default(0),
  showInNav: z.boolean().default(true),
  status: siteContentStatus,
});

export type KontakFormValues = z.infer<typeof kontakFormSchema>;

export const pengumumanFormSchema = z.object({
  judul: z.string().min(2).max(200),
  slug: siteContentSlug,
  konten: z.string().min(1).max(20000),
  tipe: z.enum(["INFO", "WARNING", "URGENT"]).default("INFO"),
  bannerUrl: optionalUrl,
  tanggalMulai: z.string().max(40).nullable().optional().or(z.literal("")),
  tanggalAkhir: z.string().max(40).nullable().optional().or(z.literal("")),
  isSticky: z.boolean().default(false),
  layoutConfig: siteContentLayoutConfigSchema,
  sortOrder: z.number().int().min(0).max(9999).default(0),
  status: siteContentStatus,
});

export type PengumumanFormValues = z.infer<typeof pengumumanFormSchema>;

/** Batch sortOrder update for site-content list drag-and-drop. */
export const siteContentReorderSchema = z.object({
  items: z
    .array(
      z.object({
        id: z.string().uuid(),
        sortOrder: z.number().int().min(0).max(9999),
      }),
    )
    .min(1)
    .max(200),
});

export type SiteContentReorderValues = z.infer<typeof siteContentReorderSchema>;

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
  /**
   * Invitation lifetime in days (Clerk `expiresInDays`).
   * Default 7 when omitted; only applies when sending an invitation (no password).
   * Clerk default is 30; we prefer a shorter CMS default.
   */
  expiresInDays: z.number().int().min(1).max(30).optional(),
});

export type CmsUserCreateInput = z.infer<typeof cmsUserCreateSchema>;

export const CMS_INVITE_EXPIRY_PRESETS = [1, 3, 7, 14, 30] as const;
export type CmsInviteExpiryDays = (typeof CMS_INVITE_EXPIRY_PRESETS)[number];
export const CMS_INVITE_EXPIRY_DEFAULT: CmsInviteExpiryDays = 7;

export type CmsInvitationStatus =
  | "pending"
  | "accepted"
  | "revoked"
  | "expired";

export type CmsInvitationListItem = {
  id: string;
  email: string;
  role: "admin" | "editor" | "viewer" | "siswa";
  status: CmsInvitationStatus;
  createdAt: string;
  /** Approximate expiry from create-time `expiresInDays` (stored in metadata). */
  expiresAt: string | null;
  expiresInDays: number | null;
  url: string | null;
  revoked: boolean;
};

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
