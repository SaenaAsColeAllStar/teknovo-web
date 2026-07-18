# Clerk setup — teknovo-web CMS

## 1. Buat aplikasi Clerk

1. Buka [dashboard.clerk.com](https://dashboard.clerk.com)
2. Create application → aktifkan Email (dan Google opsional)
3. Salin **Publishable key** dan **Secret key**

## 2. Environment

Salin `.env.example` → `.env.local`:

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...   # setelah webhook dibuat

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

Jangan commit `.env.local`. Placeholder `GANTI_*` di `.env.example` sengaja aman.

## 3. Paths & middleware

- `ClerkProvider` di `src/app/layout.tsx`
- `clerkMiddleware` + `auth.protect()` untuk `/dashboard(.*)` di `src/middleware.ts`
  (OpenNext Cloudflare belum mendukung Next.js 16 `proxy.ts` / Node.js middleware — tetap Edge `middleware.ts`.)
- UI: `/sign-in`, `/sign-up` (Clerk `<SignIn />` / `<SignUp />`)
- Sidebar CMS: `<UserButton />`

## 4. Webhook (opsional, sync user)

1. Clerk Dashboard → Webhooks → endpoint:
   `https://<domain>/api/webhook/clerk`
2. Events: `user.created`, `user.updated`, `user.deleted`
3. Salin signing secret → `CLERK_WEBHOOK_SECRET`
4. Route stub: `src/app/api/webhook/clerk/route.ts` — verifikasi Svix masih TODO

## 5. Roles

Simpan role di `user.publicMetadata.role`: `admin` | `editor` | `viewer` | `siswa`.

Helpers:

- `parseCmsRole()` — `src/lib/clerk.ts`
- `getCmsSession()` / `requireCmsWriter()` / `requireCmsArtikelWriter()` / `requireCmsModerator()` — `src/lib/cms-auth.ts`

| Role | Capabilities |
|------|----------------|
| `viewer` (default jika metadata kosong) | Baca daftar/form CMS (bukan siswa) |
| `siswa` | Artikel milik sendiri (DRAFT→REVIEW), tambah kategori, upload media; **bukan** berita sekolah / moderasi / pengaturan |
| `editor` | CRUD berita sekolah + artikel, kategori, media; lihat antrian moderasi (tanpa approve) |
| `admin` | Semua editor + approve/tolak moderasi + `/dashboard/pengaturan` + **`/dashboard/pengguna`** (kelola akun) |

Mapping matrix enterprise: Super Admin → `admin`, Admin staff → `editor`, Siswa → `siswa`.

Tanpa role di Clerk, user dianggap `viewer` (aman-by-default).

### Manajemen pengguna (CMS)

Hanya Super Admin (`publicMetadata.role = "admin"`) dapat mengelola akun lewat CMS `/pengguna` (API `/api/v1/users` di `apps/api`).

- List: Clerk `users.getUserList`
- Create: `users.createUser` (dengan password) atau `invitations.createInvitation` (tanpa password)
- Update: role via `updateUserMetadata` + nama via `updateUser`
- Delete: `users.deleteUser` (self-delete ditolak)

Prasyarat Clerk Dashboard:

1. Email uniqueness (default Clerk)
2. Domain `cms.smkteknovo.sch.id` diizinkan
3. Email invitations aktif jika memakai undangan tanpa password
4. `CLERK_SECRET_KEY` di Worker `apps/api`

### Set role di Clerk Dashboard
1. Users → pilih user → **Metadata** → **Public**
2. JSON:

```json
{ "role": "siswa" }
```

Nilai valid: `admin` | `editor` | `viewer` | `siswa`. Simpan; user login ulang / refresh sesi agar `parseCmsRole` membaca metadata baru.

### Workflow artikel siswa (P2)

**Siswa** (`publicMetadata.role = "siswa"`):

1. Masuk `/dashboard` → nav hanya Ringkasan, Artikel siswa, Kategori, Media (tanpa Berita / Moderasi / Pengaturan).
2. `/dashboard/artikel/baru` — tulis dengan TipTap, simpan **Draft** (`DRAFT`) atau **Kirim ke moderasi** (`REVIEW`).
3. List memakai `GET /v1/artikel-siswa?mine=1` (CRUD milik sendiri saja). Tidak bisa force `PUBLISHED`.

**Admin** (`role = "admin"`):

1. `/dashboard/moderasi` — antrian `status=REVIEW`.
2. **Setujui** → `POST /v1/artikel-siswa/:id/approve` → `PUBLISHED` + revalidate tag `artikel-siswa`.
3. **Tolak** → `POST .../reject` (opsional `reason`) → `ARCHIVED`.

**Editor** dapat melihat antrian moderasi tetapi tidak approve/tolak.

Publik (`/`, `/berita/berita-terbaru`, `/berita/siswa/:slug`) hanya menampilkan artikel `PUBLISHED` via `getPublishedArtikelSiswaCards` / `fetchArtikelSiswaListOrNull({ status: "PUBLISHED" })`. Jika API down, daftar kosong (aman).

## 6. Cloudflare / production

Set secrets di Cloudflare Workers/Pages (Wrangler / dashboard):

- `CLERK_SECRET_KEY`
- `CLERK_WEBHOOK_SECRET`
- `REVALIDATE_SECRET`
- `NEXT_PUBLIC_*` sebagai plain vars (bukan secret)

Pastikan domain production ditambahkan di Clerk → Domains.
