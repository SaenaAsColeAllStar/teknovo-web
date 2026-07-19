import { CMS_ROLE_LABEL, type CmsRole } from "@teknovo/shared";

/**
 * Normalize Indonesian phone numbers for `wa.me/<digits>`.
 * Returns digits only (country code 62…) or null if empty/invalid.
 */
export function normalizeWhatsAppPhoneId(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  let digits = trimmed.replace(/[^\d+]/g, "");
  if (digits.startsWith("+")) digits = digits.slice(1);
  digits = digits.replace(/\D/g, "");
  if (!digits) return null;

  if (digits.startsWith("62")) return digits;
  if (digits.startsWith("0")) return `62${digits.slice(1)}`;
  if (digits.startsWith("8")) return `62${digits}`;
  return digits;
}

export type WhatsAppInviteMessageInput = {
  inviteUrl: string;
  role: CmsRole;
  email?: string | null;
  expiresAt?: string | null;
  expiresInDays?: number | null;
};

export function buildWhatsAppInviteMessage(
  input: WhatsAppInviteMessageInput,
): string {
  const roleLabel = CMS_ROLE_LABEL[input.role];
  const expiry =
    input.expiresAt != null
      ? formatExpiryId(input.expiresAt)
      : input.expiresInDays != null
        ? `${input.expiresInDays} hari sejak dikirim`
        : null;

  const lines = [
    `Halo! Anda diundang ke CMS SMK Teknovo sebagai ${roleLabel}.`,
    "",
    "Buka tautan berikut untuk menerima undangan dan membuat kata sandi:",
    input.inviteUrl,
  ];

  if (input.email) {
    lines.push("", `Email undangan: ${input.email}`);
  }
  if (expiry) {
    lines.push(`Berlaku hingga: ${expiry}`);
  }

  lines.push(
    "",
    "Jika email dari Clerk belum masuk, cek folder spam/promosi atau langsung pakai tautan di atas.",
  );

  return lines.join("\n");
}

/** Opens WhatsApp share picker (no phone) or chat with a specific ID number. */
export function buildWhatsAppInviteUrl(
  message: string,
  phoneRaw?: string | null,
): string {
  const text = encodeURIComponent(message);
  const phone = phoneRaw ? normalizeWhatsAppPhoneId(phoneRaw) : null;
  if (phone) return `https://wa.me/${phone}?text=${text}`;
  return `https://wa.me/?text=${text}`;
}

function formatExpiryId(iso: string): string {
  try {
    return new Intl.DateTimeFormat("id-ID", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}
