"use client";

import { formatBytes } from "@/lib/utils";

export default function FileList({
  files,
  onRemove,
  onMove,
  reorderable = false,
}: {
  files: File[];
  onRemove: (index: number) => void;
  onMove?: (from: number, to: number) => void;
  reorderable?: boolean;
}) {
  if (files.length === 0) return null;
  return (
    <ul className="mt-4 divide-y divide-ink-100 rounded border border-ink-100">
      {files.map((file, i) => (
        <li key={`${file.name}-${i}`} className="flex items-center gap-2 px-3 py-2.5 text-sm">
          {reorderable && (
            <span className="w-5 shrink-0 text-xs text-ink-500" aria-hidden>
              {i + 1}.
            </span>
          )}
          <span className="min-w-0 flex-1 truncate text-ink-900" title={file.name}>
            {file.name}
          </span>
          <span className="shrink-0 font-mono text-xs text-ink-500">{formatBytes(file.size)}</span>
          {reorderable && onMove && (
            <span className="flex shrink-0 gap-1">
              <button
                type="button"
                className="btn-secondary px-2 py-1"
                aria-label={`Move ${file.name} up`}
                disabled={i === 0}
                onClick={() => onMove(i, i - 1)}
              >
                ↑
              </button>
              <button
                type="button"
                className="btn-secondary px-2 py-1"
                aria-label={`Move ${file.name} down`}
                disabled={i === files.length - 1}
                onClick={() => onMove(i, i + 1)}
              >
                ↓
              </button>
            </span>
          )}
          <button
            type="button"
            className="btn-secondary px-2 py-1"
            aria-label={`Remove ${file.name}`}
            onClick={() => onRemove(i)}
          >
            ×
          </button>
        </li>
      ))}
    </ul>
  );
}
