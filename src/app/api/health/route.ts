import { createHealthResponse } from "@/lib/health-api";

export function GET() {
  return createHealthResponse("landing");
}
