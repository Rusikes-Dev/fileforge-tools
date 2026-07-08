/** JSON helpers with human-readable error reporting. */

const BIGNUM_PREFIX = "\uE000__BIGNUM__";
const BIGNUM_SUFFIX = "__\uE000";
const BIGNUM_SENTINEL = new RegExp(`^${BIGNUM_PREFIX}(-?\\d+)${BIGNUM_SUFFIX}$`);
const BIGNUM_SENTINEL_IN_TEXT = new RegExp(`"${BIGNUM_PREFIX}(-?\\d+)${BIGNUM_SUFFIX}"`, "g");

/**
 * Walks raw JSON text and wraps any integer literal that can't survive a
 * round-trip through a standard JS double (i.e. anything JSON.parse would
 * silently corrupt, such as large database IDs or Twitter/Discord snowflake
 * IDs) in a quoted sentinel string, so JSON.parse preserves its exact digits
 * instead of rounding it. Only plain integers are wrapped — decimals and
 * exponents are left as-is, since exact big-integer IDs are the common,
 * well-defined case this targets.
 */
function markBigIntegers(text: string): string {
  let result = "";
  let inString = false;
  let i = 0;
  while (i < text.length) {
    const ch = text[i];
    if (inString) {
      result += ch;
      if (ch === "\\" && i + 1 < text.length) {
        result += text[i + 1];
        i += 2;
        continue;
      }
      if (ch === '"') inString = false;
      i++;
      continue;
    }
    if (ch === '"') {
      inString = true;
      result += ch;
      i++;
      continue;
    }
    const rest = text.slice(i);
    const match = /^-?\d+(\.\d+)?([eE][+-]?\d+)?/.exec(rest);
    if (match && match[0].length > 0) {
      const token = match[0];
      const isPlainInteger = /^-?\d+$/.test(token);
      if (isPlainInteger && String(Number(token)) !== token) {
        result += `"${BIGNUM_PREFIX}${token}${BIGNUM_SUFFIX}"`;
      } else {
        result += token;
      }
      i += token.length;
      continue;
    }
    result += ch;
    i++;
  }
  return result;
}

/** Reverses markBigIntegers' sentinel wrapping in already-serialized JSON text. */
function restoreBigIntegers(text: string): string {
  return text.replace(BIGNUM_SENTINEL_IN_TEXT, "$1");
}

/** Recursively converts sentinel-wrapped strings back to plain digit strings in a parsed JS value (for consumers that don't re-serialize through JSON.stringify, like CSV export). */
export function unwrapBigIntSentinels(value: unknown): unknown {
  if (typeof value === "string") {
    const m = BIGNUM_SENTINEL.exec(value);
    return m ? m[1] : value;
  }
  if (Array.isArray(value)) return value.map(unwrapBigIntSentinels);
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = unwrapBigIntSentinels(v);
    }
    return out;
  }
  return value;
}

/**
 * A drop-in replacement for JSON.parse that preserves large integer IDs
 * exactly instead of silently rounding them to the nearest representable
 * double. Falls back to a plain JSON.parse of the original text on any
 * failure, so error messages/positions always refer to what the user typed.
 */
export function safeJsonParse(text: string): unknown {
  try {
    return JSON.parse(markBigIntegers(text));
  } catch {
    return JSON.parse(text);
  }
}

/** A drop-in replacement for JSON.stringify that restores big-integer sentinels produced by safeJsonParse back into plain numeric literals. */
export function safeJsonStringify(value: unknown, indent?: number): string {
  return restoreBigIntegers(JSON.stringify(value, null, indent));
}

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
