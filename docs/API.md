# API Contract — teknovo-web ↔ api-web (homelab)

Base URL: `API_URL` / `NEXT_PUBLIC_API_URL` (tanpa trailing slash).

## Env (teknovo-web)

| Variable | Required | Keterangan |
|----------|----------|------------|
| `API_URL` | Ya (server) | Base URL api-web, mis. `http://127.0.0.1:4010` |
| `NEXT_PUBLIC_API_URL` | Ya (CMS browser) | Sama dengan `API_URL` agar form dashboard memanggil API dari klien |
| `REVALIDATE_SECRET` | Ya (callback) | Shared secret untuk `POST /api/revalidate` dari api-web |
| Clerk keys | Ya (CMS) | `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY` |

Tanpa `API_URL` / `NEXT_PUBLIC_API_URL`, dashboard menampilkan error state yang jelas; halaman publik berita kegiatan memakai konten fallback lokal.

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
  "coverUrl": "https://...?"
}
```

### Kategori

| Method | Path | Auth |
|--------|------|------|
| `GET` | `/v1/kategori` | Publik |
| `POST` | `/v1/kategori` | Bearer |
| `PATCH` | `/v1/kategori/:id` | Bearer |
| `DELETE` | `/v1/kategori/:id` | Bearer |

### Auth bridge

CMS mengirim `Authorization: Bearer <Clerk JWT>` (atau session token yang di-verify di api-web). Mapping role: `publicMetadata.role` ∈ `admin|editor|viewer`.

### Revalidate callback

Setelah publish, api-web memanggil:

```http
POST https://<teknovo-web>/api/revalidate
Content-Type: application/json

{ "secret": "<REVALIDATE_SECRET>", "tag": "berita", "path": "/berita" }
```

## Scaffold homelab (referensi saja)

Struktur masa depan (tidak di-ship di repo ini):

```
services/api-web/
  src/
    routes/v1/berita.ts
    routes/v1/kategori.ts
    middleware/auth.ts
  prisma/
  Dockerfile
```

Implementasi bisa Hono/Fastify di homelab; kontrak di atas yang diikuti `src/lib/api-client.ts`.
