/**
 * Diagnosa performa SSR di VPS: set `TEKNOVO_LOG_SSR_TIMING=1` lalu baca log PM2 / stdout.
 * Jangan aktifkan permanen — menambah I/O log.
 */
export function createSsrTimer(label: string): () => void {
  if (process.env.TEKNOVO_LOG_SSR_TIMING !== "1") {
    return () => {};
  }
  const t0 = Date.now();
  return () => {
    console.info(`[ssr-timing] ${label} ${Date.now() - t0}ms`);
  };
}
