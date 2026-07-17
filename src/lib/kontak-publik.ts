import { PPDB_CONTACT_EMAIL, PPDB_CONTACT_HOURS, PPDB_CONTACT_WA_DISPLAY } from "@/lib/ppdb-landing-content";
import { getPpdbWhatsAppPhone, getPpdbWhatsAppUrl } from "@/lib/ppdb-whatsapp";

/** Email resmi untuk Humas / Tata Usaha (selaras PPDB). */
export const PUBLIK_CONTACT_EMAIL = PPDB_CONTACT_EMAIL;

/** Tampilan nomor WhatsApp resmi sekolah (PPDB & pertanyaan umum). */
export const PUBLIK_CONTACT_WA_DISPLAY = PPDB_CONTACT_WA_DISPLAY;

export const PUBLIK_CONTACT_HOURS = PPDB_CONTACT_HOURS;

/** Tautan wa.me dengan pesan pembuka PPDB. */
export function getPublikWhatsAppUrl(): string {
  return getPpdbWhatsAppUrl();
}

/** Digit internasional untuk atribut `href` tel: tidak dipakai — gunakan WhatsApp. */
export function getPublikWhatsAppPhoneDigits(): string {
  return getPpdbWhatsAppPhone();
}
