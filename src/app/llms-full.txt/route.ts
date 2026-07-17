import { NextResponse } from "next/server";

import { buildLlmsFullTxtContent } from "@/lib/seo/llms";

export function GET(): NextResponse {
  return new NextResponse(`${buildLlmsFullTxtContent()}\n`, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
