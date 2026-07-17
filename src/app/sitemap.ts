import type { MetadataRoute } from "next";

import {
  buildLandingAbsoluteUrl,
  getBeritaKegiatanDetailPath,
  getBeritaSiswaDetailPath,
} from "@/lib/berita-seo";
import { FASILITAS_SLUGS, getFasilitasDetailPath } from "@/lib/fasilitas-landing-content";
import { LOCAL_SEO_SITEMAP_ENTRIES } from "@/lib/local-seo-keywords";
import { buildPpdbAbsoluteUrl, PPDB_SITEMAP_ENTRIES } from "@/lib/ppdb-seo";
import { listPublishedArtikelSiswaSitemapEntries } from "@/services/artikel-berita-publik";
import { listBeritaKegiatanSitemapEntries } from "@/services/berita-kegiatan-publik";

const BERITA_HUB_PATHS = ["/berita/berita-terbaru", "/berita/kegiatan-sekolah"] as const;

const LANDING_STATIC_PATHS = [
  "",
  "/kontak",
  "/akademik",
  "/akademik/jurusan",
  "/akademik/kurikulum",
  "/akademik/pengajar",
  "/akademik/program-digital",
  "/fasilitas",
  "/kesiswaan",
  "/kesiswaan/ekstrakurikuler",
  "/kesiswaan/prestasi",
  "/profil/sejarah",
  "/profil/sambutan",
  "/profil/visi-misi",
  "/profil/program-sekolah",
  "/profil/smk-terbaik-pamanukan",
  "/profil/smk-vokasi-pamanukan-subang",
  "/smk-pamanukan",
  "/smk-terbaik-subang",
  "/ppdb-smk-pamanukan",
  "/lms-smk-subang",
  "/lms-smk-jawa-barat",
  "/tentang-smk-teknovo",
  ...BERITA_HUB_PATHS,
  ...FASILITAS_SLUGS.map((slug) => getFasilitasDetailPath(slug)),
] as const;

const LMS_HIGH_PRIORITY_PATHS = new Set([
  "/fasilitas/lms-sekolah",
  "/akademik/program-digital",
  "/akademik/kurikulum",
  "/lms-smk-subang",
  "/lms-smk-jawa-barat",
]);

const TENTANG_HIGH_PRIORITY_PATHS = new Set(["/tentang-smk-teknovo"]);

const LOCAL_SEO_HIGH_PRIORITY_PATHS = new Set(
  LOCAL_SEO_SITEMAP_ENTRIES.filter((e) => e.priority >= 0.95).map((e) => e.path),
);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let artikelSiswa: Awaited<ReturnType<typeof listPublishedArtikelSiswaSitemapEntries>> = [];
  let beritaKegiatan: Awaited<ReturnType<typeof listBeritaKegiatanSitemapEntries>> = [];

  try {
    [artikelSiswa, beritaKegiatan] = await Promise.all([
      listPublishedArtikelSiswaSitemapEntries(),
      listBeritaKegiatanSitemapEntries(),
    ]);
  } catch {
    /* Build/CI tanpa DATABASE_URL — tetap emit rute statis. */
  }

  const staticEntries: MetadataRoute.Sitemap = LANDING_STATIC_PATHS.map((path) => ({
    url: buildLandingAbsoluteUrl(path),
    lastModified: new Date(),
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === ""
      ? 1
      : TENTANG_HIGH_PRIORITY_PATHS.has(path)
        ? 0.98
        : LOCAL_SEO_HIGH_PRIORITY_PATHS.has(path)
          ? 0.95
          : path === "/fasilitas/lms-sekolah"
          ? 0.92
          : LMS_HIGH_PRIORITY_PATHS.has(path)
            ? 0.88
            : path.startsWith("/berita")
              ? 0.85
              : path.startsWith("/fasilitas/")
                ? 0.8
                : 0.7,
  }));

  const siswaEntries: MetadataRoute.Sitemap = artikelSiswa.map((entry) => ({
    url: buildLandingAbsoluteUrl(getBeritaSiswaDetailPath(entry.slug)),
    lastModified: entry.lastModified,
    changeFrequency: "weekly",
    priority: 0.75,
  }));

  const kegiatanEntries: MetadataRoute.Sitemap = beritaKegiatan.map((entry) => ({
    url: buildLandingAbsoluteUrl(getBeritaKegiatanDetailPath(entry.slug)),
    lastModified: entry.lastModified,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const ppdbEntries: MetadataRoute.Sitemap = PPDB_SITEMAP_ENTRIES.map((entry) => ({
    url: buildPpdbAbsoluteUrl(entry.path),
    lastModified: new Date(),
    changeFrequency: entry.changeFrequency,
    priority: entry.priority,
  }));

  const discoveryEntries: MetadataRoute.Sitemap = [
    {
      url: buildLandingAbsoluteUrl("/berita/rss.xml"),
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.6,
    },
  ];

  return [...staticEntries, ...ppdbEntries, ...discoveryEntries, ...siswaEntries, ...kegiatanEntries];
}
