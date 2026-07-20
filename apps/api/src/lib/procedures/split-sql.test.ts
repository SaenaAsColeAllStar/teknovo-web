import { describe, expect, it } from "vitest";
import { splitSqlStatements } from "./split-sql";

describe("splitSqlStatements", () => {
  it("keeps $$ function bodies as one statement", () => {
    const sql = `
      CREATE OR REPLACE FUNCTION foo()
      RETURNS int
      LANGUAGE plpgsql
      AS $$
      BEGIN
        RETURN 1;
      END;
      $$;
      CREATE EXTENSION IF NOT EXISTS pg_trgm;
    `;
    const stmts = splitSqlStatements(sql);
    expect(stmts).toHaveLength(2);
    expect(stmts[0]).toContain("CREATE OR REPLACE FUNCTION foo()");
    expect(stmts[0]).toContain("RETURN 1;");
    expect(stmts[1]).toContain("CREATE EXTENSION");
  });

  it("strips line comments", () => {
    const stmts = splitSqlStatements("-- comment\nSELECT 1;");
    expect(stmts).toEqual(["SELECT 1"]);
  });
});
