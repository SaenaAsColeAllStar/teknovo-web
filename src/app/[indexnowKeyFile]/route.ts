import { NextResponse } from "next/server";

import { getIndexNowKey } from "@/lib/indexnow";

type RouteContext = { params: Promise<{ indexnowKeyFile: string }> };

/** Melayani berkas verifikasi IndexNow: /{INDEXNOW_KEY}.txt */
export async function GET(_request: Request, context: RouteContext): Promise<NextResponse> {
  const key = getIndexNowKey();
  if (!key) {
    return new NextResponse("Not Found", { status: 404 });
  }

  const { indexnowKeyFile } = await context.params;
  if (indexnowKeyFile !== `${key}.txt`) {
    return new NextResponse("Not Found", { status: 404 });
  }

  return new NextResponse(`${key}\n`, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
