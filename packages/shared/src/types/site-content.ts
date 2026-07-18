/** Shared CMS content types — fasilitas / ekstrakurikuler / prestasi / site media. */

export type SiteContentStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

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
  publishedAt: string | null;
};

export type Fasilitas = FasilitasListItem & {
  highlights: string[];
  paragraphs: string[];
  extras: FasilitasExtras;
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
  publishedAt: string | null;
};

export type Ekstrakurikuler = EkstrakurikulerListItem & {
  fullDescription: string;
  relatedAchievements: string[];
  jadwalRingkas: string | null;
  lokasiLatihan: string | null;
  pembinaNama: string | null;
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
  publishedAt: string | null;
};

export type Prestasi = PrestasiListItem & {
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
