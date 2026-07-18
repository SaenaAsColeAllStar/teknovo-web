import { getCloudflareContext } from "@opennextjs/cloudflare";

/** D1 bound as `DB` in wrangler.toml (`teknovo-article`). */
export async function getDb(): Promise<D1Database> {
  const { env } = await getCloudflareContext({ async: true });
  const db = env.DB;
  if (!db) {
    throw new Error(
      "DB (D1) binding tidak tersedia. Pastikan [[d1_databases]] di wrangler.toml dan jalankan via OpenNext preview/deploy (bukan plain next dev tanpa Workers).",
    );
  }
  return db;
}

export function d1UnavailableMessage(err: unknown): string {
  const message = err instanceof Error ? err.message : String(err);
  if (
    message.includes("DB") ||
    message.includes("getCloudflareContext") ||
    message.includes("D1")
  ) {
    return "D1 belum tersedia di runtime ini. Gunakan `pnpm preview` / deploy Workers, lalu `pnpm d1:migrate:remote`.";
  }
  return message || "Gagal mengakses database.";
}

export function newId(): string {
  return crypto.randomUUID();
}

export function nowIso(): string {
  return new Date().toISOString();
}
