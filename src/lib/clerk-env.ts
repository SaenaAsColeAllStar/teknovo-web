/** True jika kunci Clerk publishable + secret tersedia (siap runtime). */
export function isClerkConfigured(): boolean {
  const pk = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.trim();
  const sk = process.env.CLERK_SECRET_KEY?.trim();
  return Boolean(
    pk &&
      sk &&
      !pk.startsWith("GANTI_") &&
      !sk.startsWith("GANTI_") &&
      pk.length > 10 &&
      sk.length > 10,
  );
}

export function getClerkPublishableKey(): string | undefined {
  const v = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.trim();
  return v || undefined;
}

export function getClerkSecretKey(): string | undefined {
  const v = process.env.CLERK_SECRET_KEY?.trim();
  return v || undefined;
}
