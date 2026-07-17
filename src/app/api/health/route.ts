import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "teknovo-web",
    ts: new Date().toISOString(),
  });
}
