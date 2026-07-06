"use client";

import { useMemo, useState } from "react";
import {
  countCharacters,
  countLines,
  countParagraphs,
  countSentences,
  countWords,
  wordFrequency,
} from "@/lib/converters/text";

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded border border-ink-100 bg-ink-50 px-3 py-2.5">
      <dt className="text-xs text-ink-500">{label}</dt>
      <dd className="mt-0.5 text-lg font-semibold tabular-nums">{value}</dd>
    </div>
  );
}

export default function TextCounterTool({ mode }: { mode: "words" | "characters" | "statistics" }) {
  const [text, setText] = useState("");

  const stats = useMemo(() => {
    const words = countWords(text);
    const chars = countCharacters(text);
    return {
      words,
      chars,
      sentences: countSentences(text),
      paragraphs: countParagraphs(text),
      lines: countLines(text),
      readingMin: words / 220,
      speakingMin: words / 140,
      avgWordLen: words > 0 ? chars.withoutSpaces / words : 0,
      avgSentenceLen: countSentences(text) > 0 ? words / countSentences(text) : 0,
      frequency: mode === "statistics" ? wordFrequency(text) : [],
    };
  }, [text, mode]);

  const fmtTime = (min: number) => {
    if (min < 1 / 60) return "0 sec";
    if (min < 1) return `${Math.round(min * 60)} sec`;
    return `${Math.floor(min)} min ${Math.round((min % 1) * 60)} sec`;
  };

  return (
    <div>
      <label htmlFor="counter-input" className="sr-only">Text to analyze</label>
      <textarea
        id="counter-input"
        className="input-base h-56"
        placeholder="Paste or type your text here…"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <dl aria-live="polite" className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {mode === "characters" ? (
          <>
            <Stat label="Characters (with spaces)" value={stats.chars.withSpaces.toLocaleString()} />
            <Stat label="Characters (no spaces)" value={stats.chars.withoutSpaces.toLocaleString()} />
            <Stat label="Words" value={stats.words.toLocaleString()} />
            <Stat label="Lines" value={stats.lines.toLocaleString()} />
          </>
        ) : (
          <>
            <Stat label="Words" value={stats.words.toLocaleString()} />
            <Stat label="Characters" value={stats.chars.withSpaces.toLocaleString()} />
            <Stat label="Characters (no spaces)" value={stats.chars.withoutSpaces.toLocaleString()} />
            <Stat label="Sentences" value={stats.sentences.toLocaleString()} />
            <Stat label="Paragraphs" value={stats.paragraphs.toLocaleString()} />
            <Stat label="Reading time" value={fmtTime(stats.readingMin)} />
            {mode === "statistics" && (
              <>
                <Stat label="Speaking time" value={fmtTime(stats.speakingMin)} />
                <Stat label="Avg word length" value={stats.avgWordLen.toFixed(1)} />
                <Stat label="Avg words / sentence" value={stats.avgSentenceLen.toFixed(1)} />
              </>
            )}
          </>
        )}
      </dl>
      {mode === "statistics" && stats.frequency.length > 0 && (
        <div className="mt-6">
          <h2 className="text-base font-semibold">Most frequent words</h2>
          <ul className="mt-2 grid gap-1.5 sm:grid-cols-2">
            {stats.frequency.map((f) => (
              <li key={f.word} className="flex justify-between rounded border border-ink-100 px-3 py-1.5 text-sm">
                <span>{f.word}</span>
                <span className="font-mono text-ink-500">{f.count}×</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
