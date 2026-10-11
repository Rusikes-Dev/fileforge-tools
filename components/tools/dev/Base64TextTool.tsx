"use client";

import { useState } from "react";
import CopyButton from "../CopyButton";
import ErrorMessage from "../ErrorMessage";

function encodeUtf8(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary);
}

function decodeUtf8(b64: string): string {
  const binary = atob(b64.replace(/\s+/g, ""));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
}

export default function Base64TextTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function run(mode: "encode" | "decode") {
    setError(null);
    setOutput(null);
    try {
      setOutput(mode === "encode" ? encodeUtf8(input) : decodeUtf8(input));
    } catch {
      setError("This is not valid Base64 — check that the string is complete and contains only Base64 characters.");
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <label htmlFor="b64t-input" className="label-base">
          Input
        </label>
        <textarea
          id="b64t-input"
          className="input-base h-36 font-mono text-xs"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setOutput(null);
            setError(null);
          }}
          placeholder="Text to encode, or Base64 to decode…"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" className="btn-primary btn-lg" disabled={!input} onClick={() => run("encode")}>
          Encode
        </button>
        <button type="button" className="btn-secondary btn-lg" disabled={!input} onClick={() => run("decode")}>
          Decode
        </button>
      </div>

      <ErrorMessage message={error} />

      {output !== null && (
        <div className="animate-fade-in-up">
          <label htmlFor="b64t-output" className="label-base">
            Result
          </label>
          <textarea
            id="b64t-output"
            readOnly
            className="input-base h-36 !bg-accent-50 font-mono text-xs"
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
