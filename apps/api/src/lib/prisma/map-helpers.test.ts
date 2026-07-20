import { describe, expect, it } from "vitest";
import {
  asExtras,
  asStringArray,
  parseDateOnly,
  toDateOnly,
  toIso,
} from "./map-helpers";

describe("map-helpers", () => {
  it("toIso null-safe", () => {
    expect(toIso(null)).toBeNull();
    expect(toIso(undefined)).toBeNull();
    expect(toIso(new Date("2026-07-21T00:00:00.000Z"))).toBe(
      "2026-07-21T00:00:00.000Z",
    );
  });

  it("date-only roundtrip via UTC", () => {
    const d = parseDateOnly("2024-06-15");
    expect(toDateOnly(d)).toBe("2024-06-15");
  });

  it("asStringArray filters non-strings", () => {
    expect(asStringArray(["a", 1, "b"] as never)).toEqual(["a", "b"]);
    expect(asStringArray(null)).toEqual([]);
    expect(asStringArray({ x: 1 })).toEqual([]);
  });

  it("asExtras tolerates bad json shapes", () => {
    expect(asExtras(null)).toEqual({});
    expect(asExtras([])).toEqual({});
    expect(asExtras({ hero: "x" })).toEqual({ hero: "x" });
  });
});
