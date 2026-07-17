/**
 * Gambar dengan src `http(s)://...` tidak dioptimalkan lewat server Next (unoptimized),
 * agar browser memuat langsung dari CDN — mengurangi error timeout optimizer di jaringan lambat.
 */
export function nextImageRemoteProps(src: string): { unoptimized: boolean } {
  const remote = src.startsWith("http://") || src.startsWith("https://");
  return { unoptimized: remote };
}
