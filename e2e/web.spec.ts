import { expect, test } from "@playwright/test";
import { expectOkPage, WEB_URL } from "./helpers";

const PUBLIC_PATHS = [
  "/",
  "/berita",
  "/berita/berita-terbaru",
  "/berita/kegiatan-sekolah",
  "/fasilitas",
  "/kesiswaan/ekstrakurikuler",
  "/kesiswaan/prestasi",
  "/akademik",
  "/akademik/jurusan",
  "/kontak",
  "/profil/visi-misi",
  "/profil/sejarah",
  "/profil/sambutan",
  "/profil/program-sekolah",
  "/tentang-smk-teknovo",
] as const;

test.describe("public web pages", () => {
  for (const path of PUBLIC_PATHS) {
    test(`loads ${path}`, async ({ page }) => {
      await expectOkPage(page, path);
      const text = (await page.locator("body").innerText()).toLowerCase();
      expect(text).toMatch(/teknovo/);
    });
  }

  test("RSS feed is valid XML with channel", async ({ request }) => {
    const res = await request.get(`${WEB_URL}/rss.xml`, { timeout: 30_000 });
    expect(res.status()).toBe(200);
    const body = await res.text();
    expect(body).toContain("<rss");
    expect(body).toContain("<channel>");
    expect(body.toLowerCase()).toContain("teknovo");
  });

  test("berita detail from RSS (if any) loads", async ({ page, request }) => {
    const res = await request.get(`${WEB_URL}/rss.xml`, { timeout: 30_000 });
    expect(res.ok()).toBeTruthy();
    const xml = await res.text();
    const match = xml.match(/<link>(https:\/\/[^<]+\/berita\/kegiatan\/[^<]+)<\/link>/);
    test.skip(!match, "no berita items in RSS yet");
    const detailUrl = match![1];
    await expectOkPage(page, detailUrl);
    await expect(page.locator("body")).toContainText(/teknovo|test|berita/i);
  });

  test("404 page for unknown path", async ({ page }) => {
    const res = await page.goto(`${WEB_URL}/path-yang-tidak-ada-e2e`, {
      waitUntil: "domcontentloaded",
    });
    expect(res, "expected a response").toBeTruthy();
    expect(res!.status()).toBe(404);
  });
});
