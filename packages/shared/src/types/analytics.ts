export type CmsAnalyticsOverview = {
  beritaTotal: number;
  beritaPublished: number;
  beritaDraft: number;
  beritaArchived: number;
  artikelTotal: number;
  artikelReview: number;
  artikelPublished: number;
  kategoriTotal: number;
  /** Where numbers came from. */
  source: "api" | "aggregate" | "unavailable";
};
