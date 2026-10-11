"use client";

import { useState } from "react";
import CopyButton from "../CopyButton";
import { RefreshIcon } from "@/components/common/Icon";
import Field from "@/components/ui/Field";
import NumberField from "@/components/ui/NumberField";
import Switch from "@/components/ui/Switch";
import { generateUuids } from "@/lib/converters/generators";

export default function UuidTool() {
  const [count, setCount] = useState(1);
  const [uppercase, setUppercase] = useState(false);
  const [noHyphens, setNoHyphens] = useState(false);
  // The raw IDs are kept in their canonical form and styled at render time, so
  // flipping "Uppercase" or "Without hyphens" restyles what is already on screen
  // instead of leaving a list that no longer matches the switches.
  const [raw, setRaw] = useState<string[]>([]);

  const uuids = raw.map((u) => {
    const v = noHyphens ? u.replace(/-/g, "") : u;
    return uppercase ? v.toUpperCase() : v;
  });

  return (
    <div className="space-y-5">
      <div className="settings flex flex-wrap items-end gap-x-8 gap-y-4">
        <Field label="How many" htmlFor="uuid-count" className="w-28">
          {/* Typing "5" used to give 15: each keystroke was clamped to a minimum
              of 1 and the next digit was appended to it. */}
          <NumberField id="uuid-count" min={1} max={500} value={count} onChange={setCount} />
        </Field>
        <div className="pb-2.5">
          <Switch checked={uppercase} onChange={setUppercase}>
            Uppercase
          </Switch>
        </div>
        <div className="pb-2.5">
          <Switch checked={noHyphens} onChange={setNoHyphens}>
            Without hyphens
          </Switch>
        </div>
      </div>

      <button type="button" className="btn-primary btn-lg" onClick={() => setRaw(generateUuids(count))}>
        <RefreshIcon className="h-4 w-4" />
        Generate
      </button>

      {uuids.length > 0 && (
        <div className="animate-fade-in-up">
          <label htmlFor="uuid-output" className="label-base">
            Generated UUID{uuids.length === 1 ? "" : "s"}
          </label>
          <textarea
            id="uuid-output"
            readOnly
            className="input-base !bg-accent-50 font-mono text-xs"
            style={{ height: `${Math.min(uuids.length, 12) * 1.5 + 2}rem` }}
            value={uuids.join("\n")}
          />
          <div className="mt-3">
            <CopyButton
              text={uuids.join("\n")}
              label={uuids.length === 1 ? "Copy UUID" : "Copy all"}
              className="btn-primary"
            />
          </div>
        </div>
      )}
    </div>
  );
}
