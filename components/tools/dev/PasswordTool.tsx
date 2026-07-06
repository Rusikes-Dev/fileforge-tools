"use client";

import { useState } from "react";
import CopyButton from "../CopyButton";
import ErrorMessage from "../ErrorMessage";
import { estimateEntropyBits, generatePassword, type PasswordOptions } from "@/lib/converters/generators";

export default function PasswordTool() {
  const [opts, setOpts] = useState<PasswordOptions>({
    length: 16,
    lowercase: true,
    uppercase: true,
    digits: true,
    symbols: true,
    excludeAmbiguous: false,
  });
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  function run() {
    setError(null);
    try {
      setPassword(generatePassword(opts));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation failed.");
    }
  }

  const bits = estimateEntropyBits(opts);
  const strength = bits >= 100 ? "very strong" : bits >= 75 ? "strong" : bits >= 50 ? "moderate" : "weak";

  const toggle = (key: keyof PasswordOptions) => (
    <label key={key} className="inline-flex items-center gap-2 text-sm capitalize">
      <input type="checkbox" checked={opts[key] as boolean}
        onChange={(e) => setOpts({ ...opts, [key]: e.target.checked })} className="accent-accent-700" />
      {key === "excludeAmbiguous" ? "Exclude ambiguous (l, 1, O, 0)" : key}
    </label>
  );

  return (
    <div className="space-y-4">
      <label className="block text-sm">
        <span className="mb-1 block font-medium">Length: {opts.length}</span>
        <input type="range" min={8} max={64} value={opts.length}
          onChange={(e) => setOpts({ ...opts, length: Number(e.target.value) })} className="w-64 max-w-full accent-accent-700" />
      </label>
      <div className="flex flex-wrap gap-x-5 gap-y-2">
        {(["lowercase", "uppercase", "digits", "symbols", "excludeAmbiguous"] as const).map(toggle)}
      </div>
      <p className="text-sm text-ink-500">
        Estimated strength: about {bits} bits of entropy ({strength}).
      </p>
      <button type="button" className="btn-primary" onClick={run}>
        Generate password
      </button>
      <ErrorMessage message={error} />
      {password && (
        <div role="status" className="rounded border border-accent-100 bg-accent-50 p-4">
          <output className="block break-all font-mono text-lg">{password}</output>
          <div className="mt-3 flex gap-2">
            <CopyButton text={password} label="Copy password" />
            <button type="button" className="btn-secondary" onClick={run}>
              Regenerate
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
