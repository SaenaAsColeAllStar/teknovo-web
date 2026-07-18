/**
 * Trigger Astro site rebuild via GitHub repository_dispatch.
 * Falls back to no-op (logs) when token/repo unset — local/dev safe.
 */
export async function triggerWebRebuild(
  env: Env,
  reason: string,
): Promise<{ ok: boolean; detail: string }> {
  const token = env.GITHUB_REBUILD_TOKEN;
  const repo = env.GITHUB_REPO || "SaenaAsColeAllStar/teknovo-web";
  if (!token) {
    console.log(`[rebuild-web] skipped (no GITHUB_REBUILD_TOKEN): ${reason}`);
    return { ok: true, detail: "skipped_no_token" };
  }

  const res = await fetch(`https://api.github.com/repos/${repo}/dispatches`, {
    method: "POST",
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "teknovo-api",
    },
    body: JSON.stringify({
      event_type: "rebuild-web",
      client_payload: { reason, at: new Date().toISOString() },
    }),
  });

  if (!res.ok && res.status !== 204) {
    const text = await res.text();
    console.error(`[rebuild-web] failed ${res.status}: ${text}`);
    return { ok: false, detail: text || String(res.status) };
  }

  return { ok: true, detail: "dispatched" };
}

export function shouldRebuildForBeritaStatus(status: string): boolean {
  return status === "PUBLISHED" || status === "ARCHIVED";
}

export function shouldRebuildForArtikelStatus(status: string): boolean {
  return status === "PUBLISHED" || status === "ARCHIVED";
}
