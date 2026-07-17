export type TeknovoNotFoundApp =
  | "landing"
  | "ppdb"
  | "console"
  | "keuangan"
  | "wa-sender"
  | "cbt";

/** Tujuan tombol «Kembali ke beranda» per app. */
export function getTeknovoNotFoundHomeHref(app: TeknovoNotFoundApp): string {
  switch (app) {
    case "ppdb":
      return "/ppdb";
    case "wa-sender":
      return "/wasender";
    case "cbt":
      return "/cbt";
    case "landing":
    case "console":
    case "keuangan":
    default:
      return "/";
  }
}
