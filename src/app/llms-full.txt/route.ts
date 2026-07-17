import { NextResponse } from "next/server";

import { buildLlmsFullTxtContent } from "@/lib/llms-txt-content";

export function GET(): NextResponse {
  return new NextResponse(`${buildLlmsFullTxtContent()}\n`, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
