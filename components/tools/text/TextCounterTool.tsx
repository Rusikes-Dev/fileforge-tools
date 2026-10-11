"use client";

import { useEffect, useMemo, useState } from "react";
import {
  countCharacters,
  countLines,
  countParagraphs,
  countSentences,
  countWords,
  wordFrequency,
} from "@/lib/converters/text";

function Stat({ label, value, featured = false }: { label: string; value: string | number; featured?: boolean }) {
  return (
    <div
      className={`rounded-2xl border px-4 py-3 shadow-xs transition-transform duration-200 hover:-translate-y-0.5 ${
        featured ? "border-accent-100 bg-accent-50" : "border-ink-100 bg-surface"
      }`}
    >
      <dt className="text-xs font-medium text-ink-500">{label}</dt>
      <dd
        className={`mt-1 font-extrabold tabular-nums ${
          featured ? "text-gradient text-3xl" : "text-xl text-ink-900"
        }`}
      >
        {value}
      </dd>
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

  // The numbers update on every keystroke, which is right for sighted users but
  // would make a screen reader recite them continuously. Announce one short
  // summary once typing pauses instead.
  const [announcement, setAnnouncement] = useState("");
  useEffect(() => {
    if (!text) {
      setAnnouncement("");
      return;
    }
    const t = setTimeout(() => {
      setAnnouncement(
        mode === "characters"
          ? `${stats.chars.withSpaces.toLocaleString()} characters, ${stats.words.toLocaleString()} words.`
          : `${stats.words.toLocaleString()} words, ${stats.chars.withSpaces.toLocaleString()} characters.`
      );
    }, 1200);
    return () => clearTimeout(t);
  }, [text, mode, stats.words, stats.chars.withSpaces]);

  return (
    <div>
      <label htmlFor="counter-input" className="sr-only">
        Text to analyze
      </label>
      <textarea
        id="counter-input"
        className="input-base h-56 text-base"
        placeholder="Paste or type your text here…"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="mt-2 flex items-center justify-between gap-3">
        <p className="hint-text !mt-0">Counted live as you type — nothing leaves your browser.</p>
        {text && (
          <button type="button" className="btn-ghost btn-sm" onClick={() => setText("")}>
            Clear
          </button>
        )}
      </div>
      <p role="status" className="sr-only">
        {announcement}
      </p>

      <dl className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {mode === "characters" ? (
          <>
            <Stat featured label="Characters (with spaces)" value={stats.chars.withSpaces.toLocaleString()} />
            <Stat label="Characters (no spaces)" value={stats.chars.withoutSpaces.toLocaleString()} />
            <Stat label="Words" value={stats.words.toLocaleString()} />
            <Stat label="Lines" value={stats.lines.toLocaleString()} />
          </>
        ) : (
          <>
            <Stat featured label="Words" value={stats.words.toLocaleString()} />
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
        <div className="mt-8">
          <h2 className="text-lg font-bold">Most frequent words</h2>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {stats.frequency.map((f, i) => {
              const max = stats.frequency[0].count || 1;
              return (
                <li
                  key={f.word}
                  className="relative overflow-hidden rounded-xl border border-ink-100 bg-surface px-3 py-2 text-sm"
                >
                  {/* Bar behind the row, proportional to the most common word. */}
                  <span
                    aria-hidden
                    className="absolute inset-y-0 left-0 bg-accent-100"
                    style={{ width: `${(f.count / max) * 100}%`, opacity: 0.7 - i * 0.03 }}
                  />
                  <span className="relative flex justify-between gap-3">
                    <span className="truncate font-medium text-ink-900">{f.word}</span>
                    <span className="font-mono text-ink-700">{f.count}×</span>
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
