import { Feed } from "feed";

import {
  getBeritaKegiatanDetailPath,
  getBeritaSiswaDetailPath,
} from "@/lib/seo/berita";
import { BRAND_LOGO_SRC, BRAND_SCHOOL_FULL, BRAND_SHORT } from "@/lib/branding";
import { SEO_HTML_LANG } from "@/lib/seo/school";
import { buildLandingAbsoluteUrl, resolveOgImageUrl } from "@/lib/seo/urls";
import { getPublishedBeritaKegiatanCards } from "@/services/berita-kegiatan-publik";
import { listPublishedArtikelSiswaSitemapEntries } from "@/services/artikel-berita-publik";

export type BeritaRssItem = {
  title: string;
  link: string;
  description: string;
  pubDate: Date;
  guid: string;
  author?: string;
  imageUrl?: string;
  category?: string;
};

async function loadPublishedRssItems(): Promise<BeritaRssItem[]> {
  const items: BeritaRssItem[] = [];
  const [kegiatan, siswaEntries] = await Promise.all([
    getPublishedBeritaKegiatanCards(100),
    listPublishedArtikelSiswaSitemapEntries(),
  ]);

  for (const row of kegiatan) {
    const path = getBeritaKegiatanDetailPath(row.slug);
    items.push({
      title: row.judul,
      link: buildLandingAbsoluteUrl(path),
      description: row.ringkasan,
      pubDate: new Date(row.tanggalIso),
      guid: buildLandingAbsoluteUrl(path),
      author: row.penulisNama,
      imageUrl: resolveOgImageUrl(row.coverSrc),
      category: "Berita kegiatan",
    });
  }

  for (const entry of siswaEntries) {
    const path = getBeritaSiswaDetailPath(entry.slug);
    items.push({
      title: entry.slug,
      link: buildLandingAbsoluteUrl(path),
      description: "Artikel siswa SMK TEKNOVO",
      pubDate: entry.lastModified,
      guid: buildLandingAbsoluteUrl(path),
      category: "Artikel siswa",
    });
  }

  return items.sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());
}

/** Valid RSS 2.0 via `feed` — channel metadata, lastBuildDate, atom:self. */
export async function buildBeritaRssXml(): Promise<string> {
  const channelUrl = buildLandingAbsoluteUrl("/berita/rss.xml");
  const feedUrl = buildLandingAbsoluteUrl("/berita/berita-terbaru");
  const items = await loadPublishedRssItems();
  const lastBuild = items[0]?.pubDate ?? new Date();

  const feed = new Feed({
    title: `Berita ${BRAND_SHORT}`,
    description: `Berita dan artikel resmi ${BRAND_SCHOOL_FULL} — kegiatan sekolah, artikel siswa, PPDB, LMS.`,
    id: feedUrl,
    link: feedUrl,
    language: SEO_HTML_LANG,
    image: buildLandingAbsoluteUrl(BRAND_LOGO_SRC),
    favicon: buildLandingAbsoluteUrl(BRAND_LOGO_SRC),
    copyright: `© ${new Date().getFullYear()} ${BRAND_SCHOOL_FULL}`,
    updated: lastBuild,
    generator: false,
    feedLinks: {
      rss: channelUrl,
    },
    author: {
      name: BRAND_SCHOOL_FULL,
      link: buildLandingAbsoluteUrl("/tentang-smk-teknovo"),
    },
  });

  feed.addCategory("Education");
  feed.addCategory("Vocational School");
  feed.addCategory("Indonesia");

  for (const item of items) {
    const enclosureType = item.imageUrl?.includes(".webp")
      ? "image/webp"
      : item.imageUrl?.includes(".png")
        ? "image/png"
        : "image/jpeg";

    feed.addItem({
      title: item.title,
      id: item.guid,
      link: item.link,
      description: item.description,
      date: item.pubDate,
      guid: item.guid,
      category: item.category ? [{ name: item.category }] : undefined,
      author: item.author ? [{ name: item.author }] : undefined,
      image: item.imageUrl,
      enclosure: item.imageUrl
        ? { url: item.imageUrl, type: enclosureType }
        : undefined,
    });
  }

  return feed.rss2();
}
