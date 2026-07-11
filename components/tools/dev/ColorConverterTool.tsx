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
    <label className="block text-sm">
      <span className="mb-1 block font-medium">{label}</span>
      <input
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
    </label>
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        <div
          className="h-24 w-24 shrink-0 rounded border border-ink-200"
          style={{ backgroundColor: hex }}
          aria-label={`Color preview: ${hex}`}
          role="img"
        />
        <input
          type="color"
          className="h-10 w-16 cursor-pointer rounded border border-ink-200"
          value={hex}
          onChange={(e) => {
            const parsed = hexToRgb(e.target.value);
            if (parsed) apply(parsed);
          }}
          aria-label="Pick a color"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {field("HEX", hexInput, setHexInput, hexToRgb, "#0f766e")}
        {field("RGB", rgbInput, setRgbInput, parseRgbString, "rgb(15, 118, 110)")}
        {field("HSL", hslInput, setHslInput, parseHslString, "hsl(175, 77%, 26%)")}
      </div>
      {error && (
        <p className="rounded border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-800" role="alert">
          {error}
        </p>
      )}
      <div className="flex flex-wrap gap-2">
        <CopyButton text={hex} label={`Copy ${hex}`} />
        <CopyButton text={rgbStr} label="Copy RGB" />
        <CopyButton text={hslStr} label="Copy HSL" />
      </div>
    </div>
  );
}
