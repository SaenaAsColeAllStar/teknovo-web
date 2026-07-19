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

## 4. Webhook Clerk (Svix)

Endpoint produksi: `https://cf.smkteknovo.sch.id/api/webhook/clerk`

1. Clerk Dashboard → Webhooks → Add endpoint (URL di atas)
2. Events: `user.created`, `user.updated`, `user.deleted` (sesuai kebutuhan)
3. Salin **Signing Secret** → `wrangler secret put CLERK_WEBHOOK_SECRET` (`whsec_…`)
4. Worker memverifikasi header `svix-id` / `svix-timestamp` / `svix-signature` (HMAC). Request tanpa signature valid → **401**.
5. Handler saat ini **ack-only** (tidak mengubah D1/Clerk) — aman untuk mengaktifkan verifikasi sebelum sync user diimplementasikan.

Legacy stub Next: `src/app/api/webhook/clerk/route.ts` (monolit; bukan jalur Free split).

## 5. Roles

Simpan role di `user.publicMetadata.role`: `admin` | `editor` | `viewer` | `siswa`.

Helpers:

- `parseCmsRole()` — `src/lib/clerk.ts`
- `getCmsSession()` / `requireCmsWriter()` / `requireCmsArtikelWriter()` / `requireCmsModerator()` — `src/lib/cms-auth.ts`

| Role | Capabilities |
|------|----------------|
| `viewer` (default jika metadata kosong) | Baca daftar/form CMS (bukan siswa) |
| `siswa` | Artikel milik sendiri (DRAFT→REVIEW), tambah kategori, upload media; **bukan** berita sekolah / moderasi / pengaturan |
| `editor` | CRUD berita sekolah + artikel (edit/moderasi body), kategori, media; lihat antrian; **tidak** approve/publish artikel siswa (status dipaksa `REVIEW`) |
| `admin` | Semua editor + approve/tolak moderasi + publish artikel + `/pengaturan` + **`/pengguna`** (kelola akun; assign role penuh) |

Mapping matrix enterprise: Super Admin → `admin`, Admin staff → `editor`, Siswa → `siswa`.

Tanpa role di Clerk, user dianggap `viewer` (aman-by-default).

### Manajemen pengguna (CMS)

Super Admin (`admin`) dan Admin (`editor`) dapat mengelola akun lewat CMS `/pengguna`
(API `/api/v1/users` di `apps/api`), dengan matriks undangan:

| Actor | Dapat mengundang / assign |
|-------|---------------------------|
| Super Admin (`admin`) | Super Admin, Admin (`editor`), Siswa, Viewer |
| Admin (`editor`) | Siswa saja |

- List: Clerk `users.getUserList`
- Create: `users.createUser` (dengan password + username turunan email) atau
  `invitations.createInvitation` (tanpa password)
- Update: role via `updateUserMetadata` + nama via `updateUser`
- Delete: `users.deleteUser` (self-delete ditolak; Super Admin terakhir tidak dapat diturunkan/dihapus)

#### Username & password saat create

Jika Clerk Dashboard mewajibkan **Username**, API menurunkan handle dari local-part email
(`budi.sari@sekolah.id` → `budi_sari`, min 4 karakter, huruf kecil + underscore). Ini
bukan field terpisah di form CMS.

Error **password breached** (`form_password_pwned`) mengacu pada password **login user baru**,
bukan password D1/database atau `CLERK_SECRET_KEY`. Solusi: password unik yang lebih kuat,
atau kosongkan password di form agar undangan email dikirim. Jangan matikan breach protection.

Prasyarat Clerk Dashboard:

1. Email uniqueness (default Clerk)
2. Username: enabled (required/optional) — atau disabled; API menyesuaikan
3. Password breach detection: biarkan ON
4. Domain `cms.smkteknovo.sch.id` diizinkan
5. Email invitations aktif jika memakai undangan tanpa password
6. `CLERK_SECRET_KEY` di Worker `apps/api`

#### Bootstrap Super Admin

```bash
node --env-file=.env.local scripts/bootstrap-super-admin.mjs diegocole234@gmail.com
```

Membutuhkan `CLERK_SECRET_KEY` di `.env.local`. Jika user sudah ada → set
`publicMetadata.role = "admin"`; jika belum → undangan Clerk dengan role `admin`.

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
