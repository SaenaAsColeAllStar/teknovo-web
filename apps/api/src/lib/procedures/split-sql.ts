/**
 * Split SQL into executable statements, respecting PostgreSQL $$ dollar quotes
 * (and $tag$ … $tag$) so CREATE FUNCTION bodies stay intact.
 */
export function splitSqlStatements(sql: string): string[] {
  const statements: string[] = [];
  let buf = "";
  let i = 0;
  let dollarTag: string | null = null;

  while (i < sql.length) {
    const ch = sql[i];

    if (dollarTag) {
      if (sql.startsWith(dollarTag, i)) {
        buf += dollarTag;
        i += dollarTag.length;
        dollarTag = null;
        continue;
      }
      buf += ch;
      i += 1;
      continue;
    }

    // Line comment
    if (ch === "-" && sql[i + 1] === "-") {
      const end = sql.indexOf("\n", i);
      i = end === -1 ? sql.length : end + 1;
      buf += "\n";
      continue;
    }

    // Block comment
    if (ch === "/" && sql[i + 1] === "*") {
      const end = sql.indexOf("*/", i + 2);
      i = end === -1 ? sql.length : end + 2;
      continue;
    }

    // Dollar quote start: $$ or $tag$
    if (ch === "$") {
      const match = sql.slice(i).match(/^(\$[A-Za-z_][A-Za-z0-9_]*\$|\$\$)/);
      if (match) {
        dollarTag = match[1];
        buf += dollarTag;
        i += dollarTag.length;
        continue;
      }
    }

    if (ch === ";") {
      const trimmed = buf.trim();
      if (trimmed.length > 0) statements.push(trimmed);
      buf = "";
      i += 1;
      continue;
    }

    buf += ch;
    i += 1;
  }

  const tail = buf.trim();
  if (tail.length > 0) statements.push(tail);
  return statements;
}
