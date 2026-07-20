/**
 * Migrate tenant content from Cloudflare D1 → PostgreSQL (Prisma).
 *
 * Default is dry-run (no writes). Live upsert requires `--execute`.
 *
 * Usage (from apps/api, with DATABASE_URL + MinIO env):
 *   pnpm migrate:d1-to-pg:dry              # dry-run (remote D1)
 *   pnpm migrate:d1-to-pg:dry -- --local   # dry-run against local wrangler D1
 *   pnpm migrate:d1-to-pg -- --remote      # live upsert (explicit --execute via package script)
 *   pnpm exec tsx scripts/migrate-d1-to-pg.ts --execute --remote
 *
 * Sources:
 *   --remote | --local     wrangler d1 execute --json
 *   --from-json <path>     previously dumped export
 *   --dump-json <path>     write export (works with dry-run)
 *
 * Env:
 *   DATABASE_URL           Postgres (required for --execute / validation against PG)
 *   MINIO_PUBLIC_URL       target public base for URL rewrite
 *   R2_PUBLIC_URL          source public base (default https://r2.ctos.web.id)
 *   D1_DATABASE_NAME       wrangler DB name (default teknovo-article)
 *
 * Rollback: keep Worker + D1 + R2 as source of truth until Fase 8 DNS cutover.
 * Re-run dry-run anytime; live upserts are idempotent by id / media_key / slug.
 */
import "dotenv/config";
import { execFile } from "node:child_process";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import {
  ArtikelStatus,
  BeritaStatus,
  EkskulKategori,
  Prisma,
  SiteContentStatus,
  type PrismaClient,
} from "@prisma/client";
import { disconnectPrisma, getPrisma } from "../src/lib/prisma/client";
import { loadMinioConfig } from "../src/lib/minio/client";
import { parseDateOnly } from "../src/lib/prisma/map-helpers";

const execFileAsync = promisify(execFile);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const TABLES = [
  "kategori",
  "berita",
  "artikel_siswa",
  "fasilitas",
  "ekstrakurikuler",
  "prestasi",
  "site_media",
  "pengaturan",
] as const;

type TableName = (typeof TABLES)[number];

type D1Export = Record<TableName, Record<string, unknown>[]>;

type CliOptions = {
  execute: boolean;
  remote: boolean;
  local: boolean;
  fromJson: string | null;
  dumpJson: string | null;
  checkUrls: boolean;
  r2Base: string;
  minioBase: string;
  databaseName: string;
  sampleSlugs: number;
};

type MigrateStats = {
  table: TableName;
  source: number;
  upserted: number;
  urlsRewritten: number;
};

type OrphanReport = {
  table: string;
  id: string;
  slug?: string;
  kategoriId: string;
};

function parseArgs(argv: string[]): CliOptions {
  // pnpm may forward a literal `--` separator into argv
  argv = argv.filter((a) => a !== "--");
  const has = (flag: string) => argv.includes(flag);
  const get = (flag: string): string | null => {
    const i = argv.indexOf(flag);
    if (i === -1) return null;
    return argv[i + 1] ?? null;
  };

  const execute = has("--execute") || process.env.MIGRATE_EXECUTE === "1";
  const remote = has("--remote");
  const local = has("--local");
  const fromJson = get("--from-json");

  if (remote && local) {
    throw new Error("Use only one of --remote or --local");
  }
  if (!fromJson && !remote && !local) {
    // Default source: remote production D1 (Fase 7).
  }

  const minioFromEnv = loadMinioConfig().publicUrl;
  const r2FromEnv = (
    process.env.R2_PUBLIC_URL || "https://r2.ctos.web.id"
  ).replace(/\/$/, "");

  return {
    execute,
    remote: fromJson ? false : remote || (!local && !fromJson),
    local: Boolean(fromJson) ? false : local,
    fromJson,
    dumpJson: get("--dump-json"),
    checkUrls: has("--check-urls"),
    r2Base: (get("--r2-base") || r2FromEnv).replace(/\/$/, ""),
    minioBase: (get("--minio-base") || minioFromEnv).replace(/\/$/, ""),
    databaseName: get("--database") || process.env.D1_DATABASE_NAME || "teknovo-article",
    sampleSlugs: Number(get("--sample-slugs") || "5") || 5,
  };
}

function printHelp(): void {
  console.log(`migrate-d1-to-pg — D1 → Postgres (Prisma)

Flags:
  --dry-run          Default. Export + transform + validate plan; no PG writes
  --execute          Live idempotent upserts into Postgres
  --remote           Read D1 via wrangler --remote (default if no --local/--from-json)
  --local            Read D1 via wrangler --local
  --from-json PATH   Read dump produced by --dump-json
  --dump-json PATH   Write raw D1 export JSON
  --check-urls       HEAD-request rewritten absolute URLs (optional)
  --r2-base URL      Source CDN base (default R2_PUBLIC_URL / https://r2.ctos.web.id)
  --minio-base URL   Target public base (default MINIO_PUBLIC_URL)
  --database NAME    D1 database name (default teknovo-article)
  --sample-slugs N   How many slugs to spot-check (default 5)

Package scripts:
  pnpm migrate:d1-to-pg:dry
  pnpm migrate:d1-to-pg          # includes --execute
`);
}

/** Parse wrangler `d1 execute --json` stdout (array of result envelopes). */
function parseWranglerJson(stdout: string): Record<string, unknown>[] {
  const trimmed = stdout.trim();
  // Wrangler may print banners before JSON; find the array.
  const start = trimmed.indexOf("[");
  if (start === -1) {
    throw new Error(`No JSON array in wrangler output:\n${trimmed.slice(0, 500)}`);
  }
  const parsed = JSON.parse(trimmed.slice(start)) as Array<{
    results?: Record<string, unknown>[];
    success?: boolean;
    error?: string;
  }>;
  const first = parsed[0];
  if (!first) return [];
  if (first.success === false) {
    throw new Error(first.error || "wrangler d1 execute failed");
  }
  return first.results ?? [];
}

async function d1Select(
  databaseName: string,
  remote: boolean,
  sql: string,
): Promise<Record<string, unknown>[]> {
  const args = [
    "d1",
    "execute",
    databaseName,
    remote ? "--remote" : "--local",
    "--json",
    "--command",
    sql,
  ];
  try {
    const { stdout, stderr } = await execFileAsync("pnpm", ["exec", "wrangler", ...args], {
      cwd: path.resolve(__dirname, ".."),
      maxBuffer: 64 * 1024 * 1024,
      env: process.env,
    });
    if (stderr && /error|authentication|7403|1027/i.test(stderr)) {
      console.warn("wrangler stderr:", stderr.trim().slice(0, 800));
    }
    return parseWranglerJson(stdout);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    const stdout =
      err && typeof err === "object" && "stdout" in err
        ? String((err as { stdout?: string }).stdout ?? "")
        : "";
    const stderr =
      err && typeof err === "object" && "stderr" in err
        ? String((err as { stderr?: string }).stderr ?? "")
        : "";
    const combined = `${msg}\n${stdout}\n${stderr}`;
    if (/7403|1027|Authentication|authentication|not authenticated/i.test(combined)) {
      throw new Error(
        `D1 ${remote ? "remote" : "local"} auth/access failed (wrangler 7403/1027 or similar).\n` +
          `Fix: wrangler login, or use --from-json dump, or --local after d1:migrate:local.\n` +
          combined.slice(0, 1200),
      );
    }
    throw new Error(`wrangler d1 execute failed:\n${combined.slice(0, 1200)}`);
  }
}

async function exportFromD1(
  opts: Pick<CliOptions, "databaseName" | "remote" | "local">,
): Promise<D1Export> {
  const remote = opts.remote;
  const out = {} as D1Export;
  for (const table of TABLES) {
    process.stdout.write(`  export ${table}… `);
    const rows = await d1Select(opts.databaseName, remote, `SELECT * FROM ${table}`);
    out[table] = rows;
    console.log(`${rows.length} row(s)`);
  }
  return out;
}

async function loadFromJson(filePath: string): Promise<D1Export> {
  const raw = JSON.parse(await readFile(filePath, "utf8")) as Partial<D1Export>;
  const out = {} as D1Export;
  for (const table of TABLES) {
    out[table] = Array.isArray(raw[table]) ? raw[table]! : [];
  }
  return out;
}

function asString(v: unknown): string | null {
  if (v === null || v === undefined) return null;
  if (typeof v === "string") return v;
  return String(v);
}

function asRequiredString(v: unknown, field: string): string {
  const s = asString(v);
  if (!s) throw new Error(`Missing required field: ${field}`);
  return s;
}

function parseJsonField(v: unknown, fallback: unknown): unknown {
  if (v === null || v === undefined || v === "") return fallback;
  if (typeof v === "object") return v;
  if (typeof v === "string") {
    try {
      return JSON.parse(v);
    } catch {
      return fallback;
    }
  }
  return fallback;
}

function parseDate(v: unknown): Date | null {
  const s = asString(v);
  if (!s) return null;
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d;
}

function parseDateRequired(v: unknown, field: string): Date {
  const d = parseDate(v);
  if (!d) throw new Error(`Invalid date for ${field}: ${String(v)}`);
  return d;
}

function enumOr<T extends string>(
  value: unknown,
  allowed: readonly T[],
  fallback: T,
): T {
  const s = asString(value);
  if (s && (allowed as readonly string[]).includes(s)) return s as T;
  return fallback;
}

/** Rewrite absolute R2 public URLs (and optional path-only keys) to MinIO public base. */
function rewriteMediaUrl(
  value: string | null | undefined,
  r2Base: string,
  minioBase: string,
): { value: string | null; rewritten: boolean } {
  if (value == null || value === "") return { value: value ?? null, rewritten: false };
  const trimmed = value.trim();

  // Absolute R2 CDN
  if (trimmed.startsWith(r2Base + "/") || trimmed === r2Base) {
    const rest = trimmed.slice(r2Base.length).replace(/^\//, "");
    return { value: `${minioBase}/${rest}`, rewritten: true };
  }

  // Known alternate / legacy hosts
  const legacy = [
    "https://r2.ctos.web.id",
    "http://r2.ctos.web.id",
  ];
  for (const base of legacy) {
    if (base === r2Base) continue;
    if (trimmed.startsWith(base + "/") || trimmed === base) {
      const rest = trimmed.slice(base.length).replace(/^\//, "");
      return { value: `${minioBase}/${rest}`, rewritten: true };
    }
  }

  // Relative object keys that live under public prefixes
  if (
    /^(media|brand|cms\/uploads)\//.test(trimmed) &&
    !trimmed.startsWith("http://") &&
    !trimmed.startsWith("https://")
  ) {
    return { value: `${minioBase}/${trimmed.replace(/^\//, "")}`, rewritten: true };
  }

  return { value: trimmed, rewritten: false };
}

function rewriteInText(
  text: string | null | undefined,
  r2Base: string,
  minioBase: string,
): { value: string; rewritten: number } {
  if (!text) return { value: text ?? "", rewritten: 0 };
  let count = 0;
  let out = text;
  const bases = Array.from(
    new Set([r2Base, "https://r2.ctos.web.id", "http://r2.ctos.web.id"]),
  );
  for (const base of bases) {
    if (!base) continue;
    const escaped = base.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re = new RegExp(escaped, "g");
    const next = out.replace(re, () => {
      count += 1;
      return minioBase;
    });
    out = next;
  }
  return { value: out, rewritten: count };
}

function rewriteField(
  value: string | null | undefined,
  r2Base: string,
  minioBase: string,
  counters: { urlsRewritten: number },
): string | null {
  const { value: next, rewritten } = rewriteMediaUrl(value, r2Base, minioBase);
  if (rewritten) counters.urlsRewritten += 1;
  return next;
}

async function upsertAll(
  prisma: PrismaClient,
  data: D1Export,
  opts: CliOptions,
  dryRun: boolean,
): Promise<MigrateStats[]> {
  const stats: MigrateStats[] = [];
  const r2 = opts.r2Base;
  const minio = opts.minioBase;

  // ── kategori ──
  {
    const table: TableName = "kategori";
    const counters = { urlsRewritten: 0 };
    let upserted = 0;
    for (const row of data.kategori) {
      const id = asRequiredString(row.id, "kategori.id");
      const payload = {
        id,
        nama: asRequiredString(row.nama, "kategori.nama"),
        slug: asRequiredString(row.slug, "kategori.slug"),
        deskripsi: asString(row.deskripsi),
        createdAt: parseDateRequired(row.created_at, "kategori.created_at"),
        updatedAt: parseDateRequired(row.updated_at, "kategori.updated_at"),
      };
      if (!dryRun) {
        await prisma.kategori.upsert({
          where: { id },
          create: payload,
          update: {
            nama: payload.nama,
            slug: payload.slug,
            deskripsi: payload.deskripsi,
            updatedAt: payload.updatedAt,
          },
        });
      }
      upserted += 1;
    }
    stats.push({
      table,
      source: data.kategori.length,
      upserted,
      urlsRewritten: counters.urlsRewritten,
    });
  }

  // ── berita ──
  {
    const table: TableName = "berita";
    const counters = { urlsRewritten: 0 };
    let upserted = 0;
    for (const row of data.berita) {
      const id = asRequiredString(row.id, "berita.id");
      const createdAt = parseDateRequired(row.created_at, "berita.created_at");
      const publishedAt = parseDate(row.published_at);
      const sortAt =
        parseDate(row.sort_at) ?? publishedAt ?? createdAt;
      const kontenRaw = asString(row.konten) ?? "";
      const kontenRw = rewriteInText(kontenRaw, r2, minio);
      counters.urlsRewritten += kontenRw.rewritten;

      const payload = {
        id,
        judul: asRequiredString(row.judul, "berita.judul"),
        slug: asRequiredString(row.slug, "berita.slug"),
        ringkasan: asString(row.ringkasan),
        konten: kontenRw.value,
        coverUrl: rewriteField(asString(row.cover_url), r2, minio, counters),
        status: enumOr(
          row.status,
          Object.values(BeritaStatus),
          BeritaStatus.DRAFT,
        ),
        kategoriId: asString(row.kategori_id),
        metaTitle: asString(row.meta_title),
        metaDescription: asString(row.meta_description),
        ogImageUrl: rewriteField(asString(row.og_image_url), r2, minio, counters),
        canonicalUrl: asString(row.canonical_url),
        metaKeywords: asString(row.meta_keywords),
        penulisId: asString(row.penulis_id),
        penulisNama: asString(row.penulis_nama),
        publishedAt,
        sortAt,
        createdAt,
        updatedAt: parseDateRequired(row.updated_at, "berita.updated_at"),
      };
      if (!dryRun) {
        await prisma.berita.upsert({
          where: { id },
          create: payload,
          update: {
            judul: payload.judul,
            slug: payload.slug,
            ringkasan: payload.ringkasan,
            konten: payload.konten,
            coverUrl: payload.coverUrl,
            status: payload.status,
            kategoriId: payload.kategoriId,
            metaTitle: payload.metaTitle,
            metaDescription: payload.metaDescription,
            ogImageUrl: payload.ogImageUrl,
            canonicalUrl: payload.canonicalUrl,
            metaKeywords: payload.metaKeywords,
            penulisId: payload.penulisId,
            penulisNama: payload.penulisNama,
            publishedAt: payload.publishedAt,
            sortAt: payload.sortAt,
            updatedAt: payload.updatedAt,
          },
        });
      }
      upserted += 1;
    }
    stats.push({
      table,
      source: data.berita.length,
      upserted,
      urlsRewritten: counters.urlsRewritten,
    });
  }

  // ── artikel_siswa ──
  {
    const table: TableName = "artikel_siswa";
    const counters = { urlsRewritten: 0 };
    let upserted = 0;
    for (const row of data.artikel_siswa) {
      const id = asRequiredString(row.id, "artikel.id");
      const updatedAt = parseDateRequired(row.updated_at, "artikel.updated_at");
      const submittedAt = parseDate(row.submitted_at);
      const sortAt = parseDate(row.sort_at) ?? submittedAt ?? updatedAt;
      const kontenRaw = asString(row.konten) ?? "";
      const kontenRw = rewriteInText(kontenRaw, r2, minio);
      counters.urlsRewritten += kontenRw.rewritten;

      const payload = {
        id,
        judul: asRequiredString(row.judul, "artikel.judul"),
        slug: asRequiredString(row.slug, "artikel.slug"),
        ringkasan: asString(row.ringkasan),
        konten: kontenRw.value,
        coverUrl: rewriteField(asString(row.cover_url), r2, minio, counters),
        status: enumOr(
          row.status,
          Object.values(ArtikelStatus),
          ArtikelStatus.DRAFT,
        ),
        kategoriId: asString(row.kategori_id),
        penulisId: asRequiredString(row.penulis_id, "artikel.penulis_id"),
        penulisNama: asString(row.penulis_nama),
        penulisKelas: asString(row.penulis_kelas),
        rejectedReason: asString(row.rejected_reason),
        submittedAt,
        publishedAt: parseDate(row.published_at),
        metaTitle: asString(row.meta_title),
        metaDescription: asString(row.meta_description),
        ogImageUrl: rewriteField(asString(row.og_image_url), r2, minio, counters),
        canonicalUrl: asString(row.canonical_url),
        metaKeywords: asString(row.meta_keywords),
        sortAt,
        createdAt: parseDateRequired(row.created_at, "artikel.created_at"),
        updatedAt,
      };
      if (!dryRun) {
        await prisma.artikelSiswa.upsert({
          where: { id },
          create: payload,
          update: {
            judul: payload.judul,
            slug: payload.slug,
            ringkasan: payload.ringkasan,
            konten: payload.konten,
            coverUrl: payload.coverUrl,
            status: payload.status,
            kategoriId: payload.kategoriId,
            penulisId: payload.penulisId,
            penulisNama: payload.penulisNama,
            penulisKelas: payload.penulisKelas,
            rejectedReason: payload.rejectedReason,
            submittedAt: payload.submittedAt,
            publishedAt: payload.publishedAt,
            metaTitle: payload.metaTitle,
            metaDescription: payload.metaDescription,
            ogImageUrl: payload.ogImageUrl,
            canonicalUrl: payload.canonicalUrl,
            metaKeywords: payload.metaKeywords,
            sortAt: payload.sortAt,
            updatedAt: payload.updatedAt,
          },
        });
      }
      upserted += 1;
    }
    stats.push({
      table,
      source: data.artikel_siswa.length,
      upserted,
      urlsRewritten: counters.urlsRewritten,
    });
  }

  // ── fasilitas ──
  {
    const table: TableName = "fasilitas";
    const counters = { urlsRewritten: 0 };
    let upserted = 0;
    for (const row of data.fasilitas) {
      const id = asRequiredString(row.id, "fasilitas.id");
      const payload = {
        id,
        slug: asRequiredString(row.slug, "fasilitas.slug"),
        title: asRequiredString(row.title, "fasilitas.title"),
        navLabel: asRequiredString(row.nav_label, "fasilitas.nav_label"),
        description: asString(row.description) ?? "",
        coverUrl: rewriteField(asString(row.cover_url), r2, minio, counters),
        highlightsJson: parseJsonField(row.highlights_json, []) as Prisma.InputJsonValue,
        paragraphsJson: parseJsonField(row.paragraphs_json, []) as Prisma.InputJsonValue,
        extrasJson: parseJsonField(row.extras_json, {}) as Prisma.InputJsonValue,
        sortOrder: Number(row.sort_order ?? 0) || 0,
        showInNav: Number(row.show_in_nav ?? 1) !== 0,
        status: enumOr(
          row.status,
          Object.values(SiteContentStatus),
          SiteContentStatus.DRAFT,
        ),
        publishedAt: parseDate(row.published_at),
        createdAt: parseDateRequired(row.created_at, "fasilitas.created_at"),
        updatedAt: parseDateRequired(row.updated_at, "fasilitas.updated_at"),
      };
      if (!dryRun) {
        await prisma.fasilitas.upsert({
          where: { id },
          create: payload,
          update: {
            slug: payload.slug,
            title: payload.title,
            navLabel: payload.navLabel,
            description: payload.description,
            coverUrl: payload.coverUrl,
            highlightsJson: payload.highlightsJson,
            paragraphsJson: payload.paragraphsJson,
            extrasJson: payload.extrasJson,
            sortOrder: payload.sortOrder,
            showInNav: payload.showInNav,
            status: payload.status,
            publishedAt: payload.publishedAt,
            updatedAt: payload.updatedAt,
          },
        });
      }
      upserted += 1;
    }
    stats.push({
      table,
      source: data.fasilitas.length,
      upserted,
      urlsRewritten: counters.urlsRewritten,
    });
  }

  // ── ekstrakurikuler ──
  {
    const table: TableName = "ekstrakurikuler";
    const counters = { urlsRewritten: 0 };
    let upserted = 0;
    for (const row of data.ekstrakurikuler) {
      const id = asRequiredString(row.id, "ekskul.id");
      const payload = {
        id,
        slug: asRequiredString(row.slug, "ekskul.slug"),
        name: asRequiredString(row.name, "ekskul.name"),
        detail: asString(row.detail) ?? "",
        fullDescription: asString(row.full_description) ?? "",
        kategori: enumOr(
          row.kategori,
          Object.values(EkskulKategori),
          EkskulKategori.TEKNOLOGI,
        ),
        previewUrl: rewriteField(asString(row.preview_url), r2, minio, counters),
        relatedAchievementsJson: parseJsonField(
          row.related_achievements_json,
          [],
        ) as Prisma.InputJsonValue,
        jadwalRingkas: asString(row.jadwal_ringkas),
        lokasiLatihan: asString(row.lokasi_latihan),
        pembinaNama: asString(row.pembina_nama),
        sortOrder: Number(row.sort_order ?? 0) || 0,
        status: enumOr(
          row.status,
          Object.values(SiteContentStatus),
          SiteContentStatus.DRAFT,
        ),
        publishedAt: parseDate(row.published_at),
        createdAt: parseDateRequired(row.created_at, "ekskul.created_at"),
        updatedAt: parseDateRequired(row.updated_at, "ekskul.updated_at"),
      };
      if (!dryRun) {
        await prisma.ekstrakurikuler.upsert({
          where: { id },
          create: payload,
          update: {
            slug: payload.slug,
            name: payload.name,
            detail: payload.detail,
            fullDescription: payload.fullDescription,
            kategori: payload.kategori,
            previewUrl: payload.previewUrl,
            relatedAchievementsJson: payload.relatedAchievementsJson,
            jadwalRingkas: payload.jadwalRingkas,
            lokasiLatihan: payload.lokasiLatihan,
            pembinaNama: payload.pembinaNama,
            sortOrder: payload.sortOrder,
            status: payload.status,
            publishedAt: payload.publishedAt,
            updatedAt: payload.updatedAt,
          },
        });
      }
      upserted += 1;
    }
    stats.push({
      table,
      source: data.ekstrakurikuler.length,
      upserted,
      urlsRewritten: counters.urlsRewritten,
    });
  }

  // ── prestasi ──
  {
    const table: TableName = "prestasi";
    const counters = { urlsRewritten: 0 };
    let upserted = 0;
    for (const row of data.prestasi) {
      const id = asRequiredString(row.id, "prestasi.id");
      const tanggalRaw = asRequiredString(row.tanggal_iso, "prestasi.tanggal_iso");
      const fileUrl = rewriteField(asString(row.file_url), r2, minio, counters);
      if (!fileUrl) throw new Error(`prestasi ${id}: file_url required`);
      const payload = {
        id,
        judul: asRequiredString(row.judul, "prestasi.judul"),
        penyelenggara: asString(row.penyelenggara) ?? "",
        tanggalIso: parseDateOnly(tanggalRaw),
        siswaLabel: asString(row.siswa_label) ?? "",
        ringkasan: asString(row.ringkasan) ?? "",
        fileUrl,
        sortOrder: Number(row.sort_order ?? 0) || 0,
        status: enumOr(
          row.status,
          Object.values(SiteContentStatus),
          SiteContentStatus.DRAFT,
        ),
        publishedAt: parseDate(row.published_at),
        createdAt: parseDateRequired(row.created_at, "prestasi.created_at"),
        updatedAt: parseDateRequired(row.updated_at, "prestasi.updated_at"),
      };
      if (!dryRun) {
        await prisma.prestasi.upsert({
          where: { id },
          create: payload,
          update: {
            judul: payload.judul,
            penyelenggara: payload.penyelenggara,
            tanggalIso: payload.tanggalIso,
            siswaLabel: payload.siswaLabel,
            ringkasan: payload.ringkasan,
            fileUrl: payload.fileUrl,
            sortOrder: payload.sortOrder,
            status: payload.status,
            publishedAt: payload.publishedAt,
            updatedAt: payload.updatedAt,
          },
        });
      }
      upserted += 1;
    }
    stats.push({
      table,
      source: data.prestasi.length,
      upserted,
      urlsRewritten: counters.urlsRewritten,
    });
  }

  // ── site_media ──
  {
    const table: TableName = "site_media";
    const counters = { urlsRewritten: 0 };
    let upserted = 0;
    for (const row of data.site_media) {
      const mediaKey = asRequiredString(row.media_key, "site_media.media_key");
      const url = rewriteField(asString(row.url), r2, minio, counters);
      if (!url) throw new Error(`site_media ${mediaKey}: url required`);
      const payload = {
        mediaKey,
        label: asRequiredString(row.label, "site_media.label"),
        category: asString(row.category) || "landing",
        url,
        updatedAt: parseDateRequired(row.updated_at, "site_media.updated_at"),
        updatedBy: asString(row.updated_by),
      };
      if (!dryRun) {
        await prisma.siteMedia.upsert({
          where: { mediaKey },
          create: payload,
          update: {
            label: payload.label,
            category: payload.category,
            url: payload.url,
            updatedAt: payload.updatedAt,
            updatedBy: payload.updatedBy,
          },
        });
      }
      upserted += 1;
    }
    stats.push({
      table,
      source: data.site_media.length,
      upserted,
      urlsRewritten: counters.urlsRewritten,
    });
  }

  // ── pengaturan ──
  {
    const table: TableName = "pengaturan";
    const counters = { urlsRewritten: 0 };
    let upserted = 0;
    for (const row of data.pengaturan) {
      const id = asRequiredString(row.id, "pengaturan.id");
      let payloadJson = parseJsonField(row.payload, {});
      if (payloadJson && typeof payloadJson === "object" && !Array.isArray(payloadJson)) {
        const obj = { ...(payloadJson as Record<string, unknown>) };
        for (const key of Object.keys(obj)) {
          if (typeof obj[key] === "string") {
            const rw = rewriteMediaUrl(obj[key] as string, r2, minio);
            if (rw.rewritten) {
              obj[key] = rw.value;
              counters.urlsRewritten += 1;
            }
          }
        }
        payloadJson = obj;
      }
      const payload = {
        id,
        payload: payloadJson as Prisma.InputJsonValue,
        updatedAt: parseDateRequired(row.updated_at, "pengaturan.updated_at"),
      };
      if (!dryRun) {
        await prisma.pengaturan.upsert({
          where: { id },
          create: payload,
          update: {
            payload: payload.payload,
            updatedAt: payload.updatedAt,
          },
        });
      }
      upserted += 1;
    }
    stats.push({
      table,
      source: data.pengaturan.length,
      upserted,
      urlsRewritten: counters.urlsRewritten,
    });
  }

  return stats;
}

function findOrphans(data: D1Export): OrphanReport[] {
  const kategoriIds = new Set(data.kategori.map((r) => asString(r.id)).filter(Boolean));
  const orphans: OrphanReport[] = [];

  for (const row of data.berita) {
    const kid = asString(row.kategori_id);
    if (kid && !kategoriIds.has(kid)) {
      orphans.push({
        table: "berita",
        id: asRequiredString(row.id, "id"),
        slug: asString(row.slug) ?? undefined,
        kategoriId: kid,
      });
    }
  }
  for (const row of data.artikel_siswa) {
    const kid = asString(row.kategori_id);
    if (kid && !kategoriIds.has(kid)) {
      orphans.push({
        table: "artikel_siswa",
        id: asRequiredString(row.id, "id"),
        slug: asString(row.slug) ?? undefined,
        kategoriId: kid,
      });
    }
  }
  return orphans;
}

async function validateAgainstPg(
  prisma: PrismaClient,
  data: D1Export,
  opts: CliOptions,
): Promise<{ ok: boolean; lines: string[] }> {
  const lines: string[] = [];
  let ok = true;

  const pgCounts: Record<string, number> = {
    kategori: await prisma.kategori.count(),
    berita: await prisma.berita.count(),
    artikel_siswa: await prisma.artikelSiswa.count(),
    fasilitas: await prisma.fasilitas.count(),
    ekstrakurikuler: await prisma.ekstrakurikuler.count(),
    prestasi: await prisma.prestasi.count(),
    site_media: await prisma.siteMedia.count(),
    pengaturan: await prisma.pengaturan.count(),
  };

  lines.push("Row counts (source D1 → Postgres present):");
  for (const table of TABLES) {
    const src = data[table].length;
    const pg = pgCounts[table] ?? 0;
    // After execute, PG may have extra seed rows (kategori/pengaturan). Require >= source.
    const pass = pg >= src;
    if (!pass) ok = false;
    lines.push(
      `  ${pass ? "✓" : "✗"} ${table}: D1=${src} PG=${pg}${pg > src ? " (PG has extras, OK)" : ""}`,
    );
  }

  // Sample slug checks
  const slugSamples: Array<{ table: string; slug: string; found: boolean }> = [];
  for (const row of data.berita.slice(0, opts.sampleSlugs)) {
    const slug = asString(row.slug);
    if (!slug) continue;
    const found = Boolean(await prisma.berita.findUnique({ where: { slug } }));
    slugSamples.push({ table: "berita", slug, found });
    if (!found) ok = false;
  }
  for (const row of data.fasilitas.slice(0, opts.sampleSlugs)) {
    const slug = asString(row.slug);
    if (!slug) continue;
    const found = Boolean(await prisma.fasilitas.findUnique({ where: { slug } }));
    slugSamples.push({ table: "fasilitas", slug, found });
    if (!found) ok = false;
  }
  for (const row of data.artikel_siswa.slice(0, opts.sampleSlugs)) {
    const slug = asString(row.slug);
    if (!slug) continue;
    const found = Boolean(await prisma.artikelSiswa.findUnique({ where: { slug } }));
    slugSamples.push({ table: "artikel_siswa", slug, found });
    if (!found) ok = false;
  }
  for (const row of data.ekstrakurikuler.slice(0, opts.sampleSlugs)) {
    const slug = asString(row.slug);
    if (!slug) continue;
    const found = Boolean(
      await prisma.ekstrakurikuler.findUnique({ where: { slug } }),
    );
    slugSamples.push({ table: "ekstrakurikuler", slug, found });
    if (!found) ok = false;
  }

  if (slugSamples.length) {
    lines.push("Sample slug checks:");
    for (const s of slugSamples) {
      lines.push(`  ${s.found ? "✓" : "✗"} ${s.table}/${s.slug}`);
    }
  } else {
    lines.push("Sample slug checks: (no slugs in source export)");
  }

  // Orphan FK in source
  const orphans = findOrphans(data);
  if (orphans.length) {
    lines.push(`Orphan FK report: ${orphans.length} row(s) with missing kategori`);
    for (const o of orphans.slice(0, 20)) {
      lines.push(
        `  ! ${o.table} id=${o.id} slug=${o.slug ?? "-"} kategori_id=${o.kategoriId}`,
      );
    }
  } else {
    lines.push("Orphan FK report: none");
  }

  // PG orphan kategori refs (should be rare after migrate with SetNull)
  const beritaOrphans = await prisma.$queryRaw<
    Array<{ id: string; slug: string; kategori_id: string }>
  >`
    SELECT b.id, b.slug, b.kategori_id
    FROM berita b
    LEFT JOIN kategori k ON k.id = b.kategori_id
    WHERE b.kategori_id IS NOT NULL AND k.id IS NULL
  `;
  const artikelOrphans = await prisma.$queryRaw<
    Array<{ id: string; slug: string; kategori_id: string }>
  >`
    SELECT a.id, a.slug, a.kategori_id
    FROM artikel_siswa a
    LEFT JOIN kategori k ON k.id = a.kategori_id
    WHERE a.kategori_id IS NOT NULL AND k.id IS NULL
  `;
  if (beritaOrphans.length || artikelOrphans.length) {
    ok = false;
    lines.push(
      `Postgres orphan FK: berita=${beritaOrphans.length} artikel=${artikelOrphans.length}`,
    );
  } else {
    lines.push("Postgres orphan FK: none");
  }

  return { ok, lines };
}

async function checkRewrittenUrls(
  data: D1Export,
  opts: CliOptions,
): Promise<string[]> {
  const lines: string[] = [];
  const candidates: string[] = [];
  const collect = (u: string | null | undefined) => {
    if (!u) return;
    if (u.startsWith(opts.minioBase + "/") || u === opts.minioBase) {
      candidates.push(u);
    }
  };

  for (const row of data.berita) {
    const { value } = rewriteMediaUrl(asString(row.cover_url), opts.r2Base, opts.minioBase);
    collect(value);
  }
  for (const row of data.prestasi) {
    const { value } = rewriteMediaUrl(asString(row.file_url), opts.r2Base, opts.minioBase);
    collect(value);
  }
  for (const row of data.site_media) {
    const { value } = rewriteMediaUrl(asString(row.url), opts.r2Base, opts.minioBase);
    collect(value);
  }

  const unique = [...new Set(candidates)].slice(0, 20);
  lines.push(`URL reachability (sample ${unique.length}):`);
  for (const url of unique) {
    try {
      const res = await fetch(url, { method: "HEAD", redirect: "follow" });
      lines.push(`  ${res.ok ? "✓" : "✗"} ${res.status} ${url}`);
    } catch (err) {
      lines.push(`  ✗ ERR ${url} (${err instanceof Error ? err.message : err})`);
    }
  }
  if (!unique.length) lines.push("  (no MinIO-rewritten URLs to check)");
  return lines;
}

function printRollbackNotes(): void {
  console.log(`
── Rollback (Fase 7) ──────────────────────────────────────────────
• Production DNS/API still points at Worker + D1 + R2 until Fase 8.
• Do NOT delete D1 data. Re-run this script after fixes:
    pnpm migrate:d1-to-pg:dry -- --remote
    pnpm migrate:d1-to-pg -- --remote
• Upserts are idempotent by primary key (id / media_key).
• If Postgres looks wrong: leave Worker live; truncate tenant tables
  only on the VPS DB if you intentionally want a clean re-import
  (never touch D1 for rollback).
• Optional dump for offline retry:
    pnpm migrate:d1-to-pg:dry -- --remote --dump-json /tmp/d1-export.json
    pnpm migrate:d1-to-pg -- --from-json /tmp/d1-export.json
───────────────────────────────────────────────────────────────────`);
}

async function main(): Promise<void> {
  const argv = process.argv.slice(2);
  if (argv.includes("--help") || argv.includes("-h")) {
    printHelp();
    return;
  }

  const opts = parseArgs(argv);
  const dryRun = !opts.execute;

  console.log("=== migrate-d1-to-pg ===");
  console.log(`Mode:     ${dryRun ? "DRY-RUN (no writes)" : "EXECUTE (upsert Postgres)"}`);
  console.log(
    `Source:   ${
      opts.fromJson
        ? `json:${opts.fromJson}`
        : opts.local
          ? `d1:local:${opts.databaseName}`
          : `d1:remote:${opts.databaseName}`
    }`,
  );
  console.log(`R2 base:  ${opts.r2Base}`);
  console.log(`MinIO:    ${opts.minioBase}`);

  let data: D1Export;
  if (opts.fromJson) {
    data = await loadFromJson(path.resolve(opts.fromJson));
    console.log("Loaded dump:");
    for (const t of TABLES) console.log(`  ${t}: ${data[t].length}`);
  } else {
    console.log("Exporting from D1…");
    data = await exportFromD1(opts);
  }

  if (opts.dumpJson) {
    const outPath = path.resolve(opts.dumpJson);
    await writeFile(outPath, JSON.stringify(data, null, 2), "utf8");
    console.log(`Wrote dump → ${outPath}`);
  }

  const orphans = findOrphans(data);
  if (orphans.length) {
    console.warn(
      `Warning: ${orphans.length} orphan kategori_id reference(s) in source — nulling before upsert.`,
    );
    for (const o of orphans.slice(0, 10)) {
      console.warn(`  ${o.table} ${o.slug ?? o.id} → ${o.kategoriId}`);
    }
  }

  // Avoid FK violations when D1 has stale kategori_id (null out orphans).
  const kategoriIds = new Set(
    data.kategori.map((r) => asString(r.id)).filter((id): id is string => Boolean(id)),
  );
  for (const row of data.berita) {
    const kid = asString(row.kategori_id);
    if (kid && !kategoriIds.has(kid)) row.kategori_id = null;
  }
  for (const row of data.artikel_siswa) {
    const kid = asString(row.kategori_id);
    if (kid && !kategoriIds.has(kid)) row.kategori_id = null;
  }

  if (!process.env.DATABASE_URL) {
    if (opts.execute) {
      throw new Error("DATABASE_URL is required for --execute");
    }
    console.warn("DATABASE_URL unset — skipping Postgres upsert/validation.");
    const transformStats = await transformPreview(data, opts);
    console.log("\nTransform preview:");
    for (const s of transformStats) {
      console.log(
        `  ${s.table}: rows=${s.source} urls_rewritten≈${s.urlsRewritten}`,
      );
    }
    printRollbackNotes();
    console.log("MIGRATE DRY-RUN OK (no DATABASE_URL)");
    return;
  }

  const prisma = getPrisma();

  console.log(`\n${dryRun ? "Planning" : "Upserting"}…`);
  const stats = await upsertAll(prisma, data, opts, dryRun);
  console.log("\nTable stats:");
  for (const s of stats) {
    console.log(
      `  ${s.table}: source=${s.source} ${dryRun ? "planned" : "upserted"}=${s.upserted} urls_rewritten=${s.urlsRewritten}`,
    );
  }

  if (!dryRun) {
    console.log("\nValidating against Postgres…");
    const { ok, lines } = await validateAgainstPg(prisma, data, opts);
    for (const line of lines) console.log(line);
    if (!ok) {
      printRollbackNotes();
      throw new Error("Validation failed — see counts/slug/orphan report above");
    }
  } else {
    console.log("\nDry-run validation (source orphans + planned counts only):");
    for (const s of stats) {
      console.log(`  ${s.table}: would upsert ${s.upserted} (urls≈${s.urlsRewritten})`);
    }
    if (orphans.length) {
      console.log(`  Orphans: ${orphans.length}`);
      for (const o of orphans.slice(0, 10)) {
        console.log(`    ${o.table} ${o.slug ?? o.id} → ${o.kategoriId}`);
      }
    } else {
      console.log("  Orphans: none");
    }
  }

  if (opts.checkUrls) {
    const urlLines = await checkRewrittenUrls(data, opts);
    for (const line of urlLines) console.log(line);
  }

  printRollbackNotes();
  console.log(dryRun ? "MIGRATE DRY-RUN OK" : "MIGRATE EXECUTE OK");
}

/** Count URL rewrites without Prisma (used when DATABASE_URL missing). */
async function transformPreview(
  data: D1Export,
  opts: CliOptions,
): Promise<MigrateStats[]> {
  // Reuse upsertAll dry path needs prisma — implement lightweight counter instead.
  const stats: MigrateStats[] = [];
  const countRewrites = (rows: Record<string, unknown>[], fields: string[]) => {
    let n = 0;
    for (const row of rows) {
      for (const f of fields) {
        const { rewritten } = rewriteMediaUrl(
          asString(row[f]),
          opts.r2Base,
          opts.minioBase,
        );
        if (rewritten) n += 1;
      }
      if (typeof row.konten === "string") {
        n += rewriteInText(row.konten, opts.r2Base, opts.minioBase).rewritten;
      }
    }
    return n;
  };

  stats.push({
    table: "kategori",
    source: data.kategori.length,
    upserted: data.kategori.length,
    urlsRewritten: 0,
  });
  stats.push({
    table: "berita",
    source: data.berita.length,
    upserted: data.berita.length,
    urlsRewritten: countRewrites(data.berita, ["cover_url", "og_image_url"]),
  });
  stats.push({
    table: "artikel_siswa",
    source: data.artikel_siswa.length,
    upserted: data.artikel_siswa.length,
    urlsRewritten: countRewrites(data.artikel_siswa, ["cover_url", "og_image_url"]),
  });
  stats.push({
    table: "fasilitas",
    source: data.fasilitas.length,
    upserted: data.fasilitas.length,
    urlsRewritten: countRewrites(data.fasilitas, ["cover_url"]),
  });
  stats.push({
    table: "ekstrakurikuler",
    source: data.ekstrakurikuler.length,
    upserted: data.ekstrakurikuler.length,
    urlsRewritten: countRewrites(data.ekstrakurikuler, ["preview_url"]),
  });
  stats.push({
    table: "prestasi",
    source: data.prestasi.length,
    upserted: data.prestasi.length,
    urlsRewritten: countRewrites(data.prestasi, ["file_url"]),
  });
  stats.push({
    table: "site_media",
    source: data.site_media.length,
    upserted: data.site_media.length,
    urlsRewritten: countRewrites(data.site_media, ["url"]),
  });
  stats.push({
    table: "pengaturan",
    source: data.pengaturan.length,
    upserted: data.pengaturan.length,
    urlsRewritten: 0,
  });
  return stats;
}

main()
  .catch((err) => {
    console.error("MIGRATE FAIL", err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await disconnectPrisma();
  });
