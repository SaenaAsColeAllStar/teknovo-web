#!/usr/bin/env bash
# Migrate known public landing/brand assets from old R2 CDN → current-account bucket.
# Source: public HTTPS (r2.ctos.web.id). Destination: wrangler R2 --remote.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

SRC_BASE="${R2_MIGRATE_SRC:-https://r2.ctos.web.id}"
BUCKET="${R2_MIGRATE_BUCKET:-teknovo}"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

KEYS=(
  brand/logo.webp
  brand/kepala-sekolah.webp
  brand/404-teknovo.webp
  media/shared/404-teknovo.webp
  media/landing/404-hero.webp
  media/landing/hero/bg-01.webp
  media/landing/hero/bg-02.webp
  media/landing/hero/bg-03.webp
  media/landing/hero/greeting.webp
  media/landing/hero/slide-thumb-01.webp
  media/landing/hero/slide-thumb-02.webp
  media/landing/hero/slide-thumb-03.webp
  media/landing/hero/slide-01.mp4
  media/landing/hero/slide-02.mp4
  media/landing/hero/slide-03.mp4
  media/landing/fasilitas/absensi-digital.webp
  media/landing/fasilitas/laboratorium.webp
  media/landing/fasilitas/perpustakaan.webp
  media/landing/fasilitas/lms.webp
  media/landing/kegiatan/ekstra-osis.webp
  media/landing/kegiatan/ekstra-pramuka.webp
  media/landing/kegiatan/ekstra-paskibraka.webp
  media/landing/kegiatan/ekstra-futsal.webp
  media/landing/kegiatan/ekstra-pencak-silat.webp
  media/landing/kegiatan/ekstra-blogger-club.webp
  media/landing/kegiatan/ekstra-coding-club.webp
  media/landing/profil/sejarah-sekolah.webp
  media/landing/ppdb/hero.webp
  media/landing/misc/aktivitas-umum.webp
  media/landing/berita/cover-ppdb-2026.webp
  media/landing/berita/cover-lab-komputer.webp
  media/landing/berita/cover-lms-online.webp
  media/landing/berita/cover-cbt-online.webp
  media/landing/berita/cover-akreditasi-a.webp
  media/landing/berita/cover-jurusan-tm.webp
  media/landing/berita/cover-jurusan-ulw.webp
  media/landing/berita/cover-profil-smk-teknovo.webp
  media/landing/berita/cover-memilih-smk-vokasi.webp
  media/landing/berita/cover-tm-prospek-kerja.webp
  media/landing/berita/cover-ulw-pariwisata.webp
  media/landing/berita/cover-pkl-industri.webp
  media/landing/berita/cover-lms-hybrid.webp
  media/landing/berita/cover-cbt-terintegrasi.webp
  media/landing/berita/cover-lab-bengkel.webp
  media/landing/berita/cover-ekstrakurikuler.webp
  media/landing/berita/cover-ppdb-panduan.webp
  media/landing/berita/cover-akreditasi-calon-siswa.webp
  media/landing/berita/cover-visi-teknovo.webp
  media/landing/akademik/jurusan-teknik-mesin.webp
  media/landing/akademik/jurusan-ulw.webp
  media/landing/akademik/pkl-kompetensi-industri.webp
  media/landing/navbar/profil.webp
  media/landing/navbar/akademik.webp
  media/landing/navbar/kesiswaan.webp
  media/landing/navbar/fasilitas.webp
  media/landing/navbar/berita.webp
)

mime_for() {
  case "$1" in
    *.webp) echo "image/webp" ;;
    *.mp4) echo "video/mp4" ;;
    *.png) echo "image/png" ;;
    *.jpg|*.jpeg) echo "image/jpeg" ;;
    *.svg) echo "image/svg+xml" ;;
    *.gif) echo "image/gif" ;;
    *.pdf) echo "application/pdf" ;;
    *) echo "application/octet-stream" ;;
  esac
}

ok=0
fail=0
skip=0

for key in "${KEYS[@]}"; do
  out="$TMP/object"
  url="$SRC_BASE/$key"
  echo "→ $key"
  if ! curl -fsSL --retry 2 --retry-delay 1 "$url" -o "$out"; then
    echo "  SKIP (download failed): $url"
    skip=$((skip + 1))
    continue
  fi
  ct="$(mime_for "$key")"
  if pnpm exec wrangler r2 object put "$BUCKET/$key" \
    --file="$out" \
    --content-type="$ct" \
    --remote \
    --force >/dev/null; then
    ok=$((ok + 1))
  else
    echo "  FAIL upload: $key"
    fail=$((fail + 1))
  fi
done

echo
echo "Done. uploaded=$ok skipped=$skip failed=$fail bucket=$BUCKET"
echo "Next: attach custom domain to this bucket (or keep R2_PUBLIC_URL on old CDN until DNS cutover)."
