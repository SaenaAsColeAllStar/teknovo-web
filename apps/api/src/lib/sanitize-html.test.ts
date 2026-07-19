import { describe, expect, it } from "vitest";
import { sanitizeArtikelHtml } from "./sanitize-html";
import { verifySvixSignature } from "./svix-verify";

describe("sanitizeArtikelHtml", () => {
  it("strips script tags", () => {
    const out = sanitizeArtikelHtml(
      `<p>Hi</p><script>alert(1)</script><p>Ok</p>`,
    );
    expect(out).not.toMatch(/script/i);
    expect(out).toContain("Hi");
    expect(out).toContain("Ok");
  });

  it("blocks javascript: and data: hrefs", () => {
    const out = sanitizeArtikelHtml(
      `<a href="javascript:alert(1)">x</a><a href="data:text/html,hi">y</a><a href="https://smkteknovo.sch.id">z</a>`,
    );
    expect(out).not.toMatch(/javascript:/i);
    expect(out).not.toMatch(/data:/i);
    expect(out).toContain('href="https://smkteknovo.sch.id"');
    expect(out).toContain('rel="noopener noreferrer"');
  });

  it("strips event handlers even with odd casing", () => {
    const out = sanitizeArtikelHtml(
      `<img ONERROR=alert(1) src="https://r2.example/a.png">`,
    );
    expect(out).not.toMatch(/onerror/i);
    expect(out).toContain('src="https://r2.example/a.png"');
  });

  it("strips style attributes", () => {
    const out = sanitizeArtikelHtml(`<p style="background:url(//x)">t</p>`);
    expect(out).not.toMatch(/style/i);
    expect(out).toContain("t");
  });

  it("handles nested script smuggling attempts", () => {
    const out = sanitizeArtikelHtml(`<<script>script>alert(1)</script>`);
    expect(out).not.toMatch(/alert/i);
  });
});

describe("verifySvixSignature", () => {
  async function sign(
    secretBytes: Uint8Array,
    id: string,
    ts: string,
    body: string,
  ): Promise<string> {
    const key = await crypto.subtle.importKey(
      "raw",
      secretBytes,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"],
    );
    const mac = await crypto.subtle.sign(
      "HMAC",
      key,
      new TextEncoder().encode(`${id}.${ts}.${body}`),
    );
    const view = new Uint8Array(mac);
    let s = "";
    for (let i = 0; i < view.length; i++) s += String.fromCharCode(view[i]!);
    return btoa(s);
  }

  it("accepts a valid v1 signature", async () => {
    const raw = new Uint8Array(32);
    crypto.getRandomValues(raw);
    let b64 = "";
    for (let i = 0; i < raw.length; i++) b64 += String.fromCharCode(raw[i]!);
    const secret = `whsec_${btoa(b64)}`;
    const id = "msg_test";
    const ts = String(Math.floor(Date.now() / 1000));
    const payload = `{"type":"user.created"}`;
    const sig = await sign(raw, id, ts, payload);

    const ok = await verifySvixSignature({
      secret,
      payload,
      svixId: id,
      svixTimestamp: ts,
      svixSignature: `v1,${sig}`,
    });
    expect(ok).toBe(true);
  });

  it("rejects missing or wrong signatures", async () => {
    const ok = await verifySvixSignature({
      secret: "whsec_dGVzdA==",
      payload: "{}",
      svixId: "msg_x",
      svixTimestamp: String(Math.floor(Date.now() / 1000)),
      svixSignature: "v1,invalid",
    });
    expect(ok).toBe(false);
  });
});
