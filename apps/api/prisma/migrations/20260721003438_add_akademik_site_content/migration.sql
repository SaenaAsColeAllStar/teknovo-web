-- CreateEnum
CREATE TYPE "ProgramSekolahKategori" AS ENUM ('AKADEMIK', 'NON_AKADEMIK', 'KEAGAMAAN');

-- CreateTable
CREATE TABLE "kurikulum" (
    "id" UUID NOT NULL,
    "judul" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "deskripsi" TEXT NOT NULL DEFAULT '',
    "cover_url" TEXT,
    "dokumen_url" TEXT,
    "tahun_ajaran" TEXT NOT NULL,
    "jurusan" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "struktur_kurikulum" JSONB,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "show_in_nav" BOOLEAN NOT NULL DEFAULT true,
    "status" "SiteContentStatus" NOT NULL DEFAULT 'DRAFT',
    "published_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kurikulum_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "program_sekolah" (
    "id" UUID NOT NULL,
    "judul" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "deskripsi" TEXT NOT NULL DEFAULT '',
    "cover_url" TEXT,
    "ikon" TEXT,
    "kategori" "ProgramSekolahKategori" NOT NULL,
    "highlight_items" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "show_in_nav" BOOLEAN NOT NULL DEFAULT true,
    "status" "SiteContentStatus" NOT NULL DEFAULT 'DRAFT',
    "published_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "program_sekolah_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "program_jurusan" (
    "id" UUID NOT NULL,
    "nama" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "singkatan" TEXT NOT NULL,
    "deskripsi" TEXT NOT NULL DEFAULT '',
    "cover_url" TEXT,
    "ikon" TEXT,
    "prospek_kerja" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "kompetensi_dasar" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "fasilitas" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "jumlah_siswa" INTEGER,
    "link_pendaftaran" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "show_in_nav" BOOLEAN NOT NULL DEFAULT true,
    "status" "SiteContentStatus" NOT NULL DEFAULT 'DRAFT',
    "published_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "program_jurusan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenaga_pengajar" (
    "id" UUID NOT NULL,
    "nama" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "nip" TEXT,
    "foto_url" TEXT,
    "jabatan" TEXT NOT NULL,
    "bidang_keahlian" TEXT,
    "mata_pelajaran" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "pendidikan" TEXT,
    "pengalaman" TEXT,
    "kontak_email" TEXT,
    "media_sosial" JSONB,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "show_in_nav" BOOLEAN NOT NULL DEFAULT true,
    "status" "SiteContentStatus" NOT NULL DEFAULT 'DRAFT',
    "published_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tenaga_pengajar_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "kurikulum_slug_key" ON "kurikulum"("slug");

-- CreateIndex
CREATE INDEX "idx_kurikulum_status_sort" ON "kurikulum"("status", "sort_order");

-- CreateIndex
CREATE UNIQUE INDEX "program_sekolah_slug_key" ON "program_sekolah"("slug");

-- CreateIndex
CREATE INDEX "idx_program_sekolah_status_sort" ON "program_sekolah"("status", "sort_order");

-- CreateIndex
CREATE UNIQUE INDEX "program_jurusan_slug_key" ON "program_jurusan"("slug");

-- CreateIndex
CREATE INDEX "idx_program_jurusan_status_sort" ON "program_jurusan"("status", "sort_order");

-- CreateIndex
CREATE UNIQUE INDEX "tenaga_pengajar_slug_key" ON "tenaga_pengajar"("slug");

-- CreateIndex
CREATE INDEX "idx_tenaga_pengajar_status_sort" ON "tenaga_pengajar"("status", "sort_order");
