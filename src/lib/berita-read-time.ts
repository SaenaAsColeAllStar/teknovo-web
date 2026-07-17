/** Estimasi waktu baca dari teks polos atau HTML artikel. */
export function estimateReadTimeMinutes(text: string, wordsPerMinute = 200): number {
  const plain = text
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
  const words = plain.length === 0 ? 0 : plain.split(" ").filter(Boolean).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

export function formatReadTimeId(minutes: number): string {
  return `${minutes} menit baca`;
}
