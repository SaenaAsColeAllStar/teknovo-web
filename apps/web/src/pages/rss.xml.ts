import type { APIRoute } from "astro";
import type { BeritaListItem } from "@teknovo/shared";

/** Host origin only — this file appends `/api/v1/...`. Strip trailing `/api` if set. */
const API_URL = (
  import.meta.env.PUBLIC_API_URL || "https://cms-api.smkteknovo.sch.id"
)
  .replace(/\/$/, "")
  .replace(/\/api$/, "");

export const GET: APIRoute = async () => {
  let items: BeritaListItem[] = [];
  try {
    const res = await fetch(
      `${API_URL}/api/v1/berita?status=PUBLISHED&limit=50`,
    );
    if (res.ok) {
      const json = (await res.json()) as {
        ok: boolean;
        data: BeritaListItem[];
      };
      if (json.ok) items = json.data;
    }
  } catch {
    /* empty feed */
  }

  const site = "https://smkteknovo.sch.id";
  const rssItems = items
    .map(
      (item) => `
    <item>
      <title><![CDATA[${item.judul}]]></title>
      <link>${site}/berita/kegiatan/${item.slug}</link>
      <guid>${site}/berita/kegiatan/${item.slug}</guid>
      ${
        item.publishedAt
          ? `<pubDate>${new Date(item.publishedAt).toUTCString()}</pubDate>`
          : ""
      }
      <description><![CDATA[${item.ringkasan || ""}]]></description>
    </item>`,
    )
    .join("\n");

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>SMK TEKNOVO — Berita</title>
    <link>${site}</link>
    <description>Berita sekolah SMK TEKNOVO</description>
    ${rssItems}
  </channel>
</rss>`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
};
