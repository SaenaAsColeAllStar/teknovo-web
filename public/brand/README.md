# Brand & media assets

Aset gambar/video situs disimpan di **Cloudflare R2** (bucket `teknovo`).

- Public CDN: `https://r2.ctos.web.id`
- Object keys (contoh):
  - `brand/logo.webp`, `brand/kepala-sekolah.webp`
  - `media/landing/hero/bg-01.webp`, `media/landing/hero/slide-01.mp4`, `media/landing/hero/slide-thumb-01.webp`
  - `media/landing/navbar/profil.webp`
  - `media/landing/fasilitas/*.webp`, `media/landing/kegiatan/*.webp`, …
- Kode: `publicAssetUrl()` di `src/lib/r2.ts`, konstanta di `src/vendor/file-storage/paths.ts`

Favicon lokal tetap di `src/app/icon.png` dan `src/app/apple-icon.png` (konvensi Next.js).
