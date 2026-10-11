"use client";

import { useState } from "react";
import CopyButton from "../CopyButton";
import { AlertIcon, CheckIcon } from "@/components/common/Icon";
import Segmented from "@/components/ui/Segmented";
import { locateJsonError, safeJsonParse, safeJsonStringify, summarizeJson } from "@/lib/converters/json";
import { formatBytes } from "@/lib/utils";

export default function JsonTool({ mode }: { mode: "format" | "minify" | "validate" }) {
  const [input, setInput] = useState("");
  const [indent, setIndent] = useState<"2" | "4">("2");
  const [output, setOutput] = useState<string | null>(null);
  const [status, setStatus] = useState<{ ok: boolean; message: string; hint?: string } | null>(null);

  // Anything the result depends on goes through here, so a result is never left
  // on screen after the input or an option has changed underneath it.
  function invalidate() {
    setStatus(null);
    setOutput(null);
  }

  function run() {
    setOutput(null);
    try {
      const parsed: unknown = safeJsonParse(input);
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
        setOutput(safeJsonStringify(parsed, Number(indent)));
        setStatus({ ok: true, message: "Formatted." });
      } else {
        const minified = safeJsonStringify(parsed);
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
    <div className="space-y-5">
      <div>
        <label htmlFor="json-input" className="label-base">
          JSON input
        </label>
        <textarea
          id="json-input"
          className="input-base h-52 font-mono text-xs"
          spellCheck={false}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            invalidate();
          }}
          placeholder='{"example": true}'
        />
      </div>

      <div className="flex flex-wrap items-center gap-4">
        {mode === "format" && (
          <Segmented
            label="Indentation"
            value={indent}
            onChange={(v) => {
              setIndent(v);
              invalidate();
            }}
            options={[
              { value: "2", label: "2 spaces" },
              { value: "4", label: "4 spaces" },
            ]}
          />
        )}
        <button type="button" className="btn-primary btn-lg" disabled={!input.trim()} onClick={run}>
          {mode === "format" ? "Format" : mode === "minify" ? "Minify" : "Validate"}
        </button>
      </div>

      {status && (
        <div
          role="status"
          className={`animate-pop-in flex items-start gap-2.5 rounded-2xl border px-4 py-3 text-sm ${
            status.ok
              ? "border-accent-100 bg-accent-50 text-accent-800"
              : "border-danger-200 border-l-4 border-l-danger-600 bg-danger-50 text-danger-700"
          }`}
        >
          {status.ok ? (
            <CheckIcon className="mt-0.5 h-4 w-4 shrink-0" />
          ) : (
            <AlertIcon className="mt-0.5 h-4 w-4 shrink-0" />
          )}
          <div>
            <p className="font-medium">{status.message}</p>
            {status.hint && <p className="mt-1 text-xs">{status.hint}</p>}
          </div>
        </div>
      )}

      {output !== null && (
        <div className="animate-fade-in-up">
          <label htmlFor="json-output" className="label-base">
            Result
          </label>
          <textarea
            id="json-output"
            readOnly
            className="input-base h-52 !bg-accent-50 font-mono text-xs"
            value={output}
          />
          <div className="mt-3">
            <CopyButton text={output} className="btn-primary" />
          </div>
        </div>
      )}
    </div>
  );
}
