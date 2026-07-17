import type { EkskulPublikKategori } from "@/services/kesiswaan-publik";

export type ActivitiesShowcaseItem = {
  id: string;
  title: string;
  description: string;
  href: string;
  coverSrc: string;
  highlight?: boolean;
  kategori?: EkskulPublikKategori;
};
