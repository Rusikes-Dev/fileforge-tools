"use client";

import { useState } from "react";
import CopyButton from "../CopyButton";
import ErrorMessage from "../ErrorMessage";
import { DownloadIcon, UploadIcon } from "@/components/common/Icon";
import Field from "@/components/ui/Field";
import Segmented from "@/components/ui/Segmented";
import Switch from "@/components/ui/Switch";
import { csvToJson, jsonToCsv } from "@/lib/converters/csv";
import { locateJsonError, safeJsonParse, unwrapBigIntSentinels } from "@/lib/converters/json";
import { downloadBlob } from "@/lib/utils";

type Delimiter = "," | ";" | "\t";

export default function CsvJsonTool({ direction }: { direction: "csv-to-json" | "json-to-csv" }) {
  const [input, setInput] = useState("");
  const [delimiter, setDelimiter] = useState<Delimiter>(",");
  const [detectNumbers, setDetectNumbers] = useState(true);
  const [output, setOutput] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Drop any previous result when the input or an option changes.
  function invalidate() {
    setOutput(null);
    setError(null);
  }

  function addFile(file: File) {
    file
      .text()
      .then((t) => {
        setInput(t);
        invalidate();
      })
      .catch(() => setError("This file could not be read."));
  }

  function run() {
    setError(null);
    setOutput(null);
    try {
      if (direction === "csv-to-json") {
        const rows = csvToJson(input, { delimiter, detectNumbers });
        setOutput(JSON.stringify(rows, null, 2));
      } else {
        let parsed: unknown;
        try {
          parsed = unwrapBigIntSentinels(safeJsonParse(input));
        } catch (err) {
          const e = locateJsonError(input, err);
          throw new Error(e.line ? `Invalid JSON at line ${e.line}: ${e.message}` : `Invalid JSON: ${e.message}`);
        }
        setOutput(jsonToCsv(parsed, delimiter));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Conversion failed.");
    }
  }

  const isCsvInput = direction === "csv-to-json";

  return (
    <div className="space-y-5">
      <div>
        <label htmlFor="cj-input" className="label-base">
          {isCsvInput ? "CSV input" : "JSON input (array of objects)"}
        </label>
        <textarea
          id="cj-input"
          className="input-base h-48 font-mono text-xs"
          spellCheck={false}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            invalidate();
          }}
          placeholder={isCsvInput ? "name,email\nJane,jane@example.com" : '[{"name":"Jane","email":"jane@example.com"}]'}
        />
      </div>

      <div className="settings flex flex-wrap items-end gap-x-6 gap-y-4">
        <label className="btn-secondary cursor-pointer focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[rgb(var(--color-focus))]">
          <UploadIcon className="h-4 w-4" />
          Load from file
          <input
            type="file"
            accept={isCsvInput ? ".csv,.tsv,text/csv" : ".json,application/json"}
            className="sr-only"
            onChange={(e) => e.target.files?.[0] && addFile(e.target.files[0])}
          />
        </label>
        <Field label="Delimiter">
          <Segmented
            label="Delimiter"
            value={delimiter}
            onChange={(v) => {
              setDelimiter(v);
              invalidate();
            }}
            options={[
              { value: ",", label: "Comma" },
              { value: ";", label: "Semicolon" },
              { value: "\t", label: "Tab" },
            ]}
          />
        </Field>
        {isCsvInput && (
          <div className="pb-2">
            <Switch
              checked={detectNumbers}
              onChange={(v) => {
                setDetectNumbers(v);
                invalidate();
              }}
            >
              Detect numbers
            </Switch>
          </div>
        )}
      </div>

      <button type="button" className="btn-primary btn-lg" disabled={!input.trim()} onClick={run}>
        {isCsvInput ? "Convert to JSON" : "Convert to CSV"}
      </button>

      <ErrorMessage message={error} />

      {output !== null && (
        <div className="animate-fade-in-up">
          <label htmlFor="cj-output" className="label-base">
            Result
          </label>
          <textarea
            id="cj-output"
            readOnly
            className="input-base h-48 !bg-accent-50 font-mono text-xs"
            value={output}
          />
          <div className="mt-3 flex flex-wrap gap-2">
            <CopyButton text={output} className="btn-primary" />
            <button
              type="button"
              className="btn-secondary"
              onClick={() =>
                downloadBlob(
                  new Blob([output], { type: isCsvInput ? "application/json" : "text/csv" }),
                  isCsvInput ? "converted.json" : "converted.csv"
                )
              }
            >
              <DownloadIcon className="h-4 w-4" />
              Download file
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
