import { BRAND_MAP_COORDS, BRAND_MAPS_URL } from "@/lib/branding";

/** Kemendikdasmen NPSN verification URL. */
export const SCHOOL_NPSN_PROOF_URL =
  "https://referensi.data.kemendikdasmen.go.id/pendidikan/npsn/70036813" as const;

/** Fakta lokasi & identitas sekolah — sumber tunggal untuk SEO / JSON-LD / llms.txt. */
export const LOCAL_SEO_SCHOOL = {
  npsn: "70036813",
  accreditation: "A",
  streetAddress: "Jl. Rancasari RT 05 RW 03",
  subLocality: "Rancasari",
  locality: "Pamanukan",
  administrativeArea: "Kabupaten Subang",
  region: "Jawa Barat",
  country: "ID",
  geo: BRAND_MAP_COORDS,
  areaServed: [
    "Pamanukan",
    "Kabupaten Subang",
    "Jawa Barat",
    "Jakarta",
    "Bekasi",
    "Karawang",
    "Jabodetabek",
  ] as const,
  postalCode: "41254",
  fullLocationLabel: "Rancasari, Pamanukan, Kabupaten Subang, Jawa Barat",
  mapsUrl: BRAND_MAPS_URL,
  npsnProofUrl: SCHOOL_NPSN_PROOF_URL,
} as const;

/** Legacy PPDB aliases — same school facts. */
export const PPDB_SCHOOL_NPSN = LOCAL_SEO_SCHOOL.npsn;
export const PPDB_SCHOOL_ACCREDITATION = LOCAL_SEO_SCHOOL.accreditation;
export const PPDB_SCHOOL_LOCATION = LOCAL_SEO_SCHOOL.fullLocationLabel;
export const PPDB_SCHOOL_LOCALITY = LOCAL_SEO_SCHOOL.subLocality;
export const PPDB_SCHOOL_REGION = LOCAL_SEO_SCHOOL.region;

/** Primary content language (BCP 47). */
export const SEO_PRIMARY_LOCALE = "id_ID" as const;
export const SEO_PRIMARY_LANGUAGE = "id-ID" as const;
export const SEO_HTML_LANG = "id" as const;
