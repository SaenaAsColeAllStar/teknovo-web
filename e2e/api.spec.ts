import { expect, test } from "@playwright/test";
import { API_CMS_URL, getJson } from "./helpers";
import { API_CF_URL } from "./urls";

test.describe("API health & platform", () => {
  test("cms-api health ok (Node runtime)", async ({ request }) => {
    const { res, json } = await getJson(request, "/api/health");
    expect(res.status()).toBe(200);
    expect(json?.ok).toBe(true);
    expect(json?.runtime).toBe("node");
    const checks = json?.checks as Record<string, string> | undefined;
    expect(checks?.prisma).toBe("ok");
    expect(checks?.minio).toBe("ok");
  });

  test("platform status reachable", async ({ request }) => {
    const { res, json } = await getJson(request, "/api/platform/status");
    expect(res.status()).toBe(200);
    expect(json?.ok).toBe(true);
  });

  test("Worker cf. optional post-cutover", async ({ request }) => {
    try {
      const res = await request.get(`${API_CF_URL}/api/health`, {
        timeout: 15_000,
      });
      if (!res.ok()) {
        test.skip(true, `cf. HTTP ${res.status()}`);
        return;
      }
      const json = (await res.json()) as { ok?: boolean };
      expect(json.ok).toBe(true);
    } catch {
      test.skip(true, "cf. DNS retired after cms-api cutover");
    }
  });
});

test.describe("API public reads", () => {
  test("kategori list", async ({ request }) => {
    const { res, json } = await getJson(request, "/api/v1/kategori");
    expect(res.status()).toBe(200);
    expect(json?.ok).toBe(true);
    expect(Array.isArray(json?.data)).toBe(true);
  });

  test("berita published list + slug detail", async ({ request }) => {
    const list = await getJson(
      request,
      "/api/v1/berita?status=PUBLISHED&limit=5",
    );
    expect(list.res.status()).toBe(200);
    expect(list.json?.ok).toBe(true);
    const items = list.json?.data as { slug: string; judul: string }[] | undefined;
    expect(Array.isArray(items)).toBe(true);

    if (!items?.length) {
      test.info().annotations.push({
        type: "note",
        description: "no published berita — slug detail skipped",
      });
      return;
    }

    const slug = items[0]!.slug;
    const detail = await getJson(request, `/api/v1/berita/${slug}`);
    expect(
      detail.res.status(),
      `GET /api/v1/berita/${slug} → ${detail.res.status()} ${JSON.stringify(detail.json)}`,
    ).toBe(200);
    expect(detail.json?.ok).toBe(true);
    const data = detail.json?.data as { slug?: string; konten?: string };
    expect(data?.slug).toBe(slug);
    expect(typeof data?.konten).toBe("string");
  });

  test("fasilitas / ekskul / prestasi published lists", async ({ request }) => {
    for (const path of [
      "/api/v1/fasilitas?status=PUBLISHED&limit=5",
      "/api/v1/ekstrakurikuler?status=PUBLISHED&limit=5",
      "/api/v1/prestasi?status=PUBLISHED&limit=5",
      "/api/v1/artikel-siswa?status=PUBLISHED&limit=5",
    ] as const) {
      const { res, json } = await getJson(request, path);
      expect(res.status(), path).toBe(200);
      expect(json?.ok, path).toBe(true);
      expect(Array.isArray(json?.data), path).toBe(true);
    }
  });

  test("fasilitas slug detail when published exists", async ({ request }) => {
    const list = await getJson(
      request,
      "/api/v1/fasilitas?status=PUBLISHED&limit=1",
    );
    const items = list.json?.data as { slug: string }[] | undefined;
    test.skip(!items?.length, "no published fasilitas");
    const slug = items![0]!.slug;
    const detail = await getJson(request, `/api/v1/fasilitas/${slug}`);
    expect(detail.res.status()).toBe(200);
    expect(detail.json?.ok).toBe(true);
  });

  test("site-media + pengaturan public", async ({ request }) => {
    for (const path of ["/api/v1/site-media", "/api/v1/pengaturan"] as const) {
      const { res, json } = await getJson(request, path);
      expect(res.status(), path).toBe(200);
      expect(json?.ok, path).toBe(true);
    }
  });
});

test.describe("API auth gates", () => {
  test("writes without bearer are rejected", async ({ request }) => {
    const posts = [
      "/api/v1/kategori",
      "/api/v1/berita",
      "/api/v1/fasilitas",
    ] as const;
    for (const path of posts) {
      const res = await request.post(`${API_CMS_URL}${path}`, {
        data: { nama: "e2e", slug: `e2e-${Date.now()}` },
        headers: { "Content-Type": "application/json" },
      });
      expect([401, 403], path).toContain(res.status());
    }
  });

  test("CMS media list requires auth", async ({ request }) => {
    const res = await request.get(`${API_CMS_URL}/api/cms/media`);
    expect([401, 403]).toContain(res.status());
  });

  test("draft berita list requires auth", async ({ request }) => {
    const { res } = await getJson(request, "/api/v1/berita?status=DRAFT&limit=1");
    expect([401, 403]).toContain(res.status());
  });

  test("CORS allows CMS origin on public GET", async ({ request }) => {
    const res = await request.get(`${API_CMS_URL}/api/v1/kategori`, {
      headers: { Origin: "https://cms.smkteknovo.sch.id" },
    });
    expect(res.status()).toBe(200);
    expect(res.headers()["access-control-allow-origin"]).toBe(
      "https://cms.smkteknovo.sch.id",
    );
  });

  test("CORS allows Web origin on public GET", async ({ request }) => {
    const res = await request.get(
      `${API_CMS_URL}/api/v1/berita?status=PUBLISHED&limit=1`,
      { headers: { Origin: "https://smkteknovo.sch.id" } },
    );
    expect(res.status()).toBe(200);
    expect(res.headers()["access-control-allow-origin"]).toBe(
      "https://smkteknovo.sch.id",
    );
  });
});
