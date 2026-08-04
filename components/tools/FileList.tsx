"use client";

import { ArrowDownIcon, ArrowUpIcon, CloseIcon } from "@/components/common/Icon";
import { formatBytes } from "@/lib/utils";

export default function FileList({
  files,
  onRemove,
  onMove,
  onClear,
  reorderable = false,
}: {
  files: File[];
  onRemove: (index: number) => void;
  onMove?: (from: number, to: number) => void;
  onClear?: () => void;
  reorderable?: boolean;
}) {
  if (files.length === 0) return null;

  const total = files.reduce((sum, f) => sum + f.size, 0);

  return (
    <section aria-label="Selected files" className="mt-5">
      <div className="mb-2 flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-ink-900">
          {files.length} file{files.length === 1 ? "" : "s"}
          <span className="ml-2 font-normal tabular-nums text-ink-500">{formatBytes(total)}</span>
        </p>
        {onClear && files.length > 1 && (
          <button type="button" className="btn-ghost btn-sm" onClick={onClear}>
            Clear all
          </button>
        )}
      </div>

      <ul className="divide-y divide-ink-100 overflow-hidden rounded-xl border border-ink-100 bg-surface shadow-xs">
        {files.map((file, i) => (
          // `lastModified` distinguishes two files that share a name, which a
          // name+index key could not do without remounting rows on reorder.
          <li
            key={`${file.name}-${file.size}-${file.lastModified}`}
            className="flex items-center gap-2.5 px-3 py-2.5 text-sm transition-colors hover:bg-ink-50"
          >
            {reorderable && (
              <span
                className="w-5 shrink-0 text-center text-xs font-medium tabular-nums text-ink-500"
                aria-hidden
              >
                {i + 1}
              </span>
            )}
            <span className="min-w-0 flex-1 truncate font-medium text-ink-900" title={file.name}>
              {file.name}
            </span>
            <span className="shrink-0 text-xs tabular-nums text-ink-500">
              {formatBytes(file.size)}
            </span>

            {reorderable && onMove && (
              <span className="flex shrink-0 gap-1">
                <button
                  type="button"
                  className="btn-ghost btn-sm btn-icon"
                  aria-label={`Move ${file.name} up`}
                  disabled={i === 0}
                  onClick={() => onMove(i, i - 1)}
                >
                  <ArrowUpIcon className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  className="btn-ghost btn-sm btn-icon"
                  aria-label={`Move ${file.name} down`}
                  disabled={i === files.length - 1}
                  onClick={() => onMove(i, i + 1)}
                >
                  <ArrowDownIcon className="h-3.5 w-3.5" />
                </button>
              </span>
            )}

            <button
              type="button"
              className="btn-ghost btn-sm btn-icon shrink-0 hover:bg-danger-50 hover:text-danger-700"
              aria-label={`Remove ${file.name}`}
              onClick={() => onRemove(i)}
            >
              <CloseIcon className="h-3.5 w-3.5" />
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
