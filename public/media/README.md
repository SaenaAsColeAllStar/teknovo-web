# Media statis — SMK Teknovo

Aset di folder ini disajikan di URL **`/media/...`** (tanpa prefix app). Sumber tunggal di monorepo:

| Lokasi disk | Symlink di app |
|-------------|----------------|
| `public/media/` (root repo) | `apps/web/public` → `../../public` |
| | `apps/admissions/public` → `../../public` |
| | `apps/admin/public` → `../../public` |

**Jangan** membuat salinan di `apps/*/public/media/` — cukup unggah ke `public/media/` di root.

Konstanta TypeScript: `src/lib/public-media-paths.ts` (`LANDING_MEDIA`, `SHARED_MEDIA`).

---

## Struktur folder → URL

```
public/media/
├── shared/                    → /media/shared/
│   └── 404-teknovo.jpg        → Halaman 404 portal (console, ppdb, keuangan, login)
└── landing/                   → /media/landing/
    ├── hero/                  → /media/landing/hero/
    │   ├── welcome.jpg        → Cadangan foto hero (BRAND_HERO_IMAGE_SRC)
    │   └── greeting.png       → PNG transparan (layer hero — rencana UI)
    ├── video/                 → /media/landing/video/
    │   ├── hero-slide-1.mp4   → Hero beranda (bergantian)
    │   ├── hero-slide-2.mp4
    │   └── hero-slide-3.mp4
    ├── fasilitas/             → /media/landing/fasilitas/
    │   ├── absensi-digital.jpg → /fasilitas/absensi-digital
    │   ├── laboratorium.jpg   → Lab komputer, akademik, jurusan, mega menu
    │   ├── perpustakaan.jpg   → /fasilitas/perpustakaan-digital
    │   └── lms.jpg            → /fasilitas/lms-sekolah
    ├── kegiatan/              → /media/landing/kegiatan/  (ekstrakurikuler & OSIS)
    │   ├── ekstra-osis.jpg    → Etalase OSIS beranda
    │   ├── ekstra-pramuka.jpg → Mega menu kesiswaan
    │   ├── ekstra-paskibraka.jpg
    │   ├── ekstra-futsal.jpg
    │   ├── ekstra-pencak-silat.jpg
    │   ├── ekstra-blogger-club.jpg → Hero /berita (placeholder)
    │   └── ekstra-coding-club.jpg
    ├── profil/                → /media/landing/profil/
    │   └── sejarah-sekolah.jpg → /profil/sejarah, mega menu profil
    ├── ppdb/                  → /media/landing/ppdb/
    │   └── hero.jpg           → Hero PPDB (landing + app ppdb port 3001)
    ├── misc/                  → /media/landing/misc/
    │   └── aktivitas-umum.jpg → Visi-misi, program sekolah, fallback ekskul
    └── 404-hero.png           → /media/landing/404-hero.png — 404 khusus landing
```

**Brand** (bukan di bawah `media/`): lihat `public/brand/README.md` → `/brand/logo.png`, `/brand/kepala-sekolah.png`.

**Unggahan pengguna** (jangan hapus): `public/uploads/profil/`, `public/uploads/elearning/`, dll. — di `.gitignore`.

---

## Halaman → berkas placeholder

| Area situs | Rute contoh | Berkas yang dipakai (ganti in-place, nama sama) |
|------------|-------------|--------------------------------------------------|
| Beranda | `/` | `video/hero-slide-*.mp4`, `kegiatan/ekstra-osis.jpg` |
| Profil | `/profil/sejarah` | `profil/sejarah-sekolah.jpg` |
| Profil | `/profil/visi-misi`, `/profil/program-sekolah` | `misc/aktivitas-umum.jpg` |
| Akademik | `/akademik`, `/akademik/jurusan` | `fasilitas/laboratorium.jpg` (TM), `misc/aktivitas-umum.jpg` (ULW), `lms.jpg`, `perpustakaan.jpg` |
| Fasilitas | `/fasilitas`, `/fasilitas/*` | `fasilitas/*.jpg` per slug |
| Kesiswaan | `/kesiswaan/ekstrakurikuler` | `kegiatan/ekstra-*.jpg` |
| Berita | `/berita` | `kegiatan/ekstra-blogger-club.jpg` (hero); artikel DB pakai URL sendiri |
| PPDB | `/ppdb` (app terpisah) | `ppdb/hero.jpg` |
| 404 landing | semua rute tidak ada | `404-hero.png` |
| 404 portal | login, console, dll. | `shared/404-teknovo.jpg` |

Berita kegiatan admin & prestasi mock masih memakai URL Unsplash di kode — ganti ke `/media/...` saat aset siap.

---

## Cara mengganti mock → foto asli

1. Siapkan berkas dengan **nama file persis** seperti di tabel (mis. `laboratorium.jpg`).
2. Salin ke folder disk yang sesuai di `public/media/landing/...`.
3. Format disarankan: foto **JPG** (hero/fasilitas), **PNG** transparan (`hero/greeting.png`, `404-hero.png`), video **MP4** H.264.
4. Tidak perlu ubah `public-media-paths.ts` jika URL tidak berubah.
5. Deploy / restart tidak wajib untuk file statis; kosongkan cache CDN/browser bila perlu.

Jika **mengganti nama file** atau path URL, update `src/lib/public-media-paths.ts` dan komponen yang merujuk langsung.

---

## App mana yang melayani URL?

| URL prefix | PM2 / app | Port dev |
|------------|-----------|----------|
| `/`, `/profil`, `/fasilitas`, … | `teknovo-web` | 3000 |
| `/ppdb` (rewrite ke app ppdb) | `teknovo-admissions` | 3001 |
| `/guru`, `/siswa`, login | `teknovo-admin` | 3002 |

Semua app di atas memakai **folder `public/` yang sama**; path `/media/...` identik di setiap origin yang mem-proxy ke app tersebut.
