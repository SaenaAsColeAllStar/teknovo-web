# API Contract — teknovo-web CMS

**Default backend (sekarang): Cloudflare D1** `teknovo-article` via binding `DB`, exposed as same-origin `/api/v1/*`.

Optional: set `API_URL` / `NEXT_PUBLIC_API_URL` to point at external api-web instead (homelab). Jika kosong, client memakai `/api/v1/...` (D1).

Media tetap di **R2** (`CMS_BUCKET`).

## Env (teknovo-web)

| Variable | Required | Keterangan |
|----------|----------|------------|
| D1 `DB` | Ya (Workers) | Binding di `wrangler.toml` → database `teknovo-article` |
| `API_URL` | Tidak | Jika di-set, override ke api-web eksternal |
| `NEXT_PUBLIC_API_URL` | Tidak | Sama; kosong = same-origin D1 |
| `REVALIDATE_SECRET` | Opsional | Callback eksternal ke `POST /api/revalidate` |
| Clerk keys | Ya (CMS) | `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY` |

Migrasi:

```bash
pnpm d1:migrate:remote   # production D1
pnpm d1:migrate:local    # local wrangler D1
```

Tanpa binding D1 (plain `next dev`), route `/api/v1` mengembalikan 503 dengan pesan jelas. Gunakan `pnpm preview` / deploy.

Semua respons sukses berbentuk:

```json
{ "ok": true, "data": ... }
```

List:

```json
{
  "ok": true,
  "data": [],
  "meta": { "page": 1, "limit": 20, "total": 0 }
}
```

Error:

```json
{
  "ok": false,
  "error": { "code": "NOT_FOUND", "message": "..." }
}
```

## Endpoints (target)

### Berita

| Method | Path | Auth | Keterangan |
|--------|------|------|------------|
| `GET` | `/v1/berita` | Publik | Query: `page`, `limit`, `kategori`, `status=PUBLISHED` |
| `GET` | `/v1/berita/:slug` | Publik | Detail published |
| `GET` | `/v1/berita/id/:id` | Bearer | CMS detail |
| `POST` | `/v1/berita` | Bearer | Buat draft/publish |
| `PATCH` | `/v1/berita/:id` | Bearer | Update |
| `DELETE` | `/v1/berita/:id` | Bearer | Soft/hard delete |

Body `POST/PATCH` (Zod mirror di `src/lib/api-client.ts`):

```json
{
  "judul": "string",
  "slug": "kebab-case",
  "ringkasan": "string?",
  "konten": "html string",
  "kategoriId": "uuid?",
  "status": "DRAFT|PUBLISHED|ARCHIVED",
  "coverUrl": "https://...?",
  "metaTitle": "string? (max ~70)",
  "metaDescription": "string? (max ~160)",
  "ogImageUrl": "https://...?",
  "canonicalUrl": "https://...?"
}
```

### Artikel siswa (ekskul channel)

Workflow: `DRAFT` → `REVIEW` → `PUBLISHED` | `ARCHIVED` (tolak).

| Method | Path | Auth | Keterangan |
|--------|------|------|------------|
| `GET` | `/v1/artikel-siswa` | Publik / Bearer | Query: `page`, `limit`, `status`, `mine=1` (Bearer: milik sendiri) |
| `GET` | `/v1/artikel-siswa/:slug` | Publik | Detail published saja |
| `GET` | `/v1/artikel-siswa/id/:id` | Bearer | CMS detail (siswa: milik sendiri) |
| `POST` | `/v1/artikel-siswa` | Bearer | Buat (siswa/editor/admin) |
| `PATCH` | `/v1/artikel-siswa/:id` | Bearer | Update (siswa: milik sendiri; tidak boleh force `PUBLISHED`) |
| `DELETE` | `/v1/artikel-siswa/:id` | Bearer | Hapus (siswa: milik sendiri) |
| `POST` | `/v1/artikel-siswa/:id/approve` | Bearer admin | `REVIEW` → `PUBLISHED` |
| `POST` | `/v1/artikel-siswa/:id/reject` | Bearer admin | `REVIEW` → `ARCHIVED`; body `{ "reason"?: string }` |

Body `POST/PATCH`:

```json
{
  "judul": "string",
  "slug": "kebab-case",
  "ringkasan": "string?",
  "konten": "html string",
  "kategoriId": "uuid?",
  "status": "DRAFT|REVIEW|PUBLISHED|ARCHIVED",
  "coverUrl": "https://...?",
  "penulisKelas": "string?"
}
```

Publik listing hanya `status=PUBLISHED`. Setelah approve, api-web sebaiknya memanggil `POST /api/revalidate` dengan `tag: "artikel-siswa"` dan `path: "/berita/berita-terbaru"` (atau tag+path berita).

### Kategori

| Method | Path | Auth |
|--------|------|------|
| `GET` | `/v1/kategori` | Publik |
| `POST` | `/v1/kategori` | Bearer |
| `PATCH` | `/v1/kategori/:id` | Bearer |
| `DELETE` | `/v1/kategori/:id` | Bearer |

Body `POST/PATCH` (Zod mirror di `src/lib/api-client.ts`):

```json
{
  "nama": "string",
  "slug": "kebab-case",
  "deskripsi": "string?"
}
```

### Media (teknovo-web → R2, bukan api-web)

Upload/list/delete langsung ke binding Workers `CMS_BUCKET` (prefix `cms/uploads/`):

| Method | Path | Auth | Keterangan |
|--------|------|------|------------|
| `GET` | `/api/cms/media` | Clerk session | List objek |
| `POST` | `/api/cms/media` | Clerk + admin\|editor\|siswa | multipart `file` |
| `DELETE` | `/api/cms/media` | Clerk + editor\|admin | JSON `{ "key": "cms/uploads/..." }` |

URL publik: `R2_PUBLIC_URL` + key (`publicAssetUrl` / `r2ObjectUrl`). Hanya key di bawah `cms/uploads/` yang boleh dihapus (aset landing `media/` / `brand/` aman).

### Pengaturan situs (admin)

Singleton metadata portal:

| Method | Path | Auth | Keterangan |
|--------|------|------|------------|
| `GET` | `/v1/pengaturan` | Publik atau Bearer | Baca settings (publik boleh subset) |
| `PATCH` | `/v1/pengaturan` | Bearer **admin** | Update penuh |

Body `PATCH` (mirror `zPengaturanSitusPublikPatch`): SEO (`siteTitle`, `siteDescription`, `defaultOgImageUrl`, `googleAnalyticsId`), kontak/PPDB, sambutan, sosial, serta field legacy marquee.

### Analytics (CMS)

| Method | Path | Auth | Keterangan |
|--------|------|------|------------|
| `GET` | `/v1/analytics/overview` | Bearer admin\|editor | Opsional — counts ringkas |

Jika endpoint belum ada, teknovo-web mengagregasi dari list berita/artikel/kategori (sample limit 100).

### Auth bridge

CMS mengirim `Authorization: Bearer <Clerk JWT>` (atau session token yang di-verify di api-web). Mapping role: `publicMetadata.role` ∈ `admin|editor|viewer|siswa`.

Label UI: `admin` → Super Admin, `editor` → Admin, `siswa` → Siswa, `viewer` → Viewer.

### Users (invite-only: Super Admin + Admin)

| Method | Path | Auth | Keterangan |
|--------|------|------|------------|
| `GET` | `/v1/users` | Bearer admin\|editor | List Clerk users |
| `POST` | `/v1/users` | Bearer admin\|editor | Create / undang (matrix di bawah) |
| `PATCH` | `/v1/users/:id` | Bearer admin\|editor | Update role / nama |
| `DELETE` | `/v1/users/:id` | Bearer admin\|editor | Hapus (bukan self; bukan Super Admin terakhir) |

Assign matrix: Super Admin → `admin|editor|siswa|viewer`; Admin (`editor`) → `siswa` saja.

Enforcement di teknovo-web (`src/lib/cms-auth.ts` + layout/API):
| Role | Baca dashboard | Berita sekolah | Artikel siswa | Kategori tambah | Media upload | Moderasi approve | Pengaturan |
|------|----------------|----------------|---------------|-----------------|--------------|------------------|------------|
| `viewer` | Ya | Baca | Baca | Tidak | Tidak | Tidak | Tidak |
| `siswa` | Ya (terbatas) | Tidak | CRUD milik sendiri | Ya | Ya | Tidak | Tidak |
| `editor` | Ya | CRUD | CRUD | Ya | Ya | Lihat antrian | Tidak |
| `admin` | Ya | CRUD | CRUD | Ya | Ya | Approve/Tolak | Ya |

### Revalidate callback

Setelah publish / approve, api-web memanggil:

```http
POST https://<teknovo-web>/api/revalidate
Content-Type: application/json

{ "secret": "<REVALIDATE_SECRET>", "tag": "artikel-siswa", "path": "/berita/berita-terbaru" }
```

Untuk berita sekolah tetap `tag: "berita"`, `path: "/berita"`.

## Scaffold homelab (referensi saja)

Struktur masa depan (tidak di-ship di repo ini):

```
services/api-web/
  src/
    routes/v1/berita.ts
    routes/v1/artikel-siswa.ts
    routes/v1/kategori.ts
    routes/v1/pengaturan.ts
    routes/v1/analytics.ts
    middleware/auth.ts
  prisma/
  Dockerfile
```

Implementasi bisa Hono/Fastify di homelab; kontrak di atas yang diikuti `src/lib/api-client.ts`.
