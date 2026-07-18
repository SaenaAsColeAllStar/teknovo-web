/**
 * Constant-time-ish string compare for secrets (Workers-safe, no node:crypto).
 * Length mismatch returns false after a fixed dummy loop to reduce leak.
 */
export function safeEqualSecret(provided: string, expected: string): boolean {
  const len = Math.max(provided.length, expected.length, 1);
  let mismatch = provided.length === expected.length ? 0 : 1;
  for (let i = 0; i < len; i++) {
    const a = provided.charCodeAt(i) || 0;
    const b = expected.charCodeAt(i) || 0;
    mismatch |= a ^ b;
  }
  return mismatch === 0;
}
