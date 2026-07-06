"use client";

import { useState } from "react";
import CopyButton from "../CopyButton";
import { locateJsonError, summarizeJson } from "@/lib/converters/json";
import { formatBytes } from "@/lib/utils";

export default function JsonTool({ mode }: { mode: "format" | "minify" | "validate" }) {
  const [input, setInput] = useState("");
  const [indent, setIndent] = useState(2);
  const [output, setOutput] = useState<string | null>(null);
  const [status, setStatus] = useState<{ ok: boolean; message: string; hint?: string } | null>(null);

  function run() {
    setOutput(null);
    try {
      const parsed: unknown = JSON.parse(input);
      if (mode === "validate") {
        const s = summarizeJson(parsed);
        const detail =
          s.rootType === "array"
            ? `an array with ${s.items} item${s.items === 1 ? "" : "s"}`
            : s.rootType === "object"
              ? `an object with ${s.keys} key${s.keys === 1 ? "" : "s"}`
              : `a ${s.rootType} value`;
        setStatus({ ok: true, message: `Valid JSON — ${detail}, nesting depth ${s.depth}.` });
      } else if (mode === "format") {
        setOutput(JSON.stringify(parsed, null, indent));
        setStatus({ ok: true, message: "Formatted." });
      } else {
        const minified = JSON.stringify(parsed);
        setOutput(minified);
        const before = new Blob([input]).size;
        const after = new Blob([minified]).size;
        const pct = before > 0 ? Math.round(((before - after) / before) * 100) : 0;
        setStatus({ ok: true, message: `Minified: ${formatBytes(before)} → ${formatBytes(after)} (${pct}% smaller).` });
      }
    } catch (err) {
      const e = locateJsonError(input, err);
      setStatus({
        ok: false,
        message: e.line ? `Invalid JSON at line ${e.line}, column ${e.column}: ${e.message}` : `Invalid JSON: ${e.message}`,
        hint: e.hint,
      });
    }
  }

  return (
    <div className="space-y-4">
      <label className="block text-sm">
        <span className="mb-1 block font-medium">JSON input</span>
        <textarea className="input-base h-52 font-mono text-xs" spellCheck={false} value={input}
          onChange={(e) => { setInput(e.target.value); setStatus(null); setOutput(null); }}
          placeholder='{"example": true}' />
      </label>
      <div className="flex flex-wrap items-center gap-3">
        {mode === "format" && (
          <label className="text-sm">
            <span className="mr-2 font-medium">Indentation</span>
            <select className="input-base w-auto" value={indent} onChange={(e) => setIndent(Number(e.target.value))}>
              <option value={2}>2 spaces</option>
              <option value={4}>4 spaces</option>
            </select>
          </label>
        )}
        <button type="button" className="btn-primary" disabled={!input.trim()} onClick={run}>
          {mode === "format" ? "Format" : mode === "minify" ? "Minify" : "Validate"}
        </button>
      </div>
      {status && (
        <div role="status"
          className={`rounded border px-3 py-2.5 text-sm ${status.ok ? "border-accent-100 bg-accent-50 text-accent-800" : "border-red-200 bg-red-50 text-red-800"}`}>
          <p>{status.message}</p>
          {status.hint && <p className="mt-1 text-xs">{status.hint}</p>}
        </div>
      )}
      {output !== null && (
        <div>
          <textarea readOnly aria-label="Result" className="input-base h-52 bg-ink-50 font-mono text-xs" value={output} />
          <div className="mt-2">
            <CopyButton text={output} />
          </div>
        </div>
      )}
    </div>
  );
}
