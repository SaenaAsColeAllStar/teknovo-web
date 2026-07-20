import type { Context } from "hono";
import type { NodeBindings, RuntimeBindings } from "./http";
import { log } from "./logger";

export type { RuntimeBindings };

export function hasPrisma(env: RuntimeBindings): env is NodeBindings {
  return (
    typeof env === "object" &&
    env !== null &&
    "prisma" in env &&
    (env as NodeBindings).prisma != null
  );
}

export function hasD1(env: RuntimeBindings): env is Env {
  return (
    typeof env === "object" &&
    env !== null &&
    "DB" in env &&
    (env as Env).DB != null
  );
}

export function hasMinio(env: RuntimeBindings): env is NodeBindings {
  return hasPrisma(env) && env.s3 != null && Boolean(env.MINIO_BUCKET);
}

/** Public object URL — MinIO on Node, R2 on Worker. */
export function publicObjectUrl(env: RuntimeBindings, key: string): string {
  const normalized = key.replace(/^\//, "");
  if (hasMinio(env)) {
    return `${env.MINIO_PUBLIC_URL.replace(/\/$/, "")}/${normalized}`;
  }
  const base = ((env as Env).R2_PUBLIC_URL || "https://r2.ctos.web.id").replace(
    /\/$/,
    "",
  );
  return `${base}/${normalized}`;
}

/**
 * Worker: `executionCtx.waitUntil`. Node: fire-and-forget (no ExecutionContext).
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function scheduleBackground(c: Context<any>, task: Promise<unknown>) {
  try {
    const ctx = c.executionCtx as
      | { waitUntil?: (p: Promise<unknown>) => void }
      | undefined;
    if (ctx?.waitUntil) {
      ctx.waitUntil(task);
      return;
    }
  } catch {
    // Node / adapters without ExecutionContext throw on access.
  }
  void task.catch((err) => {
    log.warn("background_task_failed", {
      err: err instanceof Error ? err.message : String(err),
    });
  });
}
