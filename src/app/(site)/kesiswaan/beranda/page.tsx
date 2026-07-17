import { permanentRedirect } from "next/navigation";

/** Legacy hub path — canonical ringkasan kesiswaan ada di `/kesiswaan`. */
export default function KesiswaanBerandaRedirect(): never {
  permanentRedirect("/kesiswaan");
}
