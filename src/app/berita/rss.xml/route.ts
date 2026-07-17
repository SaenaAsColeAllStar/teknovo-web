import { NextResponse } from "next/server";

import { buildBeritaRssXml } from "@/lib/berita-rss";

export const revalidate = 300;

export async function GET(): Promise<NextResponse> {
  const xml = await buildBeritaRssXml();
  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=300, s-maxage=300",
    },
  });
}
