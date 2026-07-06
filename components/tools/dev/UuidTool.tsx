"use client";

import { useState } from "react";
import CopyButton from "../CopyButton";
import { generateUuids } from "@/lib/converters/generators";

export default function UuidTool() {
  const [count, setCount] = useState(1);
  const [uppercase, setUppercase] = useState(false);
  const [noHyphens, setNoHyphens] = useState(false);
  const [uuids, setUuids] = useState<string[]>([]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-4 text-sm">
        <label>
          <span className="mb-1 block font-medium">How many</span>
          <input type="number" min={1} max={500} className="input-base w-24" value={count}
            onChange={(e) => setCount(Math.min(500, Math.max(1, Number(e.target.value))))} />
        </label>
        <label className="inline-flex items-center gap-2 pb-2">
          <input type="checkbox" checked={uppercase} onChange={(e) => setUppercase(e.target.checked)} className="accent-accent-700" />
          Uppercase
        </label>
        <label className="inline-flex items-center gap-2 pb-2">
          <input type="checkbox" checked={noHyphens} onChange={(e) => setNoHyphens(e.target.checked)} className="accent-accent-700" />
          Without hyphens
        </label>
      </div>
      <button type="button" className="btn-primary" onClick={() => setUuids(generateUuids(count, { uppercase, noHyphens }))}>
        Generate
      </button>
      {uuids.length > 0 && (
        <div role="status">
          <textarea readOnly aria-label="Generated UUIDs" className="input-base bg-ink-50 font-mono text-xs"
            style={{ height: `${Math.min(uuids.length, 12) * 1.5 + 2}rem` }} value={uuids.join("\n")} />
          <div className="mt-2">
            <CopyButton text={uuids.join("\n")} label={uuids.length === 1 ? "Copy UUID" : "Copy all"} />
          </div>
        </div>
      )}
    </div>
  );
}
