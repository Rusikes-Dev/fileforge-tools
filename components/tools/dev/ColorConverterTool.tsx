"use client";

import { useState } from "react";
import CopyButton from "../CopyButton";

interface Rgb { r: number; g: number; b: number }

function hexToRgb(hex: string): Rgb | null {
  const clean = hex.trim().replace(/^#/, "");
  const full = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean;
  if (!/^[0-9a-fA-F]{6}$/.test(full)) return null;
  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  };
}

function rgbToHex({ r, g, b }: Rgb): string {
  const c = (n: number) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, "0");
  return `#${c(r)}${c(g)}${c(b)}`;
}

function rgbToHsl({ r, g, b }: Rgb): { h: number; s: number; l: number } {
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l: Math.round(l * 100) };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6;
  else if (max === gn) h = ((bn - rn) / d + 2) / 6;
  else h = ((rn - gn) / d + 4) / 6;
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToRgb(h: number, s: number, l: number): Rgb {
  const sn = s / 100, ln = l / 100;
  const c = (1 - Math.abs(2 * ln - 1)) * sn;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = ln - c / 2;
  let rp = 0, gp = 0, bp = 0;
  if (h < 60) [rp, gp, bp] = [c, x, 0];
  else if (h < 120) [rp, gp, bp] = [x, c, 0];
  else if (h < 180) [rp, gp, bp] = [0, c, x];
  else if (h < 240) [rp, gp, bp] = [0, x, c];
  else if (h < 300) [rp, gp, bp] = [x, 0, c];
  else [rp, gp, bp] = [c, 0, x];
  return { r: Math.round((rp + m) * 255), g: Math.round((gp + m) * 255), b: Math.round((bp + m) * 255) };
}

function parseRgbString(input: string): Rgb | null {
  const m = input.trim().match(/^(?:rgb\(\s*)?(\d{1,3})\s*[, ]\s*(\d{1,3})\s*[, ]\s*(\d{1,3})\s*\)?$/i);
  if (!m) return null;
  const [r, g, b] = [Number(m[1]), Number(m[2]), Number(m[3])];
  if (r > 255 || g > 255 || b > 255) return null;
  return { r, g, b };
}

function parseHslString(input: string): Rgb | null {
  const m = input.trim().match(/^(?:hsl\(\s*)?(\d{1,3})\s*[, ]\s*(\d{1,3})%?\s*[, ]\s*(\d{1,3})%?\s*\)?$/i);
  if (!m) return null;
  const [h, s, l] = [Number(m[1]), Number(m[2]), Number(m[3])];
  if (h > 360 || s > 100 || l > 100) return null;
  return hslToRgb(h, s, l);
}

function luminance({ r, g, b }: Rgb): number {
  const ch = (v: number) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * ch(r) + 0.7152 * ch(g) + 0.0722 * ch(b);
}

function contrastRatio(a: Rgb, b: Rgb): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

function wcagGrade(ratio: number): string {
  if (ratio >= 7) return "AAA";
  if (ratio >= 4.5) return "AA";
  if (ratio >= 3) return "AA large text only";
  return "fails";
}

export default function ColorConverterTool() {
  const [rgb, setRgb] = useState<Rgb>({ r: 15, g: 118, b: 110 });
  const [hexInput, setHexInput] = useState("#0f766e");
  const [rgbInput, setRgbInput] = useState("rgb(15, 118, 110)");
  const [hslInput, setHslInput] = useState("hsl(175, 77%, 26%)");
  const [error, setError] = useState<string | null>(null);

  function apply(next: Rgb) {
    const hsl = rgbToHsl(next);
    setRgb(next);
    setHexInput(rgbToHex(next));
    setRgbInput(`rgb(${next.r}, ${next.g}, ${next.b})`);
    setHslInput(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`);
    setError(null);
  }

  const hex = rgbToHex(rgb);
  const hsl = rgbToHsl(rgb);
  const hslStr = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
  const rgbStr = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;

  const field = (
    label: string,
    value: string,
    setValue: (v: string) => void,
    parse: (v: string) => Rgb | null,
    placeholder: string
  ) => (
    <div>
      <label htmlFor={`color-${label}`} className="label-base">
        {label}
      </label>
      <input
        id={`color-${label}`}
        type="text"
        className="input-base font-mono"
        value={value}
        placeholder={placeholder}
        onChange={(e) => {
          setValue(e.target.value);
          const parsed = parse(e.target.value);
          if (parsed) {
            apply(parsed);
            setValue(e.target.value); // keep exactly what the user typed in the active field
          } else if (e.target.value.trim()) {
            setError(null);
          }
        }}
        onBlur={(e) => {
          if (e.target.value.trim() && !parse(e.target.value)) {
            setError(`"${e.target.value}" isn't a valid ${label} value.`);
          }
        }}
      />
    </div>
  );

  const onWhite = contrastRatio(rgb, { r: 255, g: 255, b: 255 });
  const onBlack = contrastRatio(rgb, { r: 0, g: 0, b: 0 });

  return (
    <div className="space-y-5">
      <div className="settings flex flex-wrap items-center gap-5">
        <div
          className="h-28 w-28 shrink-0 rounded-3xl border border-ink-100 shadow-lg transition-colors duration-200"
          style={{ backgroundColor: hex, boxShadow: `0 18px 40px -16px ${hex}` }}
          aria-label={`Color preview: ${hex}`}
          role="img"
        />
        <div className="space-y-2">
          <label htmlFor="color-picker" className="label-base !mb-0">
            Pick a colour
          </label>
          <input
            id="color-picker"
            type="color"
            className="h-11 w-24"
            value={hex}
            onChange={(e) => {
              const parsed = hexToRgb(e.target.value);
              if (parsed) apply(parsed);
            }}
          />
        </div>
        <dl className="grid min-w-[12rem] flex-1 gap-2 text-sm sm:max-w-xs">
          {[
            { bg: "#ffffff", fg: "#101317", name: "White text", ratio: onWhite },
            { bg: "#000000", fg: "#ffffff", name: "Black text", ratio: onBlack },
          ].map((row) => (
            <div
              key={row.name}
              className="flex items-center justify-between gap-3 rounded-xl border border-ink-100 bg-surface px-3 py-2"
            >
              <dt className="flex items-center gap-2 font-medium text-ink-900">
                <span
                  aria-hidden
                  className="flex h-6 w-6 items-center justify-center rounded-md text-[11px] font-bold"
                  style={{ backgroundColor: hex, color: row.bg }}
                >
                  Aa
                </span>
                {row.name}
              </dt>
              <dd className="text-right text-xs tabular-nums text-ink-700">
                {row.ratio.toFixed(2)}:1 · {wcagGrade(row.ratio)}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {field("HEX", hexInput, setHexInput, hexToRgb, "#0f766e")}
        {field("RGB", rgbInput, setRgbInput, parseRgbString, "rgb(15, 118, 110)")}
        {field("HSL", hslInput, setHslInput, parseHslString, "hsl(175, 77%, 26%)")}
      </div>

      {error && (
        <p
          className="animate-pop-in rounded-xl border border-danger-200 border-l-4 border-l-danger-600 bg-danger-50 px-3.5 py-3 text-sm text-danger-700"
          role="alert"
        >
          {error}
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        <CopyButton text={hex} label={`Copy ${hex}`} className="btn-primary" />
        <CopyButton text={rgbStr} label="Copy RGB" />
        <CopyButton text={hslStr} label="Copy HSL" />
      </div>
    </div>
  );
}
