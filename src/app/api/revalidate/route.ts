import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";

const bodySchema = z.object({
  secret: z.string().min(1),
  path: z.string().optional(),
  tag: z.string().optional(),
});

/**
 * On-demand revalidation — called by homelab API after publish.
 * POST { secret, path?: "/berita", tag?: "berita" }
 */
export async function POST(request: Request) {
  const expected = process.env.REVALIDATE_SECRET;
  if (!expected || expected.startsWith("GANTI_")) {
    return NextResponse.json(
      { ok: false, error: "REVALIDATE_SECRET belum dikonfigurasi" },
      { status: 503 },
    );
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Invalid body" }, { status: 400 });
  }

  if (parsed.data.secret !== expected) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  if (parsed.data.path) {
    revalidatePath(parsed.data.path);
  }
  if (parsed.data.tag) {
    revalidateTag(parsed.data.tag, "max");
  }
  if (!parsed.data.path && !parsed.data.tag) {
    revalidatePath("/");
    revalidatePath("/berita");
  }

  return NextResponse.json({ ok: true, revalidated: true });
}
