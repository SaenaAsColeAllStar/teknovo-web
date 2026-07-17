import { FASILITAS_SLUGS, getFasilitasDetailPath } from "@/lib/fasilitas-landing-content";
import {
  buildLandingAbsoluteUrl,
  getBeritaKegiatanDetailPath,
  getBeritaSiswaDetailPath,
  LOCAL_SEO_SITEMAP_ENTRIES,
  PPDB_SITEMAP_ENTRIES,
} from "@/lib/seo";
import { getPublicAppBaseUrl } from "@/lib/public-app-url";
import { listPublishedArtikelSiswaSitemapEntries } from "@/services/artikel-berita-publik";
import { listBeritaKegiatanSitemapEntries } from "@/services/berita-kegiatan-publik";

const INDEXNOW_API = "https://api.indexnow.org/indexnow";
const MAX_URLS_PER_REQUEST = 10_000;

/** Kunci IndexNow 32 hex — set di .env sebagai INDEXNOW_KEY. */
export function getIndexNowKey(): string | null {
  const key = process.env.INDEXNOW_KEY?.trim();
  if (!key || !/^[a-f0-9]{32}$/i.test(key)) {
    return null;
  }
  return key.toLowerCase();
}

/** Lokasi berkas verifikasi kunci — https://host/{key}.txt */
export function getIndexNowKeyLocation(): string | null {
  const key = getIndexNowKey();
  if (!key) {
    return null;
  }
  return buildLandingAbsoluteUrl(`/${key}.txt`);
}

function getIndexNowHost(): string {
  const base = getPublicAppBaseUrl();
  try {
    return new URL(base).host;
  } catch {
    return "smkteknovo.sch.id";
  }
}

export type IndexNowPingResult = {
  ok: boolean;
  status: number;
  urlCount: number;
  message: string;
};

/**
 * Ping IndexNow API (Bing, Yandex, dll. — protokol gratis).
 * Setelah deploy, daftarkan situs juga di Bing Webmaster Tools → URL Submission / IndexNow.
 */
export async function pingIndexNowUrls(urls: readonly string[]): Promise<IndexNowPingResult> {
  const key = getIndexNowKey();
  const keyLocation = getIndexNowKeyLocation();
  if (!key || !keyLocation) {
    return {
      ok: false,
      status: 0,
      urlCount: urls.length,
      message: "INDEXNOW_KEY tidak diset atau bukan 32 karakter hex.",
    };
  }

  const unique = [...new Set(urls.map((u) => u.trim()).filter(Boolean))];
  if (unique.length === 0) {
    return { ok: true, status: 200, urlCount: 0, message: "Tidak ada URL untuk dikirim." };
  }

  const batch = unique.slice(0, MAX_URLS_PER_REQUEST);
  const res = await fetch(INDEXNOW_API, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host: getIndexNowHost(),
      key,
      keyLocation,
      urlList: batch,
    }),
  });

  const ok = res.ok || res.status === 202;
  return {
    ok,
    status: res.status,
    urlCount: batch.length,
    message: ok
      ? `IndexNow menerima ${batch.length} URL (HTTP ${res.status}).`
      : `IndexNow gagal HTTP ${res.status}.`,
  };
}

/** Ping satu URL setelah berita diterbitkan — fire-and-forget aman. */
export function pingIndexNowOnPublish(absoluteUrl: string): void {
  void pingIndexNowUrls([absoluteUrl]).catch((err: unknown) => {
    if (process.env.NODE_ENV === "development") {
      console.warn("[indexnow] ping gagal:", err);
    }
  });
}

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
  "/berita/berita-terbaru",
  "/berita/kegiatan-sekolah",
  "/berita/rss.xml",
  "/llms.txt",
  "/llms-full.txt",
  ...FASILITAS_SLUGS.map((slug) => getFasilitasDetailPath(slug)),
] as const;

/** Kumpulkan URL publik untuk skrip seo:ping-indexnow. */
export async function collectPublicSeoUrls(): Promise<string[]> {
  const urls = new Set<string>();

  for (const path of LANDING_STATIC_PATHS) {
    urls.add(buildLandingAbsoluteUrl(path));
  }
  for (const entry of LOCAL_SEO_SITEMAP_ENTRIES) {
    urls.add(buildLandingAbsoluteUrl(entry.path));
  }
  for (const entry of PPDB_SITEMAP_ENTRIES) {
    urls.add(buildLandingAbsoluteUrl(entry.path));
  }

  urls.add(buildLandingAbsoluteUrl("/ppdb/sitemap.xml"));

  try {
    const [siswa, kegiatan] = await Promise.all([
      listPublishedArtikelSiswaSitemapEntries(),
      listBeritaKegiatanSitemapEntries(),
    ]);
    for (const entry of siswa) {
      urls.add(buildLandingAbsoluteUrl(getBeritaSiswaDetailPath(entry.slug)));
    }
    for (const entry of kegiatan) {
      urls.add(buildLandingAbsoluteUrl(getBeritaKegiatanDetailPath(entry.slug)));
    }
  } catch {
    /* CI tanpa DB — tetap kirim rute statis. */
  }

  return [...urls];
}
