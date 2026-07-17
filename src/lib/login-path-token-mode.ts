/** Flag mode token — aman di client bundle (tanpa import Redis TCP). */

export function isRedisLoginTokenMode(): boolean {
  return process.env.TEKNOVO_LOGIN_TOKEN_MODE?.trim().toLowerCase() === "redis";
}

export function isRedisLoginPathRotationActive(secretConfigured: boolean): boolean {
  return secretConfigured && isRedisLoginTokenMode();
}
