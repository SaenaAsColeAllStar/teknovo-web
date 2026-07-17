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
  penulis?: {
    id: string;
    nama: string;
  } | null;
};
