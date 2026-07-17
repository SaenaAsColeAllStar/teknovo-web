export type ActivitiesShowcaseIconKey =
  | "osis"
  | "pramuka"
  | "paskibra"
  | "futsal"
  | "pencaksilat"
  | "blogger"
  | "coding"
  | "robotik"
  | "literasi";

export type ActivitiesShowcaseItem = {
  id: string;
  title: string;
  description: string;
  href: string;
  iconKey: ActivitiesShowcaseIconKey;
};
