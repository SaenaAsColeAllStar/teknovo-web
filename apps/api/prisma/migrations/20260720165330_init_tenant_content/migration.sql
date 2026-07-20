-- CreateEnum
CREATE TYPE "BeritaStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ArtikelStatus" AS ENUM ('DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "SiteContentStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "EkskulKategori" AS ENUM ('TEKNOLOGI', 'OLAHRAGA', 'AKADEMIK', 'SENI');

-- CreateTable
CREATE TABLE "kategori" (
    "id" UUID NOT NULL,
    "nama" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "deskripsi" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kategori_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "berita" (
    "id" UUID NOT NULL,
    "judul" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "ringkasan" TEXT,
    "konten" TEXT NOT NULL DEFAULT '',
    "cover_url" TEXT,
    "status" "BeritaStatus" NOT NULL DEFAULT 'DRAFT',
    "kategori_id" UUID,
    "meta_title" TEXT,
    "meta_description" TEXT,
    "og_image_url" TEXT,
    "canonical_url" TEXT,
    "meta_keywords" TEXT,
    "penulis_id" TEXT,
    "penulis_nama" TEXT,
    "published_at" TIMESTAMP(3),
    "sort_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "berita_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "artikel_siswa" (
    "id" UUID NOT NULL,
    "judul" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "ringkasan" TEXT,
    "konten" TEXT NOT NULL DEFAULT '',
    "cover_url" TEXT,
    "status" "ArtikelStatus" NOT NULL DEFAULT 'DRAFT',
    "kategori_id" UUID,
    "penulis_id" TEXT NOT NULL,
    "penulis_nama" TEXT,
    "penulis_kelas" TEXT,
    "rejected_reason" TEXT,
    "submitted_at" TIMESTAMP(3),
    "published_at" TIMESTAMP(3),
    "meta_title" TEXT,
    "meta_description" TEXT,
    "og_image_url" TEXT,
    "canonical_url" TEXT,
    "meta_keywords" TEXT,
    "sort_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "artikel_siswa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fasilitas" (
    "id" UUID NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "nav_label" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "cover_url" TEXT,
    "highlights_json" JSONB NOT NULL DEFAULT '[]',
    "paragraphs_json" JSONB NOT NULL DEFAULT '[]',
    "extras_json" JSONB NOT NULL DEFAULT '{}',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "show_in_nav" BOOLEAN NOT NULL DEFAULT true,
    "status" "SiteContentStatus" NOT NULL DEFAULT 'DRAFT',
    "published_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fasilitas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ekstrakurikuler" (
    "id" UUID NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "detail" TEXT NOT NULL DEFAULT '',
    "full_description" TEXT NOT NULL DEFAULT '',
    "kategori" "EkskulKategori" NOT NULL,
    "preview_url" TEXT,
    "related_achievements_json" JSONB NOT NULL DEFAULT '[]',
    "jadwal_ringkas" TEXT,
    "lokasi_latihan" TEXT,
    "pembina_nama" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "status" "SiteContentStatus" NOT NULL DEFAULT 'DRAFT',
    "published_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ekstrakurikuler_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prestasi" (
    "id" UUID NOT NULL,
    "judul" TEXT NOT NULL,
    "penyelenggara" TEXT NOT NULL DEFAULT '',
    "tanggal_iso" DATE NOT NULL,
    "siswa_label" TEXT NOT NULL DEFAULT '',
    "ringkasan" TEXT NOT NULL DEFAULT '',
    "file_url" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "status" "SiteContentStatus" NOT NULL DEFAULT 'DRAFT',
    "published_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "prestasi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "site_media" (
    "media_key" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'landing',
    "url" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by" TEXT,

    CONSTRAINT "site_media_pkey" PRIMARY KEY ("media_key")
);

-- CreateTable
CREATE TABLE "pengaturan" (
    "id" UUID NOT NULL,
    "payload" JSONB NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pengaturan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "kategori_slug_key" ON "kategori"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "berita_slug_key" ON "berita"("slug");

-- CreateIndex
CREATE INDEX "idx_berita_status_sort_at" ON "berita"("status", "sort_at" DESC);

-- CreateIndex
CREATE INDEX "idx_berita_kategori_id" ON "berita"("kategori_id");

-- CreateIndex
CREATE UNIQUE INDEX "artikel_siswa_slug_key" ON "artikel_siswa"("slug");

-- CreateIndex
CREATE INDEX "idx_artikel_status_sort_at" ON "artikel_siswa"("status", "sort_at" DESC);

-- CreateIndex
CREATE INDEX "idx_artikel_penulis_status" ON "artikel_siswa"("penulis_id", "status");

-- CreateIndex
CREATE INDEX "idx_artikel_kategori_id" ON "artikel_siswa"("kategori_id");

-- CreateIndex
CREATE UNIQUE INDEX "fasilitas_slug_key" ON "fasilitas"("slug");

-- CreateIndex
CREATE INDEX "idx_fasilitas_status_sort" ON "fasilitas"("status", "sort_order");

-- CreateIndex
CREATE UNIQUE INDEX "ekstrakurikuler_slug_key" ON "ekstrakurikuler"("slug");

-- CreateIndex
CREATE INDEX "idx_ekstrakurikuler_status_sort" ON "ekstrakurikuler"("status", "sort_order");

-- CreateIndex
CREATE INDEX "idx_prestasi_status_sort_tanggal" ON "prestasi"("status", "sort_order", "tanggal_iso" DESC);

-- CreateIndex
CREATE INDEX "idx_site_media_category" ON "site_media"("category");

-- AddForeignKey
ALTER TABLE "berita" ADD CONSTRAINT "berita_kategori_id_fkey" FOREIGN KEY ("kategori_id") REFERENCES "kategori"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "artikel_siswa" ADD CONSTRAINT "artikel_siswa_kategori_id_fkey" FOREIGN KEY ("kategori_id") REFERENCES "kategori"("id") ON DELETE SET NULL ON UPDATE CASCADE;
