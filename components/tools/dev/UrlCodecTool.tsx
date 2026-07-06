"use client";

import { useState } from "react";
import CopyButton from "../CopyButton";
import ErrorMessage from "../ErrorMessage";

type Mode = "encodeComponent" | "encodeUri" | "decode";

export default function UrlCodecTool() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<Mode>("encodeComponent");
  const [output, setOutput] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function run() {
    setError(null);
    try {
      if (mode === "encodeComponent") setOutput(encodeURIComponent(input));
      else if (mode === "encodeUri") setOutput(encodeURI(input));
      else setOutput(decodeURIComponent(input.replace(/\+/g, "%20")));
    } catch {
      setError("This string contains an incomplete percent-encoding (a % not followed by two hex digits) and cannot be decoded.");
      setOutput(null);
    }
  }

  return (
    <div className="space-y-4">
      <label className="block text-sm">
        <span className="mb-1 block font-medium">Input</span>
        <textarea className="input-base h-32 font-mono text-xs" value={input}
          onChange={(e) => { setInput(e.target.value); setOutput(null); }}
          placeholder="Text or URL…" />
      </label>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Mode">
        {([["encodeComponent", "Encode component"], ["encodeUri", "Encode full URL"], ["decode", "Decode"]] as const).map(([v, label]) => (
          <button key={v} type="button" className={mode === v ? "btn-primary" : "btn-secondary"} aria-pressed={mode === v}
            onClick={() => { setMode(v); setOutput(null); }}>
            {label}
          </button>
        ))}
      </div>
      <button type="button" className="btn-primary" disabled={!input} onClick={run}>
        Convert
      </button>
      <ErrorMessage message={error} />
      {output !== null && (
        <div role="status">
          <textarea readOnly aria-label="Result" className="input-base h-32 bg-ink-50 font-mono text-xs" value={output} />
          <div className="mt-2">
            <CopyButton text={output} />
          </div>
        </div>
      )}
    </div>
  );
}
