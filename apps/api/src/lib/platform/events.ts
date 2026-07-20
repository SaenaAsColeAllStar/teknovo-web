/**
 * Platform event bus — Redis Pub/Sub when reachable, else in-process fallback.
 * Events: tenant.created, tenant.deleted (F-39 / Fase 10.6–10.7).
 */
import { EventEmitter } from "node:events";
import { getRedisUrl, isPlatformEnabled } from "./config";
import { log } from "../logger";

export type PlatformEventName = "tenant.created" | "tenant.deleted";

export type PlatformEventPayload = {
  tenantId: string;
  slug: string;
  at: string;
  meta?: Record<string, unknown>;
};

type Handler = (payload: PlatformEventPayload) => void | Promise<void>;

const CHANNEL = "teknovo:platform";
const localBus = new EventEmitter();
localBus.setMaxListeners(50);

type RedisClient = {
  duplicate: () => RedisClient;
  subscribe: (...args: unknown[]) => Promise<unknown>;
  publish: (channel: string, message: string) => Promise<number>;
  on: (event: string, listener: (...args: unknown[]) => void) => void;
  quit: () => Promise<"OK">;
};

let pub: RedisClient | null = null;
let sub: RedisClient | null = null;
let redisMode: "redis" | "memory" | "off" = "off";
const handlers = new Map<PlatformEventName, Set<Handler>>();

async function dispatchMessage(raw: string): Promise<void> {
  let parsed: { name: PlatformEventName; payload: PlatformEventPayload };
  try {
    parsed = JSON.parse(raw) as typeof parsed;
  } catch {
    return;
  }
  const set = handlers.get(parsed.name);
  if (!set) return;
  for (const h of set) {
    try {
      await h(parsed.payload);
    } catch (err) {
      log.error("platform.event.handler", {
        name: parsed.name,
        err: err instanceof Error ? err.message : String(err),
      });
    }
  }
}

async function tryConnectRedis(): Promise<boolean> {
  try {
    const { default: Redis } = await import("ioredis");
    const url = getRedisUrl();
    const client = new Redis(url, {
      maxRetriesPerRequest: 1,
      enableOfflineQueue: false,
      connectTimeout: 2_000,
      retryStrategy: () => null,
    });

    await new Promise<void>((resolve, reject) => {
      const onReady = () => {
        cleanup();
        resolve();
      };
      const onError = (err: Error) => {
        cleanup();
        reject(err);
      };
      const timer = setTimeout(() => {
        cleanup();
        reject(new Error("redis connect timeout"));
      }, 2_500);
      const cleanup = () => {
        clearTimeout(timer);
        client.off("ready", onReady);
        client.off("error", onError);
      };
      client.once("ready", onReady);
      client.once("error", onError);
    });

    pub = client as unknown as RedisClient;
    sub = client.duplicate() as unknown as RedisClient;
    await sub.subscribe(CHANNEL);
    sub.on("message", (_ch, message) => {
      void dispatchMessage(String(message));
    });
    redisMode = "redis";
    log.info("platform.events", { mode: "redis", url });
    return true;
  } catch (err) {
    try {
      await pub?.quit();
    } catch {
      /* ignore */
    }
    pub = null;
    sub = null;
    log.warn("platform.events", {
      mode: "memory",
      err: err instanceof Error ? err.message : String(err),
    });
    redisMode = "memory";
    return false;
  }
}

export function onPlatformEvent(
  name: PlatformEventName,
  handler: Handler,
): () => void {
  let set = handlers.get(name);
  if (!set) {
    set = new Set();
    handlers.set(name, set);
  }
  set.add(handler);
  const localListener = (payload: PlatformEventPayload) => {
    void handler(payload);
  };
  localBus.on(name, localListener);
  return () => {
    set!.delete(handler);
    localBus.off(name, localListener);
  };
}

export async function publishPlatformEvent(
  name: PlatformEventName,
  payload: PlatformEventPayload,
): Promise<void> {
  const envelope = JSON.stringify({ name, payload });
  if (redisMode === "redis" && pub) {
    await pub.publish(CHANNEL, envelope);
    // Subscriber on same process also receives via Redis; avoid double local emit.
    return;
  }
  localBus.emit(name, payload);
}

export async function initPlatformEventBus(): Promise<
  "redis" | "memory" | "off"
> {
  if (!isPlatformEnabled()) {
    redisMode = "off";
    return "off";
  }
  await tryConnectRedis();
  return redisMode;
}

export function getEventBusMode(): "redis" | "memory" | "off" {
  return redisMode;
}

export async function shutdownPlatformEventBus(): Promise<void> {
  try {
    await sub?.quit();
  } catch {
    /* ignore */
  }
  try {
    await pub?.quit();
  } catch {
    /* ignore */
  }
  pub = null;
  sub = null;
  redisMode = "off";
}
