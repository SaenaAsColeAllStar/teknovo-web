export type ArtikelSiswaStatus =
  | "DRAFT"
  | "REVIEW"
  | "PUBLISHED"
  | "ARCHIVED";

export type ArtikelSiswaListItem = {
  id: string;
  judul: string;
  slug: string;
  ringkasan: string | null;
  coverUrl: string | null;
  status: ArtikelSiswaStatus;
  publishedAt: string | null;
  submittedAt?: string | null;
  rejectedReason?: string | null;
  penulis?: {
    id: string;
    nama: string;
    kelas?: string | null;
  } | null;
  kategori?: {
    id: string;
    nama: string;
    slug: string;
  } | null;
};

export type ArtikelSiswa = ArtikelSiswaListItem & {
  konten: string;
  createdAt: string;
  updatedAt: string;
  /** Override judul untuk <title> / OG; kosong = pakai judul. */
  metaTitle?: string | null;
  /** Meta description; kosong = pakai ringkasan. */
  metaDescription?: string | null;
  /** Kata kunci meta (opsional, dipisah koma). */
  metaKeywords?: string | null;
  /** OG image; kosong = pakai coverUrl. */
  ogImageUrl?: string | null;
  /** Canonical URL absolut opsional. */
  canonicalUrl?: string | null;
};
