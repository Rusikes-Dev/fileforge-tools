/** JSON helpers with human-readable error reporting. */

export interface JsonError {
  message: string;
  line?: number;
  column?: number;
  hint?: string;
}

export function locateJsonError(input: string, err: unknown): JsonError {
  const raw = err instanceof Error ? err.message : String(err);
  const posMatch = raw.match(/position (\d+)/);
  let line: number | undefined;
  let column: number | undefined;
  if (posMatch) {
    const pos = parseInt(posMatch[1], 10);
    const before = input.slice(0, pos);
    line = before.split("\n").length;
    column = pos - before.lastIndexOf("\n");
  }
  let hint: string | undefined;
  if (/'/.test(input) && /Unexpected token '/.test(raw)) {
    hint = "JSON requires double quotes — single quotes around keys or strings are not valid.";
  } else if (/,\s*[}\]]/.test(input)) {
    hint = "There appears to be a trailing comma before a closing bracket. JSON does not allow trailing commas.";
  } else if (/\/\/|\/\*/.test(input)) {
    hint = "JSON does not support comments. Remove // and /* */ lines.";
  }
  return { message: raw, line, column, hint };
}

export interface JsonSummary {
  rootType: string;
  keys?: number;
  items?: number;
  depth: number;
}

export function summarizeJson(value: unknown): JsonSummary {
  const depth = (v: unknown): number => {
    if (v === null || typeof v !== "object") return 0;
    const children = Array.isArray(v) ? v : Object.values(v as object);
    return 1 + children.reduce<number>((max, c) => Math.max(max, depth(c)), 0);
  };
  const summary: JsonSummary = {
    rootType: Array.isArray(value) ? "array" : value === null ? "null" : typeof value,
    depth: depth(value),
  };
  if (Array.isArray(value)) summary.items = value.length;
  else if (value !== null && typeof value === "object") summary.keys = Object.keys(value).length;
  return summary;
}
