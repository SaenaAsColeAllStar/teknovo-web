import { buildLandingAbsoluteUrl } from "@/lib/seo/urls";
import { PUBLIK_CONTACT_EMAIL } from "@/lib/kontak-publik";

/** RFC 9116 security.txt — server-generated, no UI. */
export function buildSecurityTxtContent(): string {
  const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 180).toISOString();
  const securityEmail =
    process.env.SECURITY_CONTACT_EMAIL?.trim() || "security@teknovo.ctos.web.id";

  return [
    `Contact: mailto:${securityEmail}`,
    `Contact: mailto:${PUBLIK_CONTACT_EMAIL}`,
    "Preferred-Languages: id, en",
    `Canonical: ${buildLandingAbsoluteUrl("/.well-known/security.txt")}`,
    `Expires: ${expires}`,
  ].join("\n");
}
