"use client";

import { useDeferredValue, useMemo, useState } from "react";
import CopyButton from "../CopyButton";
import Field from "@/components/ui/Field";
import Segmented from "@/components/ui/Segmented";
import Switch from "@/components/ui/Switch";
import {
  cleanWhitespace,
  removeDuplicateLines,
  sortLines,
  type SortMode,
} from "@/lib/converters/text";

type BlankMode = "keep" | "collapse" | "remove";

export default function LineCleanupTool({ mode }: { mode: "dedupe" | "sort" | "spaces" }) {
  const [input, setInput] = useState("");
  // dedupe options
  const [caseInsensitive, setCaseInsensitive] = useState(false);
  const [trim, setTrim] = useState(false);
  // sort options
  const [sortMode, setSortMode] = useState<SortMode>("az");
  const [sortCi, setSortCi] = useState(false);
  // whitespace options
  const [collapseSpaces, setCollapseSpaces] = useState(true);
  const [trimLines, setTrimLines] = useState(true);
  const [blankMode, setBlankMode] = useState<BlankMode>("collapse");

  // The result is *derived* from the input and every option, so changing an
  // option (or editing the text) always updates it. It used to be stored when
  // you pressed the button and then sat there stale after any later change.
  // useDeferredValue keeps typing responsive on very long lists.
  const deferred = useDeferredValue(input);

  const { output, summary } = useMemo(() => {
    if (!deferred) return { output: "", summary: "" };
    if (mode === "dedupe") {
      const { result, removed } = removeDuplicateLines(deferred, { caseInsensitive, trim });
      return { output: result, summary: `${removed} duplicate line${removed === 1 ? "" : "s"} removed.` };
    }
    if (mode === "sort") {
      return {
        output: sortLines(deferred, sortMode, sortCi),
        summary: `${deferred.split("\n").length} lines sorted.`,
      };
    }
    const result = cleanWhitespace(deferred, {
      collapseSpaces,
      trimLines,
      removeBlankLines: blankMode === "remove",
      collapseBlankLines: blankMode === "collapse",
    });
    const removed = deferred.length - result.length;
    return { output: result, summary: `${removed} character${removed === 1 ? "" : "s"} removed.` };
  }, [deferred, mode, caseInsensitive, trim, sortMode, sortCi, collapseSpaces, trimLines, blankMode]);

  return (
    <div className="space-y-5">
      <div>
        <label htmlFor="lc-input" className="label-base">
          Input
        </label>
        <textarea
          id="lc-input"
          className="input-base h-44 font-mono text-xs"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste your lines here…"
        />
      </div>

      <fieldset className="settings flex flex-wrap items-start gap-x-8 gap-y-5">
        <legend className="sr-only">Options</legend>
        {mode === "dedupe" && (
          <>
            <Switch checked={caseInsensitive} onChange={setCaseInsensitive}>
              Ignore case
            </Switch>
            <Switch checked={trim} onChange={setTrim}>
              Ignore leading/trailing spaces
            </Switch>
          </>
        )}
        {mode === "sort" && (
          <>
            <Field label="Order">
              <Segmented
                label="Sort order"
                value={sortMode}
                onChange={setSortMode}
                options={[
                  { value: "az", label: "A → Z" },
                  { value: "za", label: "Z → A" },
                  { value: "natural", label: "Natural" },
                  { value: "length", label: "By length" },
                ]}
              />
            </Field>
            <div className="pt-7">
              <Switch checked={sortCi} onChange={setSortCi}>
                Ignore case
              </Switch>
            </div>
          </>
        )}
        {mode === "spaces" && (
          <>
            <Switch checked={collapseSpaces} onChange={setCollapseSpaces}>
              Collapse repeated spaces
            </Switch>
            <Switch checked={trimLines} onChange={setTrimLines}>
              Trim line ends
            </Switch>
            <Field label="Blank lines">
              <Segmented
                label="Blank lines"
                value={blankMode}
                onChange={setBlankMode}
                options={[
                  { value: "collapse", label: "Collapse to one" },
                  { value: "remove", label: "Remove all" },
                  { value: "keep", label: "Keep" },
                ]}
              />
            </Field>
          </>
        )}
      </fieldset>

      {input && (
        <div className="animate-fade-in-up">
          <div className="mb-1.5 flex items-center justify-between gap-3">
            <label htmlFor="lc-output" className="text-sm font-semibold text-ink-900">
              Result
            </label>
            <span role="status" className="badge-accent tabular-nums">
              {summary}
            </span>
          </div>
          <textarea
            id="lc-output"
            readOnly
            className="input-base h-44 !bg-accent-50 font-mono text-xs"
            value={output}
          />
          <div className="mt-3 flex flex-wrap gap-2">
            <CopyButton text={output} className="btn-primary" />
            <button type="button" className="btn-secondary" onClick={() => setInput(output)}>
              Use result as input
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
