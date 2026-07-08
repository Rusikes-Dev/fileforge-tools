"use client";

import { useState } from "react";
import CopyButton from "../CopyButton";
import ErrorMessage from "../ErrorMessage";
import { csvToJson, jsonToCsv } from "@/lib/converters/csv";
import { locateJsonError, safeJsonParse, unwrapBigIntSentinels } from "@/lib/converters/json";
import { downloadBlob } from "@/lib/utils";

export default function CsvJsonTool({ direction }: { direction: "csv-to-json" | "json-to-csv" }) {
  const [input, setInput] = useState("");
  const [delimiter, setDelimiter] = useState(",");
  const [detectNumbers, setDetectNumbers] = useState(true);
  const [output, setOutput] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function addFile(file: File) {
    file.text().then(setInput).catch(() => setError("This file could not be read."));
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
    <div className="space-y-4">
      <label className="block text-sm">
        <span className="mb-1 block font-medium">{isCsvInput ? "CSV input" : "JSON input (array of objects)"}</span>
        <textarea className="input-base h-48 font-mono text-xs" spellCheck={false} value={input}
          onChange={(e) => { setInput(e.target.value); setOutput(null); setError(null); }}
          placeholder={isCsvInput ? "name,email\nJane,jane@example.com" : '[{"name":"Jane","email":"jane@example.com"}]'} />
      </label>
      <div className="flex flex-wrap items-center gap-4 text-sm">
        <label className="btn-secondary cursor-pointer">
          Load from file
          <input type="file" accept={isCsvInput ? ".csv,.tsv,text/csv" : ".json,application/json"} className="sr-only"
            onChange={(e) => e.target.files?.[0] && addFile(e.target.files[0])} />
        </label>
        <label>
          <span className="mr-2 font-medium">Delimiter</span>
          <select className="input-base w-auto" value={delimiter} onChange={(e) => setDelimiter(e.target.value)}>
            <option value=",">Comma</option>
            <option value=";">Semicolon</option>
            <option value="&#9;">Tab</option>
          </select>
        </label>
        {isCsvInput && (
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" checked={detectNumbers} onChange={(e) => setDetectNumbers(e.target.checked)} className="accent-accent-700" />
            Detect numbers
          </label>
        )}
        <button type="button" className="btn-primary" disabled={!input.trim()} onClick={run}>
          {isCsvInput ? "Convert to JSON" : "Convert to CSV"}
        </button>
      </div>
      <ErrorMessage message={error} />
      {output !== null && (
        <div role="status">
          <textarea readOnly aria-label="Result" className="input-base h-48 bg-ink-50 font-mono text-xs" value={output} />
          <div className="mt-2 flex gap-2">
            <CopyButton text={output} />
            <button type="button" className="btn-secondary"
              onClick={() => downloadBlob(new Blob([output], { type: isCsvInput ? "application/json" : "text/csv" }), isCsvInput ? "converted.json" : "converted.csv")}>
              Download file
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
