import { expect, type APIRequestContext, type Page } from "@playwright/test";
import { API_CMS_URL, CMS_URL, WEB_URL } from "./urls";

export async function expectOkPage(page: Page, path: string) {
  const url = path.startsWith("http") ? path : `${WEB_URL}${path}`;
  const res = await page.goto(url, { waitUntil: "domcontentloaded" });
  expect(res, `no response for ${url}`).toBeTruthy();
  expect(res!.ok(), `GET ${url} → ${res!.status()}`).toBeTruthy();
  await expect(page.locator("body")).toBeVisible();
  return res!;
}

export async function getJson(
  request: APIRequestContext,
  path: string,
  init?: { headers?: Record<string, string> },
) {
  const url = path.startsWith("http") ? path : `${API_CMS_URL}${path}`;
  const res = await request.get(url, {
    timeout: 30_000,
    headers: { Accept: "application/json", ...init?.headers },
  });
  const json = (await res.json().catch(() => null)) as Record<
    string,
    unknown
  > | null;
  return { res, json, url };
}

export { API_CMS_URL, CMS_URL, WEB_URL };
