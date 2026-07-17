import { NextResponse } from "next/server";

const SECURITY_TXT = [
  "Contact: mailto:security@teknovo.ctos.web.id",
  "Preferred-Languages: id, en",
  "Canonical: https://teknovo.ctos.web.id/.well-known/security.txt",
  `Expires: ${new Date(Date.now() + 1000 * 60 * 60 * 24 * 180).toISOString()}`,
].join("\n");

export function GET(): NextResponse {
  return new NextResponse(`${SECURITY_TXT}\n`, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
