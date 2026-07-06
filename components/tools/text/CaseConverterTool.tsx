"use client";

import { useState } from "react";
import CopyButton from "../CopyButton";
import { convertCase, type CaseMode } from "@/lib/converters/text";

const modes: Array<{ mode: CaseMode; label: string }> = [
  { mode: "upper", label: "UPPERCASE" },
  { mode: "lower", label: "lowercase" },
  { mode: "title", label: "Title Case" },
  { mode: "sentence", label: "Sentence case" },
];

export default function CaseConverterTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  return (
    <div className="space-y-4">
      <label className="block text-sm">
        <span className="mb-1 block font-medium">Your text</span>
        <textarea className="input-base h-36" value={input} onChange={(e) => setInput(e.target.value)}
          placeholder="Paste text with the wrong casing…" />
      </label>
      <div className="flex flex-wrap gap-2">
        {modes.map(({ mode, label }) => (
          <button key={mode} type="button" className="btn-secondary" disabled={!input}
            onClick={() => setOutput(convertCase(input, mode))}>
            {label}
          </button>
        ))}
      </div>
      {output && (
        <div>
          <label className="block text-sm">
            <span className="mb-1 block font-medium">Result</span>
            <textarea readOnly className="input-base h-36 bg-ink-50" value={output} />
          </label>
          <div className="mt-2">
            <CopyButton text={output} />
          </div>
        </div>
      )}
    </div>
  );
}
