/**
 * Deploy (or refresh) Postgres stored procedures / functions from
 * `src/stored-procedures/*.sql` via Prisma `$executeRawUnsafe`.
 *
 * Usage (from apps/api, with DATABASE_URL set):
 *   pnpm prisma:procedures
 *
 * Idempotent: SQL uses CREATE OR REPLACE / IF NOT EXISTS.
 * Worker + D1 path does not use these (SQLite has no stored procs).
 */
import "dotenv/config";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { disconnectPrisma, getPrisma } from "../src/lib/prisma/client";
import { splitSqlStatements } from "../src/lib/procedures/split-sql";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SQL_DIR = path.resolve(__dirname, "../src/stored-procedures");

async function main() {
  const entries = (await readdir(SQL_DIR))
    .filter((f) => f.endsWith(".sql"))
    .sort();

  if (entries.length === 0) {
    throw new Error(`No .sql files in ${SQL_DIR}`);
  }

  const prisma = getPrisma();
  console.log(`Deploying ${entries.length} procedure file(s) from ${SQL_DIR}`);

  for (const file of entries) {
    const full = path.join(SQL_DIR, file);
    const raw = await readFile(full, "utf8");
    const statements = splitSqlStatements(raw);
    console.log(`  ${file} (${statements.length} statement(s))`);
    for (const stmt of statements) {
      await prisma.$executeRawUnsafe(stmt);
    }
  }

  const procs = await prisma.$queryRaw<Array<{ name: string }>>`
    SELECT p.proname AS name
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public'
      AND p.proname IN (
        'sp_upsert_site_media',
        'sp_publish_berita',
        'fn_get_analytics_overview',
        'fn_search_berita',
        'sp_archive_outdated'
      )
    ORDER BY p.proname
  `;
  console.log(
    "Registered:",
    procs.map((p) => p.name).join(", ") || "(none)",
  );
  console.log("PROCEDURES OK");
}

main()
  .catch((err) => {
    console.error("PROCEDURES FAIL", err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await disconnectPrisma();
  });
