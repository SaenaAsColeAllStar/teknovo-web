/** Approximate readability score for Indonesian prose (0–100). */
export function calculateReadability(htmlOrText: string): number {
  const text = htmlOrText
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (text.length < 40) return 0;

  const sentences = text.split(/[.!?。…]+/).filter((s) => s.trim().length > 0);
  const words = text.split(/\s+/).filter(Boolean);
  if (sentences.length === 0 || words.length === 0) return 0;

  const avgSentenceLen = words.length / sentences.length;
  const longWords = words.filter((w) => w.replace(/[^a-zA-ZÀ-ÿ]/g, "").length >= 8).length;
  const longRatio = longWords / words.length;

  // Higher avg sentence length + more long words → lower score.
  let score = 100 - (avgSentenceLen - 12) * 2.5 - longRatio * 40;
  score = Math.max(0, Math.min(100, Math.round(score)));
  return score;
}
