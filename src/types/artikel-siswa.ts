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
};
