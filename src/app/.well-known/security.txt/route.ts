import { NextResponse } from "next/server";

import { buildSecurityTxtContent } from "@/lib/seo/security";

export function GET(): NextResponse {
  return new NextResponse(`${buildSecurityTxtContent()}\n`, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
