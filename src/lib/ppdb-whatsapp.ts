/** Nomor WA Tata Usaha / PPDB (format internasional tanpa +, untuk wa.me). */
const PPDB_WHATSAPP_PHONE_FALLBACK = "628988131858";

const PPDB_WHATSAPP_PREFILL_FALLBACK = `Assalamualaikum. Saya orang tua/wali calon siswa dan berminat PPDB SMK Teknovo Tahun Ajaran 2026/2027.

Nama calon siswa:
Asal SMP/MTs:
Minat jurusan (Teknik Mesin / Unit Layanan Wisata):
No. HP/WhatsApp orang tua:

Mohon informasi langkah pendaftaran dan jadwal verifikasi berkas. Terima kasih.`;

function readPublicEnv(key: string): string | undefined {
  const v = process.env[key];
  return typeof v === "string" && v.trim() !== "" ? v.trim() : undefined;
}

export function getPpdbWhatsAppPhone(): string {
  const raw = readPublicEnv("NEXT_PUBLIC_PPDB_WHATSAPP_PHONE");
  if (!raw) {
    return PPDB_WHATSAPP_PHONE_FALLBACK;
  }
  return raw.replace(/\D/g, "");
}

export function getPpdbWhatsAppPrefill(): string {
  return readPublicEnv("NEXT_PUBLIC_PPDB_WHATSAPP_PREFILL") ?? PPDB_WHATSAPP_PREFILL_FALLBACK;
}

/** @deprecated Gunakan getPpdbWhatsAppPhone — tetap diekspor untuk kompatibilitas. */
export const PPDB_WHATSAPP_PHONE = PPDB_WHATSAPP_PHONE_FALLBACK;

export function getPpdbWhatsAppUrl(): string {
  return `https://wa.me/${getPpdbWhatsAppPhone()}?text=${encodeURIComponent(getPpdbWhatsAppPrefill())}`;
}
