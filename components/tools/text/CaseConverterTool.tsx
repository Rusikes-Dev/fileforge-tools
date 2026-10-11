"use client";

import { useState } from "react";
import CopyButton from "../CopyButton";
import Segmented from "@/components/ui/Segmented";
import { convertCase, type CaseMode } from "@/lib/converters/text";

const modes: Array<{ value: CaseMode; label: string }> = [
  { value: "upper", label: "UPPERCASE" },
  { value: "lower", label: "lowercase" },
  { value: "title", label: "Title Case" },
  { value: "sentence", label: "Sentence case" },
];

export default function CaseConverterTool() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<CaseMode>("title");

  // Derived, not stored: the result is always the current text in the current
  // case, so editing the input (or switching case) can never leave a stale
  // result on screen.
  const output = input ? convertCase(input, mode) : "";

  return (
    <div className="space-y-5">
      <div>
        <label htmlFor="case-input" className="label-base">
          Your text
        </label>
        <textarea
          id="case-input"
          className="input-base h-36"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste text with the wrong casing…"
        />
      </div>

      <Segmented label="Convert to" value={mode} onChange={setMode} options={modes} />

      {output && (
        <div className="animate-fade-in-up">
          <label htmlFor="case-output" className="label-base">
            Result
          </label>
          <textarea
            id="case-output"
            readOnly
            className="input-base h-36 !bg-accent-50"
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
