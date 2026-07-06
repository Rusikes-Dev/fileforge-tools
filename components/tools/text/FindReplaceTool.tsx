"use client";

import { useMemo, useState } from "react";
import CopyButton from "../CopyButton";
import ErrorMessage from "../ErrorMessage";
import { countMatches, replaceAll } from "@/lib/converters/text";

export default function FindReplaceTool() {
  const [text, setText] = useState("");
  const [find, setFind] = useState("");
  const [replacement, setReplacement] = useState("");
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [wholeWord, setWholeWord] = useState(false);
  const [regex, setRegex] = useState(false);
  const [output, setOutput] = useState<string | null>(null);

  const opts = { caseSensitive, wholeWord, regex };

  const matchInfo = useMemo(() => {
    if (!find) return { count: 0, error: null as string | null };
    try {
      return { count: countMatches(text, find, opts), error: null };
    } catch (err) {
      return { count: 0, error: err instanceof Error ? `Invalid regular expression: ${err.message}` : "Invalid pattern." };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, find, caseSensitive, wholeWord, regex]);

  function run() {
    try {
      setOutput(replaceAll(text, find, replacement, opts));
    } catch {
      // error already shown via matchInfo
    }
  }

  return (
    <div className="space-y-4">
      <label className="block text-sm">
        <span className="mb-1 block font-medium">Text</span>
        <textarea className="input-base h-40" value={text} onChange={(e) => { setText(e.target.value); setOutput(null); }} />
      </label>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-1 block font-medium">Find</span>
          <input type="text" className="input-base" value={find} onChange={(e) => { setFind(e.target.value); setOutput(null); }} />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium">Replace with</span>
          <input type="text" className="input-base" value={replacement} onChange={(e) => setReplacement(e.target.value)} />
        </label>
      </div>
      <fieldset className="flex flex-wrap gap-4 text-sm">
        <legend className="sr-only">Matching options</legend>
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" checked={caseSensitive} onChange={(e) => setCaseSensitive(e.target.checked)} className="accent-accent-700" />
          Case sensitive
        </label>
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" checked={wholeWord} disabled={regex} onChange={(e) => setWholeWord(e.target.checked)} className="accent-accent-700" />
          Whole words only
        </label>
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" checked={regex} onChange={(e) => setRegex(e.target.checked)} className="accent-accent-700" />
          Regular expression
        </label>
      </fieldset>
      <p className="text-sm text-ink-700" aria-live="polite">
        {find ? `${matchInfo.count} match${matchInfo.count === 1 ? "" : "es"} found.` : "Enter a search term to see the match count."}
      </p>
      <ErrorMessage message={matchInfo.error} />
      <button type="button" className="btn-primary" disabled={!find || !!matchInfo.error || matchInfo.count === 0} onClick={run}>
        Replace all
      </button>
      {output !== null && (
        <div role="status">
          <textarea readOnly aria-label="Result" className="input-base h-40 bg-ink-50" value={output} />
          <div className="mt-2">
            <CopyButton text={output} />
          </div>
        </div>
      )}
    </div>
  );
}
