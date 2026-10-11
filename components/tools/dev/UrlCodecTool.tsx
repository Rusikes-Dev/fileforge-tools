"use client";

import { useState } from "react";
import CopyButton from "../CopyButton";
import ErrorMessage from "../ErrorMessage";
import Segmented from "@/components/ui/Segmented";

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
    <div className="space-y-5">
      <div>
        <label htmlFor="url-input" className="label-base">
          Input
        </label>
        <textarea
          id="url-input"
          className="input-base h-32 font-mono text-xs"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setOutput(null);
            setError(null);
          }}
          placeholder="Text or URL…"
        />
      </div>

      <Segmented
        label="Mode"
        value={mode}
        onChange={(v) => {
          setMode(v);
          setOutput(null);
          setError(null);
        }}
        options={[
          { value: "encodeComponent", label: "Encode component" },
          { value: "encodeUri", label: "Encode full URL" },
          { value: "decode", label: "Decode" },
        ]}
      />

      <div>
        <button type="button" className="btn-primary btn-lg" disabled={!input} onClick={run}>
          Convert
        </button>
      </div>

      <ErrorMessage message={error} />

      {output !== null && (
        <div className="animate-fade-in-up">
          <label htmlFor="url-output" className="label-base">
            Result
          </label>
          <textarea
            id="url-output"
            readOnly
            className="input-base h-32 !bg-accent-50 font-mono text-xs"
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
