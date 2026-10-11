"use client";

import { useState } from "react";
import CopyButton from "../CopyButton";
import ErrorMessage from "../ErrorMessage";
import { RefreshIcon } from "@/components/common/Icon";
import Field from "@/components/ui/Field";
import Progress from "@/components/ui/Progress";
import Range from "@/components/ui/Range";
import Switch from "@/components/ui/Switch";
import { estimateEntropyBits, generatePassword, type PasswordOptions } from "@/lib/converters/generators";

const TOGGLES: Array<{ key: Exclude<keyof PasswordOptions, "length">; label: string }> = [
  { key: "lowercase", label: "Lowercase (a–z)" },
  { key: "uppercase", label: "Uppercase (A–Z)" },
  { key: "digits", label: "Digits (0–9)" },
  { key: "symbols", label: "Symbols (!@#…)" },
  { key: "excludeAmbiguous", label: "Exclude ambiguous (l, 1, O, 0)" },
];

/** Colour digits and symbols so a long password is easier to read and copy by eye. */
function ColoredPassword({ value }: { value: string }) {
  return (
    <>
      {Array.from(value).map((ch, i) => (
        <span
          key={i}
          className={
            /[0-9]/.test(ch)
              ? "text-[rgb(var(--g2))]"
              : /[A-Za-z]/.test(ch)
                ? ""
                : "text-[rgb(var(--aurora-4))] dark:text-[rgb(var(--aurora-4))]"
          }
        >
          {ch}
        </span>
      ))}
    </>
  );
}

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

  function generate(next: PasswordOptions) {
    setError(null);
    try {
      setPassword(generatePassword(next));
    } catch (err) {
      setPassword("");
      setError(err instanceof Error ? err.message : "Generation failed.");
    }
  }

  // Once a password is showing, changing a setting regenerates it, so what is
  // on screen always matches the length and character sets selected above.
  function update(partial: Partial<PasswordOptions>) {
    const next = { ...opts, ...partial };
    setOpts(next);
    if (password || error) generate(next);
  }

  const bits = estimateEntropyBits(opts);
  const strength = bits >= 100 ? "very strong" : bits >= 75 ? "strong" : bits >= 50 ? "moderate" : "weak";

  return (
    <div className="space-y-5">
      <div className="settings space-y-5">
        <Field label="Length" htmlFor="pw-length" value={`${opts.length} characters`}>
          <Range
            id="pw-length"
            min={8}
            max={64}
            value={opts.length}
            onChange={(length) => update({ length })}
            valueText={`${opts.length} characters`}
          />
        </Field>
        <fieldset className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
          <legend className="sr-only">Character sets</legend>
          {TOGGLES.map(({ key, label }) => (
            <Switch key={key} checked={Boolean(opts[key])} onChange={(v) => update({ [key]: v })}>
              {label}
            </Switch>
          ))}
        </fieldset>

        <div>
          <div className="mb-1.5 flex items-center justify-between text-sm">
            <span className="font-semibold text-ink-900">Estimated strength</span>
            <span className="font-medium tabular-nums text-ink-700">
              ~{bits} bits · {strength}
            </span>
          </div>
          <Progress value={Math.min(100, (bits / 128) * 100)} label={`Password strength: ${strength}`} />
        </div>
      </div>

      <button type="button" className="btn-primary btn-lg" onClick={() => generate(opts)}>
        <RefreshIcon className="h-4 w-4" />
        Generate password
      </button>

      <ErrorMessage message={error} />

      {password && (
        <div
          role="status"
          className="animate-pop-in rounded-3xl border border-accent-100 bg-accent-50 p-4 sm:p-5"
        >
          <output className="block break-all rounded-2xl border border-accent-100 bg-surface px-4 py-3 font-mono text-xl font-semibold tracking-wide text-ink-900">
            <ColoredPassword value={password} />
          </output>
          <div className="mt-4 flex flex-wrap gap-2">
            <CopyButton text={password} label="Copy password" className="btn-primary" />
            <button type="button" className="btn-secondary" onClick={() => generate(opts)}>
              <RefreshIcon className="h-4 w-4" />
              Regenerate
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
