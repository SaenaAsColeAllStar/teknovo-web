-- CreateEnum
CREATE TYPE "PengumumanTipe" AS ENUM ('INFO', 'WARNING', 'URGENT');

-- CreateTable
CREATE TABLE "pengumuman" (
    "id" UUID NOT NULL,
    "judul" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "konten" TEXT NOT NULL DEFAULT '',
    "tipe" "PengumumanTipe" NOT NULL DEFAULT 'INFO',
    "banner_url" TEXT,
    "tanggal_mulai" TIMESTAMP(3),
    "tanggal_akhir" TIMESTAMP(3),
    "is_sticky" BOOLEAN NOT NULL DEFAULT false,
    "layout_config" JSONB NOT NULL DEFAULT '{"showHero":true,"showFeatures":true,"showHours":true,"showStats":false,"layoutTemplate":"default"}',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "status" "SiteContentStatus" NOT NULL DEFAULT 'DRAFT',
    "reviewed_by" TEXT,
    "reviewed_at" TIMESTAMP(3),
    "review_note" TEXT,
    "published_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pengumuman_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pengumuman_slug_key" ON "pengumuman"("slug");

-- CreateIndex
CREATE INDEX "idx_pengumuman_status_sort" ON "pengumuman"("status", "sort_order");

-- CreateIndex
CREATE INDEX "idx_pengumuman_sticky_status" ON "pengumuman"("is_sticky", "status");
