/** UUID and password generation using the Web Crypto API. */

export function generateUuids(count: number, opts: { uppercase?: boolean; noHyphens?: boolean } = {}): string[] {
  const out: string[] = [];
  for (let i = 0; i < count; i++) {
    let id: string;
    if (typeof crypto.randomUUID === "function") {
      id = crypto.randomUUID();
    } else {
      const bytes = new Uint8Array(16);
      crypto.getRandomValues(bytes);
      bytes[6] = (bytes[6] & 0x0f) | 0x40;
      bytes[8] = (bytes[8] & 0x3f) | 0x80;
      const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
      id = `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
    }
    if (opts.noHyphens) id = id.replace(/-/g, "");
    if (opts.uppercase) id = id.toUpperCase();
    out.push(id);
  }
  return out;
}

export interface PasswordOptions {
  length: number;
  lowercase: boolean;
  uppercase: boolean;
  digits: boolean;
  symbols: boolean;
  excludeAmbiguous: boolean;
}

const SETS = {
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  digits: "0123456789",
  symbols: "!@#$%^&*()-_=+[]{};:,.?/",
};
const AMBIGUOUS = new Set("l1IO0o|`'\"");

function randomInt(maxExclusive: number): number {
  // Rejection sampling to avoid modulo bias.
  const range = 256 - (256 % maxExclusive);
  const buf = new Uint8Array(1);
  let v: number;
  do {
    crypto.getRandomValues(buf);
    v = buf[0];
  } while (v >= range);
  return v % maxExclusive;
}

export function generatePassword(opts: PasswordOptions): string {
  const activeSets = (Object.keys(SETS) as Array<keyof typeof SETS>)
    .filter((k) => opts[k])
    .map((k) =>
      opts.excludeAmbiguous ? [...SETS[k]].filter((c) => !AMBIGUOUS.has(c)).join("") : SETS[k]
    )
    .filter((s) => s.length > 0);
  if (activeSets.length === 0) throw new Error("Select at least one character set.");
  const length = Math.max(opts.length, activeSets.length);
  const all = activeSets.join("");
  const chars: string[] = [];
  // Guarantee one character from each enabled set.
  for (const set of activeSets) chars.push(set[randomInt(set.length)]);
  while (chars.length < length) chars.push(all[randomInt(all.length)]);
  // Fisher–Yates shuffle with crypto randomness.
  for (let i = chars.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return chars.join("");
}

export function estimateEntropyBits(opts: PasswordOptions): number {
  let poolSize = 0;
  (Object.keys(SETS) as Array<keyof typeof SETS>).forEach((k) => {
    if (!opts[k]) return;
    poolSize += opts.excludeAmbiguous
      ? [...SETS[k]].filter((c) => !AMBIGUOUS.has(c)).length
      : SETS[k].length;
  });
  if (poolSize === 0) return 0;
  return Math.round(opts.length * Math.log2(poolSize));
}
