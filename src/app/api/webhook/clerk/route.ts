import { NextResponse } from "next/server";

/**
 * Clerk webhook stub — verify Svix signature in production.
 * Docs: https://clerk.com/docs/webhooks/overview
 */
export async function POST(request: Request) {
  const secret = process.env.CLERK_WEBHOOK_SECRET;
  if (!secret || secret.startsWith("GANTI_")) {
    return NextResponse.json(
      { ok: false, error: "CLERK_WEBHOOK_SECRET belum dikonfigurasi" },
      { status: 503 },
    );
  }

  // TODO: verify webhook signature with svix, then sync user/role to API
  const payload = await request.text();
  const eventType = request.headers.get("svix-id")
    ? "clerk.event"
    : "unknown";

  console.info("[clerk-webhook]", eventType, "bytes=", payload.length);

  return NextResponse.json({ ok: true, received: true });
}
