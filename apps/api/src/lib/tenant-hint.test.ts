import { describe, expect, it } from "vitest";
import { extractTenantHint } from "./tenant-hint";

describe("extractTenantHint", () => {
  it("prefers X-Tenant-Id header", () => {
    const headers = new Headers({ "x-tenant-id": "abc-uuid" });
    const url = new URL("https://api.example.com/api/v1/berita");
    expect(extractTenantHint({ headers, url })).toEqual({
      hint: "abc-uuid",
      source: "header-id",
    });
  });

  it("uses X-Tenant-Slug when id absent", () => {
    const headers = new Headers({ "x-tenant-slug": "Demo-School" });
    const url = new URL("https://api.example.com/api/v1/berita");
    expect(extractTenantHint({ headers, url })).toEqual({
      hint: "demo-school",
      source: "header-slug",
    });
  });

  it("extracts subdomain hint", () => {
    const headers = new Headers({ host: "acme.cms-api.smkteknovo.sch.id" });
    const url = new URL("https://acme.cms-api.smkteknovo.sch.id/api/v1/berita");
    expect(extractTenantHint({ headers, url })).toEqual({
      hint: "acme",
      source: "subdomain",
    });
  });

  it("ignores reserved subdomains", () => {
    const headers = new Headers({ host: "cms-api.smkteknovo.sch.id" });
    const url = new URL("https://cms-api.smkteknovo.sch.id/api/v1/berita");
    expect(extractTenantHint({ headers, url }).source).toBe("none");
  });

  it("extracts /t/:slug path prefix", () => {
    const headers = new Headers({ host: "cms-api.smkteknovo.sch.id" });
    const url = new URL("https://cms-api.smkteknovo.sch.id/t/acme/api/v1/berita");
    expect(extractTenantHint({ headers, url })).toEqual({
      hint: "acme",
      source: "path",
    });
  });
});
