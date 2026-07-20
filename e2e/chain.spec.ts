import { expect, test } from "@playwright/test";
import { API_CMS_URL, WEB_URL } from "./helpers";

/**
 * Cross-surface: public web SSR/build data comes from cms-api;
 * RSS item links must resolve on the web.
 */
test.describe("web ↔ API chain", () => {
  test("web RSS items exist on API by slug", async ({ request }) => {
    const rss = await request.get(`${WEB_URL}/rss.xml`);
    expect(rss.ok()).toBeTruthy();
    const xml = await rss.text();
    const slugs = [...xml.matchAll(/\/berita\/kegiatan\/([^<]+)</g)].map(
      (m) => m[1]!,
    );
    test.skip(slugs.length === 0, "RSS empty");

    for (const slug of slugs.slice(0, 3)) {
      const res = await request.get(`${API_CMS_URL}/api/v1/berita/${slug}`, {
        headers: { Accept: "application/json" },
      });
      expect(res.status(), `API slug ${slug}`).toBe(200);
      const json = (await res.json()) as { ok?: boolean; data?: { slug?: string } };
      expect(json.ok).toBe(true);
      expect(json.data?.slug).toBe(slug);
    }
  });
});
