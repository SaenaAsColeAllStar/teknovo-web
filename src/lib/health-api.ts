import { NextResponse } from "next/server";

export type HealthAppId = "landing" | "web";

export type PublicHealthPayload = {
  ok: boolean;
  status: "healthy" | "degraded";
  service: string;
  timestamp: string;
  uptime: number;
  checks: {
    database: { status: "ok" | "fail" | "skip"; detail?: string };
    redis: { status: "ok" | "fail" | "skip"; detail?: string };
    disk: { status: "ok" | "fail" | "skip"; detail?: string };
    memory: { status: "ok" | "fail" | "skip"; detail?: string };
  };
};

export async function createHealthResponse(app: HealthAppId): Promise<NextResponse<PublicHealthPayload>> {
  const body: PublicHealthPayload = {
    ok: true,
    status: "healthy",
    service: app === "landing" ? "teknovo-landing" : "teknovo-web",
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    checks: {
      database: { status: "skip", detail: "homelab API — not bound in CF worker" },
      redis: { status: "skip", detail: "not bound in CF worker" },
      disk: { status: "skip", detail: "Workers filesystem N/A" },
      memory: { status: "skip", detail: "Workers memory N/A" },
    },
  };
  return NextResponse.json(body, { status: 200 });
}
