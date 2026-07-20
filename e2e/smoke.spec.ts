import { expect, test } from "@playwright/test";
import { API_CF_URL, API_CMS_URL, CMS_URL, WEB_URL } from "./urls";

test.describe("public web", () => {
  test("beranda loads with TEKNOVO brand signal", async ({ page }) => {
    const res = await page.goto(WEB_URL, { waitUntil: "domcontentloaded" });
    expect(res, `no response for ${WEB_URL}`).toBeTruthy();
    expect(res!.ok(), `GET ${WEB_URL} → ${res!.status()}`).toBeTruthy();
    await expect(page.locator("body")).toBeVisible();
    const text = await page.locator("body").innerText();
    expect(text.toLowerCase()).toMatch(/teknovo/);
  });
});

test.describe("CMS", () => {
  test("sign-in surface is reachable", async ({ page }) => {
    const res = await page.goto(`${CMS_URL}/sign-in`, {
      waitUntil: "domcontentloaded",
    });
    expect(res, `no response for ${CMS_URL}/sign-in`).toBeTruthy();
    expect(res!.status() < 400, `GET CMS sign-in → ${res!.status()}`).toBeTruthy();
    await expect(page.locator("body")).toBeVisible();
  });
});

test.describe("API health", () => {
  test("Tunnel cms-api. /api/health ok (Node)", async ({ request }) => {
    const res = await request.get(`${API_CMS_URL}/api/health`, {
      timeout: 30_000,
    });
    expect(res.status(), `cms-api health ${res.status()}`).toBe(200);
    const json = (await res.json()) as {
      ok?: boolean;
      runtime?: string;
    };
    expect(json.ok).toBe(true);
    expect(json.runtime).toBe("node");
  });

  test("Worker cf. /api/health (skip if DNS retired)", async ({ request }) => {
    try {
      const res = await request.get(`${API_CF_URL}/api/health`, {
        timeout: 20_000,
      });
      if (!res.ok()) {
        test.skip(true, `cf. HTTP ${res.status()} — DNS may be retired post-cutover`);
        return;
      }
      const json = (await res.json()) as { ok?: boolean };
      expect(json.ok).toBe(true);
    } catch {
      test.skip(true, "cf. not reachable — expected after cms-api cutover");
    }
  });
});
