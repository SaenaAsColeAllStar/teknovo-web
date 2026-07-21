Analisis UI/UX CMS — Kondisi Saat Ini
✅ Yang SUDAH BAIK (enterprise feel)
Aspek	Detail
Design system	Shadcn/ui + CSS variables (--color-*) — konsisten
Layout	Sidebar collapsible + navbar sticky + breadcrumbs — solid
Role-based UI	Sidebar & form buttons mengikuti role — profesional
Rich text editor	TipTap dengan toolbar — mumpuni
SEO fields	ArticleSeoFields.tsx + generateArticleSeo() — sudah ada auto-generate
Media picker	Modal/library dari form — user friendly
Form validation	Zod + react-hook-form — enterprise standard
Toast notifications	sonner — modern
⚠️ Yang PERLU DIBENAHI
Area	Masalah	Dampak
Beranda	Widget analytics sample data — belum konek API	User lihat data palsu, kurangi kepercayaan
Pengumuman	404 — halaman tidak ditemukan	Fitur penting hilang
Loading states	Hanya teks "Memuat…" — tidak ada skeleton	Terasa lambat & murahan
Form grouping	Semua field di-flat — tidak ada section card	Form panjang terasa overwhelming
Preview	Tidak ada tombol Preview sebelum publish	User publish buta
Bulk actions	Tidak ada select/hapus massal	Operasional lambat
Sort order UI	Hanya field angka, tidak ada drag-and-drop	UX ketinggalan jaman
Auto SEO	Harus klik tombol "Generate" manual	User mungkin lupa
SERP Preview	Tidak ada preview Google result	User tidak tahu hasil SEO-nya
Error states	Hanya alert text merah — tidak ada empty state illustration	Terasa mentah
Image upload	Hanya URL input — tidak ada direct upload / crop	Ribet
Rekomendasi Strategis — Make It Enterprise Pro
Fase 1: Quick Wins (1-2 hari) — Fix UI/UX Gap
1. Skeleton Loading — Ganti semua "Memuat…"

Buat komponen LoadingSkeleton.tsx:
tsx

// apps/cms/src/components/ui/loading-skeleton.tsx
export function CardSkeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      <div className="h-4 w-3/4 rounded bg-gray-200" />
      <div className="h-3 w-1/2 rounded bg-gray-200" />
      <div className="h-32 rounded bg-gray-200" />
    </div>
  );
}

Ganti di semua page {loading ? <p>Memuat…</p> : ...} → <CardSkeleton />.
2. Section Cards — Group form fields

Buat komponen FormSection.tsx:
tsx

export function FormSection({ title, description, children }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  );
}

BeritaForm sekarang jadi:

<FormSection title="Informasi Dasar" description="Judul, slug, dan ringkasan">
  ← judul, slug, ringkasan →
</FormSection>

<FormSection title="Media & Kategori" description="Cover, kategori, status">
  ← cover, kategori, status →
</FormSection>

<FormSection title="Konten" description="Isi berita dengan editor">
  ← TipTap editor →
</FormSection>

<FormSection title="SEO & Metadata" description="Optimasi mesin pencari">
  ← ArticleSeoFields →
</FormSection>

3. Empty & Error States — Ilustrasi

Buat komponen EmptyState.tsx:
tsx

export function EmptyState({ icon: Icon, title, description, action }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="rounded-full bg-muted p-4 mb-4">
        <Icon className="size-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground mt-1">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

Fase 2: API Wiring (2-3 hari) — Beranda & Pengumuman
1. Dashboard Analytics — Wire ke API nyata

Buat endpoint API yang return data dashboard:
typescript

// Endpoint baru: GET /api/v1/dashboard/stats
interface DashboardStats {
  totalBerita: number;
  totalArtikel: number;
  totalPengunjungHariIni: number;
  totalPengunjungBulanIni: number;
  beritaPerBulan: { bulan: string; jumlah: number }[];
  topBerita: { judul: string; views: number }[];
  recentActivity: { type: string; label: string; time: string }[];
}

OverviewPage.tsx update:
tsx

function DashboardAnalytics() {
  const { data, isLoading } = useDashboardStats();
  
  if (isLoading) return <BigWidgetSkeleton />;
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard title="Berita" value={data.totalBerita} icon={Newspaper} />
      <StatCard title="Artikel" value={data.totalArtikel} icon={PenLine} />
      <StatCard title="Pengunjung Hari Ini" value={data.totalPengunjungHariIni} icon={Users} />
      <StatCard title="Menunggu Review" value={data.pendingReview} icon={ShieldCheck} badge />
    </div>
  );
}

Untuk sementara sebelum ada API analytics, buat aggregate dari data yang sudah ada (hitung jumlah berita, artikel, konten PENDING_REVIEW dari endpoint yang sudah jalan). Jangan biarkan sample data.
2. Pengumuman — Buat dari Awal

Pengumuman bisa jadi sub-tipe dari Berita dengan filter kategoriSlug === "pengumuman". Jadi tidak perlu schema baru:
tsx

// CMS — PengumumanPage.tsx
export function PengumumanPage() {
  // Reuse BeritaListPage dengan filter kategori = "pengumuman"
  return <BeritaListPage kategoriSlug="pengumuman" />;
}

TAPI — Jika pengumuman butuh tampilan berbeda (banner, sticky, expiry date), buat entity terpisah:
prisma

model Pengumuman {
  id          String   @id @default(uuid())
  judul       String
  konten      String   @db.Text
  tipe        String   @default("info") // info | warning | urgent
  bannerUrl   String?
  tanggalMulai DateTime?
  tanggalAkhir DateTime?
  isSticky    Boolean  @default(false)
  sortOrder   Int      @default(0)
  status      SiteContentStatus @default(DRAFT)
}

Rekomendasi saya: buat sebagai entity independent karena pengumuman punya lifecycle (mulai-berakhir, sticky) yang berbeda dari berita biasa.
Fase 3: Auto SEO & Editor Enhancement (2-3 hari)
1. Auto Generate SEO on Type — Bukan Manual

Di BeritaForm.tsx, panggil generateArticleSeo secara real-time setiap user mengetik judul/ringkasan, lalu isi field SEO secara otomatis:
tsx

// Di BeritaForm — useEffect
const watchedJudul = form.watch("judul");
const watchedRingkasan = form.watch("ringkasan");
const watchedKonten = form.watch("konten");

useEffect(() => {
  // Auto-fill SEO only if user hasn't manually edited SEO fields yet
  if (seoManuallyEdited || !watchedJudul || watchedJudul.length < 3) return;
  
  const seo = generateArticleSeo({
    judul: watchedJudul,
    ringkasan: watchedRingkasan,
    konten: watchedKonten,
    kategoriNama,
    slug: form.getValues("slug"),
    kind: "berita",
    siteName: "TEKNOVO",
  });
  
  form.setValue("metaTitle", seo.metaTitle, { shouldDirty: false });
  form.setValue("metaDescription", seo.metaDescription, { shouldDirty: false });
  // ... etc
}, [watchedJudul, watchedRingkasan, watchedKonten]);

2. SERP Preview — Google Result Simulator

Buat komponen yang show preview bagaimana artikel akan muncul di Google:
tsx

export function SerpPreview({ title, url, description }: Props) {
  return (
    <div className="rounded-lg border bg-white p-4 font-sans">
      <p className="text-xs text-green-700 truncate">{url}</p>
      <p className="text-sm text-blue-800 font-medium hover:underline cursor-pointer truncate">
        {title}
      </p>
      <p className="text-xs text-gray-600 line-clamp-2">{description}</p>
    </div>
  );
}

Letakkan di bawah section SEO — user bisa lihat real-time bagaimana tampilan di Google.
3. Readability Score

Tambahkan indikator readability (Flesch-Kincaid untuk Bahasa Indonesia — approximated):
tsx

function ReadabilityBadge({ konten }: { konten: string }) {
  const score = calculateReadability(konten);
  // Berdasarkan panjang kalimat rata-rata, jumlah kata sulit
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className={score > 60 ? "text-green-600" : "text-amber-600"}>
        Readability: {score}/100
      </span>
      {score < 40 && <span className="text-red-500">Terlalu kompleks</span>}
    </div>
  );
}

4. Image Alt Text Suggestions

Saat upload gambar di TipTap, auto-generate alt text dari konteks:
tsx

function suggestAltText(imageUrl: string, konteks: string): string {
  // Parse filename, match dengan konteks berita
  const filename = imageUrl.split('/').pop()?.split('.')[0] || '';
  const cleanName = filename.replace(/[-_]/g, ' ');
  return cleanName || `Ilustrasi ${konteks.slice(0, 50)}...`;
}

Fase 4: Professional UI Enhancements (Library Additions)
Library	Fungsi	Alasan
@dnd-kit/core + @dnd-kit/sortable	Drag-and-drop untuk urutan konten	Enterprise UX untuk sort order
@lexical/react atau TipTap Table/Image	Enhanced rich text (table, image resize)	Editor lebih powerfull
cmdk (command palette)	Cmd+K untuk search navigasi	Power user feature
vaul (drawer)	Mobile-optimized bottom sheet	Alternatif modal di mobile
framer-motion	Micro-animasi (layout transitions)	Polished, modern feel
react-dropzone	Drag-and-drop upload gambar langsung	Ganti modal media picker
@radix-ui/react-tabs	Tab sections di halaman detail	Navigasi vertikal lebih rapi
recharts (SUDAH ADA)	Analytics charts — tinggal wiring	Jangan buang, tinggal konek API
Tambahan yang TIDAK Perlu Library Baru:

    Preview mode — render konten di iframe/div terpisah → bisa pakai dangerouslySetInnerHTML + DOMPurify (sudah ada isomorphic-dompurify di package.json)
    Auto-save draft — pakai useEffect + debounce + setInterval save draft setiap 30 detik
    Keyboard shortcuts — Ctrl+S simpan, Ctrl+Shift+P publish → vanilla JS
    Bulk select — pakai checkbox array di table → React state biasa

Rekomendasi Arsitektur — Auto SEO Flow

User mengetik judul
       │
       ▼
useEffect debounce 500ms
       │
       ├── generateArticleSeo() ← dari @teknovo/shared
       │
       ├── ➤ metaTitle ← "${judul} | TEKNOVO" (truncated)
       ├── ➤ metaDescription ← ringkasan || excerpt konten
       ├── ➤ metaKeywords ← ekstrak kata kunci unik
       ├── ➤ ogImageUrl ← coverUrl (fallback)
       └── ➤ canonicalUrl ← /berita/kegiatan/{slug}
       │
       ▼
   SERP Preview live update
       │
       ▼
User bisa override manual kapan saja
       │
       ▼
Saati simpan → field SEO dikirim ke API

Tambahkan flag seoInitialAutoFill: boolean di form state. Set true saat pertama generate. Set false kalau user mengubah manual salah satu field SEO. Setelah flag false, auto-generate berhenti dan user fully control.
Ringkasan Prioritas
Priority	Task	Library Baru?	Estimasi
🔥 P0	Wire dashboard analytics ke API (aggregate data existing)	Tidak	1 hari
🔥 P0	Buat Pengumuman entity + route + CMS page	Tidak	1-2 hari
⚡ P1	Auto-fill SEO real-time (tanpa klik manual)	Tidak	4 jam
⚡ P1	Skeleton loading + Empty states	Tidak	4 jam
⚡ P1	Form section cards (grouping)	Tidak	3 jam
💎 P2	SERP Preview widget	Tidak	3 jam
💎 P2	Preview mode (lihat konten sebelum publish)	Tidak	4 jam
💎 P2	Auto-save draft setiap 30 detik	Tidak	2 jam
🚀 P3	Drag-and-drop sort order	@dnd-kit	1 hari
🚀 P3	Command palette (Cmd+K)	cmdk	4 jam
🚀 P3	Direct image upload (drag-drop)	react-dropzone	1 hari
🌟 P4	Animasi transisi	framer-motion	4 jam
🌟 P4	Readability score	Tidak	3 jam