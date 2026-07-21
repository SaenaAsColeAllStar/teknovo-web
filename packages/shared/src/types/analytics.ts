export type CmsAnalyticsMonthBucket = {
  bulan: string;
  jumlah: number;
};

export type CmsAnalyticsActivityItem = {
  type: string;
  label: string;
  time: string;
};

export type CmsAnalyticsOverview = {
  beritaTotal: number;
  beritaPublished: number;
  beritaDraft: number;
  beritaArchived: number;
  artikelTotal: number;
  artikelReview: number;
  artikelPublished: number;
  kategoriTotal: number;
  /** Site-content rows in PENDING_REVIEW (all managed entities). */
  siteContentPending: number;
  /** Pengumuman total (0 when entity unavailable). */
  pengumumanTotal: number;
  beritaPerBulan: CmsAnalyticsMonthBucket[];
  recentActivity: CmsAnalyticsActivityItem[];
  /** Where numbers came from. */
  source: "api" | "aggregate" | "unavailable";
};
