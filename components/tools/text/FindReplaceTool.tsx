"use client";

import { useMemo, useState } from "react";
import CopyButton from "../CopyButton";
import ErrorMessage from "../ErrorMessage";
import Switch from "@/components/ui/Switch";
import { countMatches, replaceAll } from "@/lib/converters/text";

export default function FindReplaceTool() {
  const [text, setText] = useState("");
  const [find, setFind] = useState("");
  const [replacement, setReplacement] = useState("");
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [wholeWord, setWholeWord] = useState(false);
  const [regex, setRegex] = useState(false);

  // Count and result are both derived from the current text, search term and
  // options, so toggling an option can't leave an out-of-date result on screen
  // (it used to be stored when "Replace all" was pressed and never refreshed).
  const { count, error, output } = useMemo(() => {
    if (!find) return { count: 0, error: null as string | null, output: null as string | null };
    const opts = { caseSensitive, wholeWord, regex };
    try {
      return {
        count: countMatches(text, find, opts),
        error: null,
        output: replaceAll(text, find, replacement, opts),
      };
    } catch (err) {
      return {
        count: 0,
        error: err instanceof Error ? `Invalid regular expression: ${err.message}` : "Invalid pattern.",
        output: null,
      };
    }
  }, [text, find, replacement, caseSensitive, wholeWord, regex]);

  return (
    <div className="space-y-5">
      <div>
        <label htmlFor="fr-text" className="label-base">
          Text
        </label>
        <textarea
          id="fr-text"
          className="input-base h-40"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste the text you want to edit…"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="fr-find" className="label-base">
            Find
          </label>
          <input
            id="fr-find"
            type="text"
            className="input-base"
            value={find}
            onChange={(e) => setFind(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="fr-replace" className="label-base">
            Replace with
          </label>
          <input
            id="fr-replace"
            type="text"
            className="input-base"
            value={replacement}
            onChange={(e) => setReplacement(e.target.value)}
          />
        </div>
      </div>

      <fieldset className="settings flex flex-wrap gap-x-8 gap-y-4">
        <legend className="sr-only">Matching options</legend>
        <Switch checked={caseSensitive} onChange={setCaseSensitive}>
          Case sensitive
        </Switch>
        <Switch checked={wholeWord && !regex} disabled={regex} onChange={setWholeWord}>
          Whole words only
        </Switch>
        <Switch checked={regex} onChange={setRegex}>
          Regular expression
        </Switch>
      </fieldset>

      <p
        role="status"
        className={`inline-flex rounded-full px-3 py-1.5 text-sm font-semibold tabular-nums ${
          find && count > 0 ? "bg-accent-50 text-accent-800" : "bg-ink-100 text-ink-700"
        }`}
      >
        {find
          ? `${count} match${count === 1 ? "" : "es"} found.`
          : "Enter a search term to see the match count."}
      </p>
      <ErrorMessage message={error} />

      {output !== null && text && (
        <div className="animate-fade-in-up">
          <label htmlFor="fr-output" className="label-base">
            Result
          </label>
          <textarea id="fr-output" readOnly className="input-base h-40 !bg-accent-50" value={output} />
          <div className="mt-3 flex flex-wrap gap-2">
            <CopyButton text={output} className="btn-primary" />
            <button
              type="button"
              className="btn-secondary"
              disabled={count === 0}
              onClick={() => {
                setText(output);
                setFind("");
              }}
            >
              Apply to text
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
