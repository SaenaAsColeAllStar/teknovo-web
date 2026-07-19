/**
 * Trigger Astro site rebuild via GitHub repository_dispatch.
 * Falls back to no-op (logs) when token/repo unset — local/dev safe.
 * Retries transient GitHub failures (2–3 attempts) before giving up.
 */

import { log } from "./logger";

const MAX_ATTEMPTS = 3;
const RETRY_DELAY_MS = [400, 1200] as const;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function triggerWebRebuild(
  env: Env,
  reason: string,
): Promise<{ ok: boolean; detail: string }> {
  const token = env.GITHUB_REBUILD_TOKEN;
  const repo = env.GITHUB_REPO || "SaenaAsColeAllStar/teknovo-web";
  if (!token) {
    const isProd = (env.ENVIRONMENT ?? "production") === "production";
    // Local/dev: silent skip is fine. Production without a token means
    // published CMS content will never reach the static Astro site.
    if (isProd) {
      log.error("rebuild_web_skipped", {
        reason,
        detail: "no_token",
        hint: "wrangler secret put GITHUB_REBUILD_TOKEN",
      });
      return { ok: false, detail: "skipped_no_token" };
    }
    log.info("rebuild_web_skipped", { reason, detail: "no_token" });
    return { ok: true, detail: "skipped_no_token" };
  }

  let lastDetail = "unknown";
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const res = await fetch(`https://api.github.com/repos/${repo}/dispatches`, {
        method: "POST",
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${token}`,
          "X-GitHub-Api-Version": "2022-11-28",
          "User-Agent": "teknovo-cms-api",
        },
        body: JSON.stringify({
          event_type: "rebuild-web",
          client_payload: { reason, at: new Date().toISOString() },
        }),
      });

      if (res.ok || res.status === 204) {
        if (attempt > 1) {
          log.info("rebuild_web_dispatched_after_retry", { reason, attempt });
        }
        return { ok: true, detail: "dispatched" };
      }

      lastDetail = (await res.text()) || String(res.status);
      const retryable = res.status === 429 || res.status >= 500;
      log.warn("rebuild_web_attempt_failed", {
        reason,
        attempt,
        status: res.status,
        retryable,
      });
      if (!retryable || attempt === MAX_ATTEMPTS) break;
      await sleep(RETRY_DELAY_MS[attempt - 1] ?? 1200);
    } catch (err) {
      lastDetail = err instanceof Error ? err.message : String(err);
      log.warn("rebuild_web_attempt_error", { reason, attempt, detail: lastDetail });
      if (attempt === MAX_ATTEMPTS) break;
      await sleep(RETRY_DELAY_MS[attempt - 1] ?? 1200);
    }
  }

  log.error("rebuild_web_failed", { reason, detail: lastDetail });
  return { ok: false, detail: lastDetail };
}

export function shouldRebuildForBeritaStatus(status: string): boolean {
  return status === "PUBLISHED" || status === "ARCHIVED";
}

export function shouldRebuildForArtikelStatus(status: string): boolean {
  return status === "PUBLISHED" || status === "ARCHIVED";
}

export function shouldRebuildForSiteContentStatus(status: string): boolean {
  return status === "PUBLISHED" || status === "ARCHIVED";
}
