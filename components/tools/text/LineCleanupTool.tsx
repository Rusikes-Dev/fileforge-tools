"use client";

import { useState } from "react";
import CopyButton from "../CopyButton";
import {
  cleanWhitespace,
  removeDuplicateLines,
  sortLines,
  type SortMode,
} from "@/lib/converters/text";

export default function LineCleanupTool({ mode }: { mode: "dedupe" | "sort" | "spaces" }) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState<string | null>(null);
  const [summary, setSummary] = useState("");
  // dedupe options
  const [caseInsensitive, setCaseInsensitive] = useState(false);
  const [trim, setTrim] = useState(false);
  // sort options
  const [sortMode, setSortMode] = useState<SortMode>("az");
  const [sortCi, setSortCi] = useState(false);
  // whitespace options
  const [collapseSpaces, setCollapseSpaces] = useState(true);
  const [trimLines, setTrimLines] = useState(true);
  const [blankMode, setBlankMode] = useState<"keep" | "collapse" | "remove">("collapse");

  function run() {
    if (mode === "dedupe") {
      const { result, removed } = removeDuplicateLines(input, { caseInsensitive, trim });
      setOutput(result);
      setSummary(`${removed} duplicate line${removed === 1 ? "" : "s"} removed.`);
    } else if (mode === "sort") {
      setOutput(sortLines(input, sortMode, sortCi));
      setSummary(`${input.split("\n").length} lines sorted.`);
    } else {
      const result = cleanWhitespace(input, {
        collapseSpaces,
        trimLines,
        removeBlankLines: blankMode === "remove",
        collapseBlankLines: blankMode === "collapse",
      });
      setOutput(result);
      const removed = input.length - result.length;
      setSummary(`${removed} character${removed === 1 ? "" : "s"} removed.`);
    }
  }

  return (
    <div className="space-y-4">
      <label className="block text-sm">
        <span className="mb-1 block font-medium">Input</span>
        <textarea className="input-base h-44 font-mono text-xs" value={input}
          onChange={(e) => { setInput(e.target.value); setOutput(null); }}
          placeholder="Paste your lines here…" />
      </label>
      <fieldset className="flex flex-wrap items-center gap-4 text-sm">
        <legend className="sr-only">Options</legend>
        {mode === "dedupe" && (
          <>
            <label className="inline-flex items-center gap-2">
              <input type="checkbox" checked={caseInsensitive} onChange={(e) => setCaseInsensitive(e.target.checked)} className="accent-accent-700" />
              Ignore case
            </label>
            <label className="inline-flex items-center gap-2">
              <input type="checkbox" checked={trim} onChange={(e) => setTrim(e.target.checked)} className="accent-accent-700" />
              Ignore leading/trailing spaces
            </label>
          </>
        )}
        {mode === "sort" && (
          <>
            <label>
              <span className="mr-2 font-medium">Order</span>
              <select className="input-base w-auto" value={sortMode} onChange={(e) => setSortMode(e.target.value as SortMode)}>
                <option value="az">A → Z</option>
                <option value="za">Z → A</option>
                <option value="natural">Natural (numbers by value)</option>
                <option value="length">By length</option>
              </select>
            </label>
            <label className="inline-flex items-center gap-2">
              <input type="checkbox" checked={sortCi} onChange={(e) => setSortCi(e.target.checked)} className="accent-accent-700" />
              Ignore case
            </label>
          </>
        )}
        {mode === "spaces" && (
          <>
            <label className="inline-flex items-center gap-2">
              <input type="checkbox" checked={collapseSpaces} onChange={(e) => setCollapseSpaces(e.target.checked)} className="accent-accent-700" />
              Collapse repeated spaces
            </label>
            <label className="inline-flex items-center gap-2">
              <input type="checkbox" checked={trimLines} onChange={(e) => setTrimLines(e.target.checked)} className="accent-accent-700" />
              Trim line ends
            </label>
            <label>
              <span className="mr-2 font-medium">Blank lines</span>
              <select className="input-base w-auto" value={blankMode} onChange={(e) => setBlankMode(e.target.value as typeof blankMode)}>
                <option value="collapse">Collapse to one</option>
                <option value="remove">Remove all</option>
                <option value="keep">Keep</option>
              </select>
            </label>
          </>
        )}
      </fieldset>
      <button type="button" className="btn-primary" disabled={!input} onClick={run}>
        {mode === "dedupe" ? "Remove duplicates" : mode === "sort" ? "Sort lines" : "Clean text"}
      </button>
      {output !== null && (
        <div role="status">
          <p className="text-sm font-medium text-accent-800">{summary}</p>
          <textarea readOnly aria-label="Result" className="input-base mt-2 h-44 bg-ink-50 font-mono text-xs" value={output} />
          <div className="mt-2">
            <CopyButton text={output} />
          </div>
        </div>
      )}
    </div>
  );
}
