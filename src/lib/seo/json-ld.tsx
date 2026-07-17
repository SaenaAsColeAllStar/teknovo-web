import type { ReactElement } from "react";

type JsonLdScriptProps = {
  data: object;
};

/** Server-only JSON-LD script — no client bundle, no visible UI. */
export function JsonLdScript({ data }: JsonLdScriptProps): ReactElement {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
