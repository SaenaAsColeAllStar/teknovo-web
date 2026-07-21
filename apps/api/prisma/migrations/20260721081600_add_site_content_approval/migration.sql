-- AlterEnum
ALTER TYPE "SiteContentStatus" ADD VALUE 'PENDING_REVIEW';
ALTER TYPE "SiteContentStatus" ADD VALUE 'REJECTED';

-- AlterTable fasilitas
ALTER TABLE "fasilitas" ADD COLUMN "reviewed_by" TEXT,
ADD COLUMN "reviewed_at" TIMESTAMP(3),
ADD COLUMN "review_note" TEXT;

-- AlterTable ekstrakurikuler
ALTER TABLE "ekstrakurikuler" ADD COLUMN "reviewed_by" TEXT,
ADD COLUMN "reviewed_at" TIMESTAMP(3),
ADD COLUMN "review_note" TEXT;

-- AlterTable prestasi
ALTER TABLE "prestasi" ADD COLUMN "reviewed_by" TEXT,
ADD COLUMN "reviewed_at" TIMESTAMP(3),
ADD COLUMN "review_note" TEXT;

-- AlterTable kurikulum
ALTER TABLE "kurikulum" ADD COLUMN "reviewed_by" TEXT,
ADD COLUMN "reviewed_at" TIMESTAMP(3),
ADD COLUMN "review_note" TEXT;

-- AlterTable program_sekolah
ALTER TABLE "program_sekolah" ADD COLUMN "reviewed_by" TEXT,
ADD COLUMN "reviewed_at" TIMESTAMP(3),
ADD COLUMN "review_note" TEXT;

-- AlterTable program_jurusan
ALTER TABLE "program_jurusan" ADD COLUMN "reviewed_by" TEXT,
ADD COLUMN "reviewed_at" TIMESTAMP(3),
ADD COLUMN "review_note" TEXT;

-- AlterTable tenaga_pengajar
ALTER TABLE "tenaga_pengajar" ADD COLUMN "reviewed_by" TEXT,
ADD COLUMN "reviewed_at" TIMESTAMP(3),
ADD COLUMN "review_note" TEXT;

-- AlterTable kontak
ALTER TABLE "kontak" ADD COLUMN "reviewed_by" TEXT,
ADD COLUMN "reviewed_at" TIMESTAMP(3),
ADD COLUMN "review_note" TEXT;
