/**
 * Copy object binaries from R2 public CDN → MinIO (same object keys).
 *
 * Complements `migrate-d1-to-pg` (URL rewrite only) and `minio:seed` (catalog/landing).
 * Collects keys from Postgres media fields / HTML / pengaturan, optional D1 JSON dump,
 * keys file, and catalog defaults. Does **not** invent keys that never appear in data.
 *
 * Default is dry-run (plan only). Live PutObject requires `--execute`.
 *
 * Usage:
 *   pnpm migrate:r2-objects:dry
 *   pnpm migrate:r2-objects -- --execute
 *   pnpm exec tsx scripts/migrate-r2-objects-to-minio.ts --from-pg --execute
 *   pnpm exec tsx scripts/migrate-r2-objects-to-minio.ts --from-json /tmp/d1-export.json --dry-run
 *   pnpm exec tsx scripts/migrate-r2-objects-to-minio.ts --keys-file /tmp/keys.txt --execute --force
 *
 * Env:
 *   R2_PUBLIC_URL / SEED_SRC   source HTTPS base (default https://r2.ctos.web.id)
 *   MINIO_*                    destination (see .env.example)
 *   DATABASE_URL               required for --from-pg (default when set)
 *   MIGRATE_OBJECTS_EXECUTE=1  alt to --execute
 *   MIGRATE_OBJECTS_CONCURRENCY concurrency (default 4)
 *
 * Notes:
 *   - `cms/uploads/*` stay private on MinIO (F-26). Use `--public-cms-uploads` only if
 *     public Astro must GET those URLs anonymously (parity with current R2 CDN).
 *   - Skip external http(s) hosts that are not R2 / MinIO bases.
 */
import "dotenv/config";
import { readFile, writeFile } from "node:fs/promises";
import {
  CreateBucketCommand,
  HeadBucketCommand,
  HeadObjectCommand,
  PutBucketPolicyCommand,
} from "@aws-sdk/client-s3";
import { PrismaClient } from "@prisma/client";
import {
  destroyS3Client,
  getS3Client,
  loadMinioConfig,
  type MinioConfig,
} from "../src/lib/minio/client";
import { putObject } from "../src/lib/minio/upload";
import { objectUrl } from "../src/lib/minio/url";
import { SITE_MEDIA_CATALOG } from "../src/lib/prisma/site-media-repo";
import { CMS_UPLOAD_PREFIX } from "../src/lib/media-constants";

const DEFAULT_R2 = "https://r2.ctos.web.id";
const KEY_PREFIX_RE = /^(media|brand|cms\/uploads)\//;

type CliOptions = {
  execute: boolean;
  fromPg: boolean;
  fromJson: string | null;
  keysFile: string | null;
  dumpKeys: string | null;
  includeSeedKeys: boolean;
  fromR2List: boolean;
  force: boolean;
  publicCmsUploads: boolean;
  skipExisting: boolean;
  check: boolean;
  concurrency: number;
  r2Base: string;
  limit: number | null;
};

type KeySource = string;

type PlanRow = {
  key: string;
  sources: KeySource[];
  status:
    | "planned"
    | "exists"
    | "copied"
    | "failed"
    | "skipped_external"
    | "missing_source";
  bytes?: number;
  error?: string;
};

function parseArgs(argv: string[]): CliOptions {
  argv = argv.filter((a) => a !== "--");
  const has = (flag: string) => argv.includes(flag);
  const get = (flag: string): string | null => {
    const i = argv.indexOf(flag);
    if (i === -1) return null;
    return argv[i + 1] ?? null;
  };
  const getNum = (flag: string, fallback: number): number => {
    const raw = get(flag);
    if (!raw) return fallback;
    const n = Number(raw);
    return Number.isFinite(n) && n > 0 ? n : fallback;
  };

  const execute =
    has("--execute") || process.env.MIGRATE_OBJECTS_EXECUTE === "1";
  const fromJson = get("--from-json");
  const keysFile = get("--keys-file");
  const explicitPg = has("--from-pg");
  const fromPg =
    explicitPg ||
    (!fromJson && !keysFile && Boolean(process.env.DATABASE_URL));

  const concurrency = getNum(
    "--concurrency",
    Number(process.env.MIGRATE_OBJECTS_CONCURRENCY || 4),
  );
  const limitRaw = get("--limit");
  const limit = limitRaw ? Math.max(1, Number(limitRaw) || 0) || null : null;

  const r2Base = (
    process.env.R2_PUBLIC_URL ||
    process.env.SEED_SRC ||
    DEFAULT_R2
  ).replace(/\/$/, "");

  return {
    execute,
    fromPg,
    fromJson,
    keysFile,
    dumpKeys: get("--dump-keys"),
    includeSeedKeys: has("--include-seed-keys"),
    fromR2List: has("--from-r2-list") || has("--all-r2"),
    force: has("--force"),
    publicCmsUploads: has("--public-cms-uploads"),
    skipExisting: !has("--force"),
    check: has("--check"),
    concurrency: Math.min(Math.max(concurrency, 1), 16),
    r2Base,
    limit,
  };
}

function mimeFor(key: string): string {
  const lower = key.toLowerCase();
  if (lower.endsWith(".webp")) return "image/webp";
  if (lower.endsWith(".mp4")) return "video/mp4";
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
  if (lower.endsWith(".svg")) return "image/svg+xml";
  if (lower.endsWith(".gif")) return "image/gif";
  if (lower.endsWith(".pdf")) return "application/pdf";
  return "application/octet-stream";
}

/** Map absolute/relative media URL → object key, or null if external/irrelevant. */
function urlToObjectKey(
  value: string | null | undefined,
  r2Bases: string[],
  minioBase: string,
): string | null {
  if (value == null) return null;
  const trimmed = value.trim();
  if (!trimmed || trimmed.startsWith("data:")) return null;

  const tryStrip = (base: string): string | null => {
    const b = base.replace(/\/$/, "");
    if (!b) return null;
    if (trimmed === b) return null;
    if (trimmed.startsWith(b + "/")) {
      return trimmed.slice(b.length + 1).replace(/^\//, "");
    }
    return null;
  };

  for (const base of r2Bases) {
    const rest = tryStrip(base);
    if (rest && KEY_PREFIX_RE.test(rest)) return rest.split(/[?#]/)[0]!;
  }
  const fromMinio = tryStrip(minioBase);
  if (fromMinio && KEY_PREFIX_RE.test(fromMinio)) {
    return fromMinio.split(/[?#]/)[0]!;
  }

  // Relative key (not an absolute URL)
  if (
    KEY_PREFIX_RE.test(trimmed) &&
    !trimmed.startsWith("http://") &&
    !trimmed.startsWith("https://")
  ) {
    return trimmed.replace(/^\//, "").split(/[?#]/)[0]!;
  }

  // Unknown absolute host — do not invent keys from path alone
  return null;
}

function collectFromText(
  text: string | null | undefined,
  r2Bases: string[],
  minioBase: string,
  into: Map<string, Set<KeySource>>,
  source: KeySource,
): void {
  if (!text) return;
  // Absolute URLs + relative media/brand/cms paths in HTML/JSON strings
  const re =
    /https?:\/\/[^\s"'<>)\\]+|(?:^|["'(=\s])((?:media|brand|cms\/uploads)\/[^\s"'<>)\\]+)/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    const raw = (m[1] ?? m[0]!).replace(/^["'(=\s]+/, "");
    const key = urlToObjectKey(raw, r2Bases, minioBase);
    if (key) addKey(into, key, source);
  }
}

function walkJson(
  value: unknown,
  r2Bases: string[],
  minioBase: string,
  into: Map<string, Set<KeySource>>,
  source: KeySource,
): void {
  if (value == null) return;
  if (typeof value === "string") {
    const key = urlToObjectKey(value, r2Bases, minioBase);
    if (key) addKey(into, key, source);
    else collectFromText(value, r2Bases, minioBase, into, source);
    return;
  }
  if (Array.isArray(value)) {
    for (const item of value) walkJson(item, r2Bases, minioBase, into, source);
    return;
  }
  if (typeof value === "object") {
    for (const v of Object.values(value as Record<string, unknown>)) {
      walkJson(v, r2Bases, minioBase, into, source);
    }
  }
}

function addKey(
  into: Map<string, Set<KeySource>>,
  key: string,
  source: KeySource,
): void {
  const normalized = key.replace(/^\//, "").split(/[?#]/)[0]!;
  if (!KEY_PREFIX_RE.test(normalized) || normalized.includes("..")) return;
  let set = into.get(normalized);
  if (!set) {
    set = new Set();
    into.set(normalized, set);
  }
  set.add(source);
}

async function collectFromPg(
  r2Bases: string[],
  minioBase: string,
): Promise<Map<string, Set<KeySource>>> {
  const prisma = new PrismaClient();
  const into = new Map<string, Set<KeySource>>();
  try {
    const [
      berita,
      artikel,
      fasilitas,
      ekskul,
      prestasi,
      siteMedia,
      pengaturan,
    ] = await Promise.all([
      prisma.berita.findMany({
        select: { coverUrl: true, ogImageUrl: true, konten: true },
      }),
      prisma.artikelSiswa.findMany({
        select: { coverUrl: true, ogImageUrl: true, konten: true },
      }),
      prisma.fasilitas.findMany({ select: { coverUrl: true } }),
      prisma.ekstrakurikuler.findMany({ select: { previewUrl: true } }),
      prisma.prestasi.findMany({ select: { fileUrl: true } }),
      prisma.siteMedia.findMany({ select: { url: true } }),
      prisma.pengaturan.findMany({ select: { payload: true } }),
    ]);

    for (const row of berita) {
      for (const v of [row.coverUrl, row.ogImageUrl]) {
        const key = urlToObjectKey(v, r2Bases, minioBase);
        if (key) addKey(into, key, "pg:berita");
      }
      collectFromText(row.konten, r2Bases, minioBase, into, "pg:berita.konten");
    }
    for (const row of artikel) {
      for (const v of [row.coverUrl, row.ogImageUrl]) {
        const key = urlToObjectKey(v, r2Bases, minioBase);
        if (key) addKey(into, key, "pg:artikel");
      }
      collectFromText(row.konten, r2Bases, minioBase, into, "pg:artikel.konten");
    }
    for (const row of fasilitas) {
      const key = urlToObjectKey(row.coverUrl, r2Bases, minioBase);
      if (key) addKey(into, key, "pg:fasilitas");
    }
    for (const row of ekskul) {
      const key = urlToObjectKey(row.previewUrl, r2Bases, minioBase);
      if (key) addKey(into, key, "pg:ekskul");
    }
    for (const row of prestasi) {
      const key = urlToObjectKey(row.fileUrl, r2Bases, minioBase);
      if (key) addKey(into, key, "pg:prestasi");
    }
    for (const row of siteMedia) {
      const key = urlToObjectKey(row.url, r2Bases, minioBase);
      if (key) addKey(into, key, "pg:site_media");
    }
    for (const row of pengaturan) {
      walkJson(row.payload, r2Bases, minioBase, into, "pg:pengaturan");
    }
  } finally {
    await prisma.$disconnect();
  }
  return into;
}

type D1ExportLite = Record<string, Record<string, unknown>[]>;

async function collectFromD1Json(
  filePath: string,
  r2Bases: string[],
  minioBase: string,
): Promise<Map<string, Set<KeySource>>> {
  const raw = JSON.parse(await readFile(filePath, "utf8")) as D1ExportLite;
  const into = new Map<string, Set<KeySource>>();

  const takeField = (
    rows: Record<string, unknown>[] | undefined,
    fields: string[],
    source: KeySource,
  ) => {
    for (const row of rows ?? []) {
      for (const f of fields) {
        const key = urlToObjectKey(
          typeof row[f] === "string" ? (row[f] as string) : null,
          r2Bases,
          minioBase,
        );
        if (key) addKey(into, key, source);
      }
      if (typeof row.konten === "string") {
        collectFromText(row.konten, r2Bases, minioBase, into, `${source}.konten`);
      }
      if (fHasPayload(row)) {
        const rawPayload = row.payload;
        if (typeof rawPayload === "string") {
          try {
            walkJson(
              JSON.parse(rawPayload),
              r2Bases,
              minioBase,
              into,
              `${source}.payload`,
            );
          } catch {
            collectFromText(
              rawPayload,
              r2Bases,
              minioBase,
              into,
              `${source}.payload`,
            );
          }
        } else {
          walkJson(rawPayload, r2Bases, minioBase, into, `${source}.payload`);
        }
      }
    }
  };

  takeField(raw.berita, ["cover_url", "og_image_url"], "d1:berita");
  takeField(raw.artikel_siswa, ["cover_url", "og_image_url"], "d1:artikel");
  takeField(raw.fasilitas, ["cover_url"], "d1:fasilitas");
  takeField(raw.ekstrakurikuler, ["preview_url"], "d1:ekskul");
  takeField(raw.prestasi, ["file_url"], "d1:prestasi");
  takeField(raw.site_media, ["url"], "d1:site_media");
  takeField(raw.pengaturan, [], "d1:pengaturan");

  return into;
}

function fHasPayload(row: Record<string, unknown>): boolean {
  return "payload" in row;
}

function addKeyRaw(
  into: Map<string, Set<KeySource>>,
  key: string,
  source: KeySource,
): void {
  const normalized = key.replace(/^\//, "").split(/[?#]/)[0]!;
  if (!normalized || normalized.includes("..")) return;
  let set = into.get(normalized);
  if (!set) {
    set = new Set();
    into.set(normalized, set);
  }
  set.add(source);
}

async function collectFromR2List(
  r2S3: R2S3Source,
): Promise<Map<string, Set<KeySource>>> {
  const { ListObjectsV2Command } = await import("@aws-sdk/client-s3");
  const into = new Map<string, Set<KeySource>>();
  let token: string | undefined;
  do {
    const out = await r2S3.client.send(
      new ListObjectsV2Command({
        Bucket: r2S3.bucket,
        ContinuationToken: token,
        MaxKeys: 1000,
      }),
    );
    for (const obj of out.Contents ?? []) {
      const key = obj.Key?.replace(/^\//, "");
      if (!key || key.endsWith("/")) continue;
      addKeyRaw(into, key, "r2-list");
    }
    token = out.IsTruncated ? out.NextContinuationToken : undefined;
  } while (token);
  return into;
}

async function collectFromKeysFile(
  filePath: string,
): Promise<Map<string, Set<KeySource>>> {
  const text = await readFile(filePath, "utf8");
  const into = new Map<string, Set<KeySource>>();
  for (const line of text.split(/\r?\n/)) {
    const key = line.trim();
    if (!key || key.startsWith("#")) continue;
    addKey(into, key, "keys-file");
  }
  return into;
}

function mergeMaps(
  target: Map<string, Set<KeySource>>,
  extra: Map<string, Set<KeySource>>,
): void {
  for (const [key, sources] of extra) {
    for (const s of sources) addKey(target, key, s);
  }
}

async function ensureBucket(
  config: MinioConfig,
  publicCmsUploads: boolean,
): Promise<void> {
  const s3 = getS3Client(config);
  try {
    await s3.send(new HeadBucketCommand({ Bucket: config.bucket }));
  } catch {
    await s3.send(new CreateBucketCommand({ Bucket: config.bucket }));
    console.log(`Created bucket: ${config.bucket}`);
  }

  const resources = [
    `arn:aws:s3:::${config.bucket}/media/*`,
    `arn:aws:s3:::${config.bucket}/brand/*`,
  ];
  if (publicCmsUploads) {
    resources.push(`arn:aws:s3:::${config.bucket}/cms/uploads/*`);
  }

  await s3.send(
    new PutBucketPolicyCommand({
      Bucket: config.bucket,
      Policy: JSON.stringify({
        Version: "2012-10-17",
        Statement: [
          {
            Sid: publicCmsUploads
              ? "PublicReadMediaBrandCms"
              : "PublicReadMediaBrand",
            Effect: "Allow",
            Principal: "*",
            Action: ["s3:GetObject"],
            Resource: resources,
          },
        ],
      }),
    }),
  );
}

async function minioHasObject(
  config: MinioConfig,
  key: string,
): Promise<boolean> {
  const s3 = getS3Client(config);
  try {
    await s3.send(
      new HeadObjectCommand({ Bucket: config.bucket, Key: key }),
    );
    return true;
  } catch {
    return false;
  }
}

type R2S3Source = {
  client: import("@aws-sdk/client-s3").S3Client;
  bucket: string;
};

async function createR2S3Source(): Promise<R2S3Source | null> {
  const accountId = process.env.R2_ACCOUNT_ID?.trim();
  const accessKey = process.env.R2_ACCESS_KEY_ID?.trim();
  const secretKey = process.env.R2_SECRET_ACCESS_KEY?.trim();
  const bucket = (process.env.R2_BUCKET_NAME || "teknovo").trim();
  if (!accountId || !accessKey || !secretKey) return null;

  const { S3Client } = await import("@aws-sdk/client-s3");
  const client = new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    forcePathStyle: true,
    credentials: {
      accessKeyId: accessKey,
      secretAccessKey: secretKey,
    },
  });
  return { client, bucket };
}

async function fetchSource(
  r2Base: string,
  key: string,
  r2S3: R2S3Source | null,
): Promise<{ body: Buffer; contentType: string; via: "cdn" | "r2-s3" }> {
  const url = `${r2Base.replace(/\/$/, "")}/${key}`;
  let cdnError: string | null = null;
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(60_000) });
    if (res.ok) {
      const body = Buffer.from(await res.arrayBuffer());
      if (body.length === 0) throw new Error("empty body");
      const contentType =
        res.headers.get("content-type")?.split(";")[0]?.trim() || mimeFor(key);
      return { body, contentType, via: "cdn" };
    }
    cdnError = `HTTP ${res.status} from ${url}`;
  } catch (err) {
    cdnError = err instanceof Error ? err.message : String(err);
  }

  if (!r2S3) {
    throw new Error(cdnError ?? `CDN miss for ${key}`);
  }

  const { GetObjectCommand } = await import("@aws-sdk/client-s3");
  try {
    const out = await r2S3.client.send(
      new GetObjectCommand({ Bucket: r2S3.bucket, Key: key }),
    );
    const bytes = await out.Body?.transformToByteArray();
    if (!bytes || bytes.length === 0) {
      throw new Error(`R2 S3 empty body for ${key}`);
    }
    return {
      body: Buffer.from(bytes),
      contentType: out.ContentType || mimeFor(key),
      via: "r2-s3",
    };
  } catch (err) {
    const s3Err = err instanceof Error ? err.message : String(err);
    throw new Error(`${cdnError}; R2 S3: ${s3Err}`);
  }
}

async function mapPool<T, R>(
  items: T[],
  concurrency: number,
  fn: (item: T, index: number) => Promise<R>,
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let next = 0;
  async function worker() {
    for (;;) {
      const i = next++;
      if (i >= items.length) return;
      results[i] = await fn(items[i]!, i);
    }
  }
  await Promise.all(
    Array.from({ length: Math.min(concurrency, items.length) }, () => worker()),
  );
  return results;
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  const config = loadMinioConfig();
  const r2Bases = Array.from(
    new Set([
      opts.r2Base,
      DEFAULT_R2,
      "http://r2.ctos.web.id",
      "https://r2.smkteknovo.sch.id",
      "http://r2.smkteknovo.sch.id",
      config.publicUrl,
    ]),
  );

  console.log(
    opts.execute
      ? "Mode: EXECUTE (will PutObject to MinIO)"
      : "Mode: DRY-RUN (no writes)",
  );
  console.log(`Source CDN: ${opts.r2Base}`);
  console.log(`MinIO bucket: ${config.bucket} @ ${config.endpoint}`);
  console.log(`MinIO public: ${config.publicUrl}`);

  if (!opts.fromPg && !opts.fromJson && !opts.keysFile && !opts.includeSeedKeys && !opts.fromR2List) {
    throw new Error(
      "No key source. Set DATABASE_URL (or --from-pg), --from-json, --keys-file, --from-r2-list, and/or --include-seed-keys",
    );
  }
  if (opts.fromPg && !process.env.DATABASE_URL) {
    throw new Error("--from-pg requires DATABASE_URL");
  }

  const r2S3Early = opts.fromR2List ? await createR2S3Source() : null;
  if (opts.fromR2List && !r2S3Early) {
    throw new Error(
      "--from-r2-list requires R2_ACCOUNT_ID + R2_ACCESS_KEY_ID + R2_SECRET_ACCESS_KEY",
    );
  }

  const keys = new Map<string, Set<KeySource>>();

  if (opts.fromPg) {
    console.log("Collecting keys from Postgres…");
    mergeMaps(keys, await collectFromPg(r2Bases, config.publicUrl));
  }
  if (opts.fromJson) {
    console.log(`Collecting keys from ${opts.fromJson}…`);
    mergeMaps(
      keys,
      await collectFromD1Json(opts.fromJson, r2Bases, config.publicUrl),
    );
  }
  if (opts.keysFile) {
    console.log(`Collecting keys from ${opts.keysFile}…`);
    mergeMaps(keys, await collectFromKeysFile(opts.keysFile));
  }
  if (opts.fromR2List && r2S3Early) {
    console.log(`Listing all objects in R2 bucket ${r2S3Early.bucket}…`);
    mergeMaps(keys, await collectFromR2List(r2S3Early));
  }
  if (opts.includeSeedKeys) {
    for (const entry of SITE_MEDIA_CATALOG) {
      addKey(keys, entry.defaultPath, "catalog");
    }
  }

  let keyList = [...keys.keys()].sort();
  if (opts.limit != null) {
    keyList = keyList.slice(0, opts.limit);
  }

  const cmsCount = keyList.filter((k) => k.startsWith(CMS_UPLOAD_PREFIX)).length;
  console.log(
    `Keys: ${keyList.length} (cms/uploads=${cmsCount}, media/brand=${keyList.length - cmsCount})`,
  );

  if (opts.dumpKeys) {
    await writeFile(opts.dumpKeys, keyList.join("\n") + "\n", "utf8");
    console.log(`Wrote key list → ${opts.dumpKeys}`);
  }

  if (keyList.length === 0) {
    console.log("Nothing to copy.");
    return;
  }

  if (opts.execute) {
    await ensureBucket(config, opts.publicCmsUploads);
    if (opts.publicCmsUploads) {
      console.log("Bucket policy: public-read includes cms/uploads/*");
    } else if (cmsCount > 0) {
      console.warn(
        `Note: ${cmsCount} cms/uploads/* object(s) will be private on MinIO (anonymous GET fails). ` +
          `Pass --public-cms-uploads for R2-CDN parity, or serve via authenticated API.`,
      );
    }
  }

  const plan: PlanRow[] = keyList.map((key) => ({
    key,
    sources: [...(keys.get(key) ?? [])],
    status: "planned",
  }));

  const r2S3 = r2S3Early ?? (await createR2S3Source());
  if (r2S3) {
    console.log(`R2 S3 fallback: bucket=${r2S3.bucket} (CDN miss → GetObject)`);
  } else {
    console.log("R2 S3 fallback: off (set R2_ACCOUNT_ID + R2_ACCESS_KEY_ID + R2_SECRET_ACCESS_KEY)");
  }

  await mapPool(plan, opts.concurrency, async (row) => {
    try {
      if (opts.execute && opts.skipExisting) {
        const exists = await minioHasObject(config, row.key);
        if (exists) {
          row.status = "exists";
          return row;
        }
      }

      if (!opts.execute) {
        // Probe: CDN HEAD/GET, then optional R2 S3 HeadObject
        const url = `${opts.r2Base}/${row.key}`;
        const head = await fetch(url, {
          method: "HEAD",
          signal: AbortSignal.timeout(20_000),
          redirect: "follow",
        });
        if (head.ok) {
          row.status = "planned";
          return row;
        }
        const get = await fetch(url, {
          method: "GET",
          signal: AbortSignal.timeout(20_000),
          headers: { Range: "bytes=0-0" },
        });
        if (get.ok || get.status === 206) {
          await get.body?.cancel().catch(() => undefined);
          row.status = "planned";
          return row;
        }
        await get.body?.cancel().catch(() => undefined);

        if (r2S3) {
          const { HeadObjectCommand } = await import("@aws-sdk/client-s3");
          try {
            await r2S3.client.send(
              new HeadObjectCommand({ Bucket: r2S3.bucket, Key: row.key }),
            );
            row.status = "planned";
            return row;
          } catch {
            /* fall through */
          }
        }
        row.status = "missing_source";
        row.error = `source HTTP ${get.status}`;
        return row;
      }

      const { body, contentType, via } = await fetchSource(
        opts.r2Base,
        row.key,
        r2S3,
      );
      row.bytes = body.length;
      await putObject(row.key, body, { contentType, config });
      row.status = "copied";
      if (via === "r2-s3") {
        row.sources = [...row.sources, "via:r2-s3"];
      }
      return row;
    } catch (err) {
      row.status = opts.execute ? "failed" : "missing_source";
      row.error = err instanceof Error ? err.message : String(err);
      return row;
    }
  });

  if (r2S3) {
    r2S3.client.destroy();
  }

  const counts = {
    planned: 0,
    exists: 0,
    copied: 0,
    failed: 0,
    missing_source: 0,
    skipped_external: 0,
  };
  for (const row of plan) {
    counts[row.status] += 1;
  }

  const sample = plan.slice(0, 30);
  for (const row of sample) {
    const src = row.sources.slice(0, 3).join(",");
    const extra = row.error ? ` — ${row.error}` : row.bytes != null ? ` (${row.bytes} B)` : "";
    console.log(`  [${row.status}] ${row.key} ← ${src}${extra}`);
  }
  if (plan.length > sample.length) {
    console.log(`  … +${plan.length - sample.length} more`);
  }

  if (opts.execute && opts.check) {
    let ok = 0;
    let fail = 0;
    for (const row of plan.filter((r) => r.status === "copied" || r.status === "exists")) {
      const exists = await minioHasObject(config, row.key);
      if (exists) ok += 1;
      else {
        fail += 1;
        console.warn(`  check FAIL missing: ${row.key}`);
      }
    }
    console.log(`MinIO HEAD check: ok=${ok} fail=${fail}`);
    // Optional public GET for media/brand only
    const publicSample = plan.find(
      (r) =>
        (r.status === "copied" || r.status === "exists") &&
        (r.key.startsWith("media/") || r.key.startsWith("brand/")),
    );
    if (publicSample) {
      const url = objectUrl(publicSample.key, config);
      const res = await fetch(url, { method: "GET", signal: AbortSignal.timeout(15_000) });
      console.log(`Public GET sample: ${url} → ${res.status}`);
      await res.body?.cancel().catch(() => undefined);
    }
  }

  console.log(
    `Done. planned=${counts.planned} copied=${counts.copied} exists=${counts.exists} ` +
      `missing_source=${counts.missing_source} failed=${counts.failed}`,
  );

  if (opts.execute && counts.failed > 0) {
    process.exitCode = 1;
  }
  if (!opts.execute && counts.missing_source > 0) {
    console.warn(
      "Dry-run found keys with unreachable R2 source — fix CDN or remove stale DB URLs before --execute.",
    );
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await destroyS3Client();
  });
