-- CreateTable
CREATE TABLE "kontak" (
    "id" UUID NOT NULL,
    "label" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "alamat_lengkap" TEXT NOT NULL,
    "telepon" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "email" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "whatsapp" TEXT,
    "google_maps_url" TEXT,
    "google_maps_embed" TEXT,
    "jam_operasional" JSONB,
    "media_sosial" JSONB,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "show_in_nav" BOOLEAN NOT NULL DEFAULT true,
    "status" "SiteContentStatus" NOT NULL DEFAULT 'PUBLISHED',
    "published_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kontak_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "kontak_slug_key" ON "kontak"("slug");

-- CreateIndex
CREATE INDEX "idx_kontak_status_sort" ON "kontak"("status", "sort_order");

-- Best-effort seed: one PUBLISHED kampus pusat from public kontak / pengaturan defaults
INSERT INTO "kontak" (
    "id",
    "label",
    "slug",
    "alamat_lengkap",
    "telepon",
    "email",
    "whatsapp",
    "google_maps_url",
    "google_maps_embed",
    "jam_operasional",
    "media_sosial",
    "sort_order",
    "show_in_nav",
    "status",
    "published_at",
    "created_at",
    "updated_at"
)
SELECT
    'a0000000-0000-4000-a000-0000000000c1'::uuid,
    'Kantor Pusat',
    'kantor-pusat',
    'Jl. Rancasari RT 05 RW 03, Rancasari, Pamanukan, Kabupaten Subang, Jawa Barat 41254',
    ARRAY[]::TEXT[],
    ARRAY['info@smateknovo.sch.id']::TEXT[],
    '0898-8131-858',
    'https://www.google.com/maps?q=-6.3044,107.816',
    'https://www.google.com/maps?q=-6.3044,107.816&output=embed&hl=id&z=17',
    '[{"hari":"Senin–Jumat","buka":"08.00","tutup":"15.00"}]'::jsonb,
    '{"instagram":"https://www.instagram.com/smateknovo/"}'::jsonb,
    0,
    true,
    'PUBLISHED',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM "kontak" LIMIT 1);
