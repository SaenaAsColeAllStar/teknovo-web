PRD: Full Site Content Management + Approval Workflow

Saya akan breakdown per entity dan berikan roadmap implementasinya.
Arsitektur Konseptual

EDITOR (Admin/Editor)
  │
  ├──(1) Buat/Ubah konten → Status: DRAFT atau PENDING_REVIEW
  │
  ▼
  └──(2) Submit untuk review → Status: PENDING_REVIEW
        │
        ▼
   SUPER ADMIN
        │
        ├── Approve → Status: PUBLISHED → Tampil di web
        │
        └── Reject → Status: DRAFT (dengan catatan revisi)

Schema Addition — approval field

Tambahkan kolom reviewedBy dan reviewedAt di setiap entity:
prisma

// Di schema.prisma — tambahkan field ini di setiap model site-content
model Fasilitas {
  // ... existing fields ...
  status         SiteContentStatus @default(DRAFT)
  reviewedBy     String?           // Clerk user ID super admin
  reviewedAt     DateTime?
  reviewNote     String?           // Catatan super admin jika reject
  publishedAt    DateTime?
}

TAPI — ini akan membutuhkan perubahan di banyak file. Saran saya: buat sistem yang reusable.
Pendekatan Implementasi yang Efisien

Karena Anda solo developer, jangan buat approval workflow kompleks dulu untuk semua 8 entity. Gunakan pendekatan bertahap:
Tahap 1: Entity + CMS CRUD (Prioritas Tertinggi)

Buat entity yang belum ada di Prisma schema API, route, dan CMS page:
Entity	Tindakan	Estimasi
Kurikulum	Buat schema + route + CMS CRUD	1 hari
Program Sekolah	Buat schema + route + CMS CRUD	1 hari
Program Jurusan	Buat schema + route + CMS CRUD	1.5 hari
Tenaga Pengajar	Buat schema + route + CMS CRUD	1 hari
Kontak Lengkap	Upgrade dari PengaturanSitusPublik ke dedicated entity	0.5 hari
Tahap 2: Approval Workflow Sederhana (Minggu ke-2)

Jangan bikin workflow engine kompleks. Cukup:

    Tambahkan field reviewStatus enum: DRAFT | PENDING_REVIEW | PUBLISHED | REJECTED
    API endpoint: POST /api/v1/:entity/:id/submit — ubah ke PENDING_REVIEW
    API endpoint: POST /api/v1/:entity/:id/approve (super admin only) — ubah ke PUBLISHED
    API endpoint: POST /api/v1/:entity/:id/reject (super admin only) — ubah ke REJECTED + catatan
    CMS: tambahkan tab "Menunggu Review" di dashboard super admin

Tahap 3: Layout Management (Minggu ke-3)

Yang dimaksud "mengubah layout" = bisa mengatur:

    Urutan tampil (sortOrder — sudah ada ✅)
    Visibilitas di navigasi (showInNav — sudah ada ✅)
    Hero image / cover per halaman (coverUrl — sudah ada ✅)
    Section visibility (tambah field sections: Json untuk enable/disable komponen page)

Contoh untuk layout halaman Fasilitas:
prisma

model Fasilitas {
  // ... existing ...
  layoutConfig Json @default("{
    \"showHero\": true,
    \"showFeatures\": true,
    \"showHours\": true,
    \"showStats\": false,
    \"layoutTemplate\": \"default\"
  }")
}

Detail Implementasi Per Entity
1. Kurikulum
prisma

model Kurikulum {
  id              String   @id @default(uuid())
  judul           String   // "Kurikulum Merdeka"
  slug            String   @unique
  deskripsi       String   @db.Text
  coverUrl        String?
  dokumenUrl      String?  // Link ke file PDF kurikulum
  tahunAjaran     String
  jurusan         String[] // Jurusan yang menggunakan kurikulum ini
  strukturKurikulum Json?  // Array of subjects or learning outcomes
  sortOrder       Int      @default(0)
  status          SiteContentStatus @default(DRAFT)
  publishedAt     DateTime?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

2. Program Sekolah

Ini mungkin sama dengan Fasilitas yang sudah ada. Konfirmasi: apakah "Program Sekolah" berbeda dengan "Fasilitas"?

Jika berbeda:
prisma

model ProgramSekolah {
  id             String   @id @default(uuid())
  judul          String   // "Unggulan", "Tahfidz", dll
  slug           String   @unique
  deskripsi      String   @db.Text
  coverUrl       String?
  ikon           String?  // Icon class atau SVG URL
  kategori       String   // "akademik" | "non-akademik" | "keagamaan"
  highlightItems String[] // Poin-poin unggulan
  sortOrder      Int      @default(0)
  status         SiteContentStatus @default(DRAFT)
  publishedAt    DateTime?
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
}

3. Program Jurusan
prisma

model ProgramJurusan {
  id              String   @id @default(uuid())
  nama            String   // "Teknik Komputer dan Jaringan"
  slug            String   @unique
  singkatan       String   // "TKJ"
  deskripsi       String   @db.Text
  coverUrl        String?
  ikon            String?
  prospekKerja    String[] // Prospek karir lulusan
  kompetensiDasar String[] // Kompetensi yang diajarkan
  fasilitas       String[] // Fasilitas penunjang jurusan
  jumlahSiswa     Int?
  linkPendaftaran String?  // Link PPDB khusus jurusan
  sortOrder       Int      @default(0)
  status          SiteContentStatus @default(DRAFT)
  publishedAt     DateTime?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

4. Tenaga Pengajar
prisma

model TenagaPengajar {
  id              String   @id @default(uuid())
  nama            String
  slug            String   @unique
  nip             String?  // NIP/NUPTK
  fotoUrl         String?
  jabatan         String   // "Kepala Sekolah", "Guru TKJ", dll
  bidangKeahlian  String?
  mataPelajaran   String[]
  pendidikan      String?  // "S2 Pendidikan"
  pengalaman      String?  @db.Text
  kontakEmail     String?
  mediaSosial     Json?    // {instagram, linkedin, dll}
  sortOrder       Int      @default(0)
  status          SiteContentStatus @default(DRAFT)
  publishedAt     DateTime?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

5. Kontak Lengkap

Upgrade dari PengaturanSitusPublik yang sudah ada menjadi dedicated model:
prisma

model Kontak {
  id              String   @id @default(uuid())
  label           String   // "Kantor Pusat", "Kampus 2", dll
  alamatLengkap   String   @db.Text
  telepon         String[]
  email           String[]
  whatsapp        String?
  googleMapsUrl   String?
  googleMapsEmbed String?  // iframe embed
  jamOperasional  Json?    // [{hari, buka, tutup}]
  mediaSosial     Json?    // {instagram, youtube, facebook, tiktok}
  sortOrder       Int      @default(0)
  status          SiteContentStatus @default(PUBLISHED)
}

Approval Workflow — Implementasi Praktis
API Pattern

Buat generic approval controller yang bisa dipakai semua entity:
typescript

// /api/v1/:entity/:id/submit — editor submit untuk review
// /api/v1/:entity/:id/approve — super admin approve
// /api/v1/:entity/:id/reject — super admin reject

// Generic handler
async function handleSubmit(req, res) {
  const { entity, id } = req.params;
  const prisma = req.prisma;
  
  const model = getPrismaModel(prisma, entity);
  await model.update({
    where: { id },
    data: { status: "PENDING_REVIEW", updatedAt: new Date() }
  });
  
  res.json({ ok: true });
}

async function handleApprove(req, res) {
  const { entity, id } = req.params;
  const superAdminId = req.auth.userId;
  
  await prisma[entity].update({
    where: { id },
    data: {
      status: "PUBLISHED",
      reviewedBy: superAdminId,
      reviewedAt: new Date(),
      publishedAt: new Date(),
    }
  });
  
  res.json({ ok: true });
}

CMS UI

Di dashboard Super Admin, tambahkan halaman "Moderasi Konten" yang mengagregasi semua PENDING_REVIEW dari semua entity:
typescript

// CMS — ModerasiPage.tsx (sudah ada, tinggal upgrade)
// Tampilkan list semua konten yang PENDING_REVIEW
// Dari entity: fasilitas, ekstrakurikuler, prestasi, kurikulum,
//             program-sekolah, program-jurusan, tenaga-pengajar, kontak

Strategi Implementasi (Solo Developer)
Timeline Realistis
Phase	Scope	Durasi
Phase 1	Schema Prisma untuk: Kurikulum, ProgramSekolah, ProgramJurusan, TenagaPengajar + migrasi	2 hari
Phase 2	Express routes + data layer untuk 4 entity baru	2 hari
Phase 3	CMS pages (list + form) untuk 4 entity baru (copy pattern dari SiteContentPages)	2 hari
Phase 4	Upgrade Kontak dari singleton ke dedicated model	1 hari
Phase 5	Approval workflow: API + CMS moderasi + super admin validation	2 hari
Phase 6	Layout management: field layoutConfig di setiap entity + CMS UI	2 hari
Total		11 hari
Rekomendasi Prioritas

Karena Anda solo developer, jangan lakukan semua sekaligus. Saran saya:

    Prioritas 1 (Sekarang): Kurikulum + Tenaga Pengajar — paling sering diakses calon siswa/orang tua
    Prioritas 2 (Minggu Depan): Program Jurusan — core selling point sekolah
    Prioritas 3: Approval workflow — sederhana saja, jangan over-engineer
    Prioritas 4: Layout management — setelah semua konten bisa di-CRUD
    Prioritas 5: Program Sekolah + Kontak upgrade

Code Pattern — Copy dari yang Sudah Ada

Anda sudah punya pattern yang matang dari Fasilitas:

    Schema: prisma/schema.prisma → copy pattern Fasilitas untuk entity baru
    Data layer: lib/data/fasilitas.ts → copy untuk entity baru
    Express routes: express-routes/fasilitas.ts → copy untuk entity baru
    CMS pages: SiteContentPages.tsx (FasilitasListPage + FasilitasFormPage) → copy untuk entity baru
    Shared types: packages/shared/src/types/site-content.ts → tambah type baru
    Shared schemas: packages/shared/src/schemas.ts → tambah zod schema baru

Prosesnya: copy → rename → adjust field → selesai.