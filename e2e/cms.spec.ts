import { expect, test } from "@playwright/test";
import { CMS_URL } from "./helpers";

test.describe("CMS auth surfaces", () => {
  test("sign-in is configured (not placeholder)", async ({ page }) => {
    const res = await page.goto(`${CMS_URL}/sign-in`, {
      waitUntil: "domcontentloaded",
    });
    expect(res?.ok() || (res && res.status() < 400)).toBeTruthy();
    await expect(page.locator("body")).toBeVisible();
    const text = await page.locator("body").innerText();
    expect(text).not.toMatch(/CMS belum dikonfigurasi/i);
    expect(text.toLowerCase()).toMatch(/masuk|sign|email|password|clerk|lanjut/i);
  });

  test("forgot-password page loads", async ({ page }) => {
    const res = await page.goto(`${CMS_URL}/forgot-password`, {
      waitUntil: "domcontentloaded",
    });
    expect(res?.status() ?? 0).toBeLessThan(400);
    await expect(page.locator("body")).toBeVisible();
  });

  test("reset-password page loads", async ({ page }) => {
    const res = await page.goto(`${CMS_URL}/reset-password`, {
      waitUntil: "domcontentloaded",
    });
    expect(res?.status() ?? 0).toBeLessThan(400);
    await expect(page.locator("body")).toBeVisible();
  });

  test("unauthenticated dashboard redirects to sign-in", async ({ page }) => {
    await page.goto(`${CMS_URL}/berita`, { waitUntil: "domcontentloaded" });
    await page.waitForURL(/\/sign-in/, { timeout: 20_000 });
    expect(page.url()).toMatch(/\/sign-in/);
  });

  test("unauthenticated media redirects to sign-in", async ({ page }) => {
    await page.goto(`${CMS_URL}/media`, { waitUntil: "domcontentloaded" });
    await page.waitForURL(/\/sign-in/, { timeout: 20_000 });
    expect(page.url()).toMatch(/\/sign-in/);
  });
});
