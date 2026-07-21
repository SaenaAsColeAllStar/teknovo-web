/** Shared CMS content types — fasilitas / ekstrakurikuler / prestasi / site media. */

export type SiteContentStatus =
  | "DRAFT"
  | "PENDING_REVIEW"
  | "PUBLISHED"
  | "REJECTED"
  | "ARCHIVED";

/** Review metadata shared by all site-content entities. */
export type SiteContentReviewFields = {
  reviewedBy: string | null;
  reviewedAt: string | null;
  reviewNote: string | null;
};

/** Section visibility + template for public page rendering. */
export type SiteContentLayoutConfig = {
  showHero: boolean;
  showFeatures: boolean;
  showHours: boolean;
  showStats: boolean;
  layoutTemplate: "default" | string;
};

export const DEFAULT_SITE_CONTENT_LAYOUT_CONFIG: SiteContentLayoutConfig = {
  showHero: true,
  showFeatures: true,
  showHours: true,
  showStats: false,
  layoutTemplate: "default",
};

export type FasilitasFeaturePillar = {
  id: string;
  title: string;
  description: string;
};

export type FasilitasHoursRow = { label: string; value: string };
export type FasilitasServiceBand = { audience: string; items: string[] };
export type FasilitasStatChip = { label: string; value: string };
export type FasilitasPathwayStep = {
  step: string;
  title: string;
  description: string;
};
export type FasilitasQuote = { text: string; attribution: string };
export type FasilitasSplitNarrative = {
  title: string;
  paragraphs: string[];
};

export type FasilitasExtras = {
  features?: FasilitasFeaturePillar[];
  hours?: FasilitasHoursRow[];
  services?: FasilitasServiceBand[];
  stats?: FasilitasStatChip[];
  pathwaySteps?: FasilitasPathwayStep[];
  quote?: FasilitasQuote;
  splitNarrative?: FasilitasSplitNarrative;
};

export type FasilitasListItem = {
  id: string;
  slug: string;
  title: string;
  navLabel: string;
  description: string;
  coverUrl: string | null;
  sortOrder: number;
  showInNav: boolean;
  status: SiteContentStatus;
  reviewedBy: string | null;
  reviewedAt: string | null;
  reviewNote: string | null;
  publishedAt: string | null;
};

export type Fasilitas = FasilitasListItem & {
  highlights: string[];
  paragraphs: string[];
  extras: FasilitasExtras;
  layoutConfig: SiteContentLayoutConfig;
  createdAt: string;
  updatedAt: string;
};

export type EkskulKategori = "TEKNOLOGI" | "OLAHRAGA" | "AKADEMIK" | "SENI";

export type EkstrakurikulerListItem = {
  id: string;
  slug: string;
  name: string;
  detail: string;
  kategori: EkskulKategori;
  previewUrl: string | null;
  sortOrder: number;
  status: SiteContentStatus;
  reviewedBy: string | null;
  reviewedAt: string | null;
  reviewNote: string | null;
  publishedAt: string | null;
};

export type Ekstrakurikuler = EkstrakurikulerListItem & {
  fullDescription: string;
  relatedAchievements: string[];
  jadwalRingkas: string | null;
  lokasiLatihan: string | null;
  pembinaNama: string | null;
  layoutConfig: SiteContentLayoutConfig;
  createdAt: string;
  updatedAt: string;
};

export type PrestasiListItem = {
  id: string;
  judul: string;
  penyelenggara: string;
  tanggalIso: string;
  siswaLabel: string;
  ringkasan: string;
  fileUrl: string;
  sortOrder: number;
  status: SiteContentStatus;
  reviewedBy: string | null;
  reviewedAt: string | null;
  reviewNote: string | null;
  publishedAt: string | null;
};

export type Prestasi = PrestasiListItem & {
  layoutConfig: SiteContentLayoutConfig;
  createdAt: string;
  updatedAt: string;
};

export type SiteMediaItem = {
  mediaKey: string;
  label: string;
  category: string;
  url: string;
  updatedAt: string;
  updatedBy: string | null;
};

export type KurikulumListItem = {
  id: string;
  slug: string;
  judul: string;
  deskripsi: string;
  coverUrl: string | null;
  tahunAjaran: string;
  sortOrder: number;
  showInNav: boolean;
  status: SiteContentStatus;
  reviewedBy: string | null;
  reviewedAt: string | null;
  reviewNote: string | null;
  publishedAt: string | null;
};

export type Kurikulum = KurikulumListItem & {
  dokumenUrl: string | null;
  jurusan: string[];
  strukturKurikulum: unknown | null;
  layoutConfig: SiteContentLayoutConfig;
  createdAt: string;
  updatedAt: string;
};

export type ProgramSekolahKategori =
  | "AKADEMIK"
  | "NON_AKADEMIK"
  | "KEAGAMAAN";

export type ProgramSekolahListItem = {
  id: string;
  slug: string;
  judul: string;
  deskripsi: string;
  coverUrl: string | null;
  ikon: string | null;
  kategori: ProgramSekolahKategori;
  sortOrder: number;
  showInNav: boolean;
  status: SiteContentStatus;
  reviewedBy: string | null;
  reviewedAt: string | null;
  reviewNote: string | null;
  publishedAt: string | null;
};

export type ProgramSekolah = ProgramSekolahListItem & {
  highlightItems: string[];
  layoutConfig: SiteContentLayoutConfig;
  createdAt: string;
  updatedAt: string;
};

export type ProgramJurusanListItem = {
  id: string;
  slug: string;
  nama: string;
  singkatan: string;
  deskripsi: string;
  coverUrl: string | null;
  ikon: string | null;
  sortOrder: number;
  showInNav: boolean;
  status: SiteContentStatus;
  reviewedBy: string | null;
  reviewedAt: string | null;
  reviewNote: string | null;
  publishedAt: string | null;
};

export type ProgramJurusan = ProgramJurusanListItem & {
  prospekKerja: string[];
  kompetensiDasar: string[];
  fasilitas: string[];
  jumlahSiswa: number | null;
  linkPendaftaran: string | null;
  layoutConfig: SiteContentLayoutConfig;
  createdAt: string;
  updatedAt: string;
};

export type TenagaPengajarMediaSosial = Record<string, string>;

export type TenagaPengajarListItem = {
  id: string;
  slug: string;
  nama: string;
  fotoUrl: string | null;
  jabatan: string;
  bidangKeahlian: string | null;
  sortOrder: number;
  showInNav: boolean;
  status: SiteContentStatus;
  reviewedBy: string | null;
  reviewedAt: string | null;
  reviewNote: string | null;
  publishedAt: string | null;
};

export type TenagaPengajar = TenagaPengajarListItem & {
  nip: string | null;
  mataPelajaran: string[];
  pendidikan: string | null;
  pengalaman: string | null;
  kontakEmail: string | null;
  mediaSosial: TenagaPengajarMediaSosial | null;
  layoutConfig: SiteContentLayoutConfig;
  createdAt: string;
  updatedAt: string;
};

export type KontakJamOperasional = {
  hari: string;
  buka: string;
  tutup: string;
};

export type KontakMediaSosial = Record<string, string>;

export type KontakListItem = {
  id: string;
  slug: string;
  label: string;
  alamatLengkap: string;
  telepon: string[];
  email: string[];
  whatsapp: string | null;
  sortOrder: number;
  showInNav: boolean;
  status: SiteContentStatus;
  reviewedBy: string | null;
  reviewedAt: string | null;
  reviewNote: string | null;
  publishedAt: string | null;
};

export type Kontak = KontakListItem & {
  googleMapsUrl: string | null;
  googleMapsEmbed: string | null;
  jamOperasional: KontakJamOperasional[] | null;
  mediaSosial: KontakMediaSosial | null;
  layoutConfig: SiteContentLayoutConfig;
  createdAt: string;
  updatedAt: string;
};

export type PengumumanTipe = "INFO" | "WARNING" | "URGENT";

export type PengumumanListItem = {
  id: string;
  slug: string;
  judul: string;
  tipe: PengumumanTipe;
  bannerUrl: string | null;
  tanggalMulai: string | null;
  tanggalAkhir: string | null;
  isSticky: boolean;
  sortOrder: number;
  status: SiteContentStatus;
  reviewedBy: string | null;
  reviewedAt: string | null;
  reviewNote: string | null;
  publishedAt: string | null;
};

export type Pengumuman = PengumumanListItem & {
  konten: string;
  layoutConfig: SiteContentLayoutConfig;
  createdAt: string;
  updatedAt: string;
};
