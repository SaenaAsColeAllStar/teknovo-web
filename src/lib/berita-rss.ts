import {
  buildLandingAbsoluteUrl,
  getBeritaKegiatanDetailPath,
  getBeritaSiswaDetailPath,
  resolveBeritaOgImageUrl,
} from "@/lib/berita-seo";
import { BRAND_SCHOOL_FULL, BRAND_SHORT } from "@/lib/branding";
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

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function formatRfc822(date: Date): string {
  return date.toUTCString();
}

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
      imageUrl: resolveBeritaOgImageUrl(row.coverSrc),
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

export async function buildBeritaRssXml(): Promise<string> {
  const channelUrl = buildLandingAbsoluteUrl("/berita/rss.xml");
  const feedUrl = buildLandingAbsoluteUrl("/berita/berita-terbaru");
  const items = await loadPublishedRssItems();
  const lastBuild = items[0]?.pubDate ?? new Date();

  const itemXml = items
    .map((item) => {
      const enclosure = item.imageUrl
        ? `\n      <enclosure url="${escapeXml(item.imageUrl)}" type="image/jpeg" />`
        : "";
      const category = item.category
        ? `\n      <category>${escapeXml(item.category)}</category>`
        : "";
      const author = item.author
        ? `\n      <author>${escapeXml(item.author)}</author>`
        : "";

      return `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${escapeXml(item.link)}</link>
      <description>${escapeXml(item.description)}</description>
      <pubDate>${formatRfc822(item.pubDate)}</pubDate>
      <guid isPermaLink="true">${escapeXml(item.guid)}</guid>${author}${category}${enclosure}
    </item>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Berita ${BRAND_SHORT}</title>
    <link>${escapeXml(feedUrl)}</link>
    <description>Berita dan artikel resmi ${BRAND_SCHOOL_FULL} — kegiatan sekolah, artikel siswa, PPDB, LMS.</description>
    <language>id</language>
    <lastBuildDate>${formatRfc822(lastBuild)}</lastBuildDate>
    <atom:link href="${escapeXml(channelUrl)}" rel="self" type="application/rss+xml" />
${itemXml}
  </channel>
</rss>
`;
}
