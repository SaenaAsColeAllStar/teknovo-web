export type BeritaStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export type BeritaListItem = {
  id: string;
  judul: string;
  slug: string;
  ringkasan: string | null;
  coverUrl: string | null;
  status: BeritaStatus;
  publishedAt: string | null;
  kategori?: {
    id: string;
    nama: string;
    slug: string;
  } | null;
};

export type Berita = BeritaListItem & {
  konten: string;
  createdAt: string;
  updatedAt: string;
  /** Override judul untuk <title> / OG; kosong = pakai judul. */
  metaTitle?: string | null;
  /** Meta description; kosong = pakai ringkasan. */
  metaDescription?: string | null;
  /** OG image; kosong = pakai coverUrl. */
  ogImageUrl?: string | null;
  /** Canonical URL absolut opsional. */
  canonicalUrl?: string | null;
  penulis?: {
    id: string;
    nama: string;
  } | null;
};
