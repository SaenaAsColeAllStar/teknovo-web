/**
 * Minimal structured JSON logger for Workers (stdout → CF Observability).
 */

export type LogFields = Record<string, unknown>;

function emit(
  level: "info" | "warn" | "error",
  message: string,
  fields?: LogFields,
): void {
  const line = JSON.stringify({
    level,
    msg: message,
    ts: new Date().toISOString(),
    ...fields,
  });
  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.log(line);
}

export const log = {
  info: (message: string, fields?: LogFields) => emit("info", message, fields),
  warn: (message: string, fields?: LogFields) => emit("warn", message, fields),
  error: (message: string, fields?: LogFields) => emit("error", message, fields),
};
