"use client";

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CloseIcon,
  FileIcon,
  GripIcon,
  ImageIcon,
  PdfIcon,
} from "@/components/common/Icon";
import { fileKey } from "@/lib/files";
import { formatBytes } from "@/lib/utils";

/* --- Thumbnails ------------------------------------------------------------
   Decoding thirty 12-megapixel photos just to draw 36px squares would spike
   memory, so thumbnails are produced one at a time with createImageBitmap's
   built-in downscale and drawn straight onto a tiny canvas. Nothing larger than
   the thumbnail is kept, and any failure falls back to a file icon. */

let thumbQueue: Promise<void> = Promise.resolve();

function queueThumb(task: () => Promise<void>): Promise<void> {
  const run = thumbQueue.then(task, task);
  thumbQueue = run.catch(() => undefined);
  return run;
}

function isThumbnailable(file: File): boolean {
  return /^image\/(jpeg|png|webp|gif|bmp|avif)$/.test(file.type);
}

function Thumb({ file }: { file: File }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ok, setOk] = useState(false);

  useEffect(() => {
    if (!isThumbnailable(file) || typeof createImageBitmap !== "function") return;
    let cancelled = false;
    setOk(false);

    void queueThumb(async () => {
      if (cancelled) return;
      try {
        const bitmap = await createImageBitmap(file, { resizeWidth: 96, resizeQuality: "low" });
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (cancelled || !canvas || !ctx) {
          bitmap.close();
          return;
        }
        // Cover-fit into the square.
        const size = canvas.width;
        const scale = Math.max(size / bitmap.width, size / bitmap.height);
        const w = bitmap.width * scale;
        const h = bitmap.height * scale;
        ctx.clearRect(0, 0, size, size);
        ctx.drawImage(bitmap, (size - w) / 2, (size - h) / 2, w, h);
        bitmap.close();
        setOk(true);
      } catch {
        // Unsupported or corrupt — the icon fallback stays visible.
      }
    });

    return () => {
      cancelled = true;
    };
  }, [file]);

  return (
    <span className="tile !h-9 !w-9 !rounded-lg relative overflow-hidden" aria-hidden>
      {file.type === "application/pdf" ? (
        <PdfIcon className="h-4 w-4" />
      ) : file.type.startsWith("image/") ? (
        <ImageIcon className="h-4 w-4" />
      ) : (
        <FileIcon className="h-4 w-4" />
      )}
      <canvas
        ref={canvasRef}
        width={72}
        height={72}
        className={`absolute inset-0 h-full w-full transition-opacity duration-300 ${ok ? "opacity-100" : "opacity-0"}`}
      />
    </span>
  );
}

function extensionOf(name: string): string {
  const m = /\.([A-Za-z0-9]{1,5})$/.exec(name);
  return m ? m[1].toUpperCase() : "FILE";
}

type PendingFocus = { kind: "move"; index: number; dir: "up" | "down" } | { kind: "remove"; index: number };

export default function FileList({
  files,
  onRemove,
  onMove,
  onClear,
  reorderable = false,
}: {
  files: File[];
  onRemove: (index: number) => void;
  /** Move the item at `from` so that it ends up at index `to`. */
  onMove?: (from: number, to: number) => void;
  onClear?: () => void;
  reorderable?: boolean;
}) {
  const listRef = useRef<HTMLUListElement>(null);
  const pendingFocus = useRef<PendingFocus | null>(null);
  const [announcement, setAnnouncement] = useState("");
  // `slot` is the gap the dragged row would drop into (0 = before the first row).
  const [drag, setDrag] = useState<{ from: number; slot: number } | null>(null);

  // Buttons are removed/disabled by the very click that triggers a reorder or
  // removal, which would otherwise dump keyboard focus on <body>. Put it back
  // on the same row (or its neighbour) once the new list has rendered.
  useEffect(() => {
    const pending = pendingFocus.current;
    if (!pending) return;
    pendingFocus.current = null;
    const rows = listRef.current?.children;
    if (!rows || rows.length === 0) return;
    const row = rows[Math.min(pending.index, rows.length - 1)] as HTMLElement;
    if (pending.kind === "remove") {
      row.querySelector<HTMLButtonElement>("[data-action=remove]")?.focus();
      return;
    }
    const preferred = row.querySelector<HTMLButtonElement>(`[data-action=${pending.dir}]:not(:disabled)`);
    const other = row.querySelector<HTMLButtonElement>(
      `[data-action=${pending.dir === "up" ? "down" : "up"}]:not(:disabled)`
    );
    (preferred ?? other)?.focus();
  }, [files]);

  // Escape abandons a drag in progress.
  useEffect(() => {
    if (!drag) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setDrag(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [drag]);

  if (files.length === 0) return null;

  const total = files.reduce((sum, f) => sum + f.size, 0);

  function moveBy(from: number, to: number, dir: "up" | "down") {
    if (!onMove) return;
    pendingFocus.current = { kind: "move", index: to, dir };
    onMove(from, to);
    setAnnouncement(`Moved ${files[from].name} to position ${to + 1} of ${files.length}.`);
  }

  function remove(index: number) {
    pendingFocus.current = { kind: "remove", index };
    setAnnouncement(`Removed ${files[index].name}.`);
    onRemove(index);
  }

  /* --- Pointer drag (mouse, touch and pen) -------------------------------- */

  function slotFromY(y: number): number {
    const rows = Array.from(listRef.current?.children ?? []) as HTMLElement[];
    for (let i = 0; i < rows.length; i++) {
      const r = rows[i].getBoundingClientRect();
      if (y < r.top + r.height / 2) return i;
    }
    return rows.length;
  }

  function onHandleDown(e: ReactPointerEvent<HTMLElement>, from: number) {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    setDrag({ from, slot: from });
  }

  function onHandleMove(e: ReactPointerEvent<HTMLElement>) {
    if (!drag) return;
    // Nudge the page when dragging near the viewport edge on a long list.
    if (e.clientY < 56) window.scrollBy(0, -12);
    else if (e.clientY > window.innerHeight - 56) window.scrollBy(0, 12);
    const slot = slotFromY(e.clientY);
    if (slot !== drag.slot) setDrag({ from: drag.from, slot });
  }

  function onHandleUp() {
    if (!drag) return;
    const { from, slot } = drag;
    setDrag(null);
    const dest = slot > from ? slot - 1 : slot;
    if (dest !== from && onMove) {
      onMove(from, dest);
      setAnnouncement(`Moved ${files[from].name} to position ${dest + 1} of ${files.length}.`);
    }
  }

  const dropIndex = drag ? (drag.slot > drag.from ? drag.slot - 1 : drag.slot) : null;
  const showIndicator = drag !== null && dropIndex !== drag.from;

  return (
    <section aria-label="Selected files" className="animate-fade-in-up mt-6">
      <div className="mb-2.5 flex items-center justify-between gap-3">
        <p className="flex items-center gap-2 text-sm font-semibold text-ink-900">
          <span className="badge-accent !px-2.5 !py-1 tabular-nums">
            {files.length} file{files.length === 1 ? "" : "s"}
          </span>
          <span className="font-normal tabular-nums text-ink-500">{formatBytes(total)}</span>
        </p>
        {onClear && files.length > 1 && (
          <button type="button" className="btn-ghost btn-sm" onClick={onClear}>
            Clear all
          </button>
        )}
      </div>

      <ul
        ref={listRef}
        className="divide-y divide-ink-100 overflow-hidden rounded-2xl border border-ink-100 bg-surface shadow-sm"
      >
        {files.map((file, i) => {
          const over =
            showIndicator && drag
              ? drag.slot === i
                ? "before"
                : drag.slot === files.length && i === files.length - 1
                  ? "after"
                  : undefined
              : undefined;
          return (
            <li
              key={fileKey(file)}
              data-dragging={drag?.from === i || undefined}
              data-over={over}
              className="file-row flex items-center gap-2 px-2.5 py-2.5 text-sm hover:bg-ink-50 sm:gap-3 sm:px-3"
            >
              {reorderable && onMove && (
                <span
                  aria-hidden
                  className="file-handle flex h-8 w-6 shrink-0 items-center justify-center rounded-md text-ink-500 hover:bg-ink-100 hover:text-ink-900"
                  onPointerDown={(e) => onHandleDown(e, i)}
                  onPointerMove={onHandleMove}
                  onPointerUp={onHandleUp}
                  onPointerCancel={() => setDrag(null)}
                  title="Drag to reorder"
                >
                  <GripIcon className="h-4 w-4" />
                </span>
              )}
              {reorderable && (
                <span
                  className="w-4 shrink-0 text-center text-xs font-semibold tabular-nums text-ink-500"
                  aria-hidden
                >
                  {i + 1}
                </span>
              )}
              <Thumb file={file} />
              <span className="min-w-0 flex-1">
                <span className="block truncate font-medium text-ink-900" title={file.name}>
                  {file.name}
                </span>
                <span className="block text-xs tabular-nums text-ink-500">
                  {extensionOf(file.name)} · {formatBytes(file.size)}
                </span>
              </span>

              {reorderable && onMove && (
                <span className="flex shrink-0 gap-0.5">
                  <button
                    type="button"
                    data-action="up"
                    className="btn-ghost btn-sm btn-icon"
                    aria-label={`Move ${file.name} up`}
                    disabled={i === 0}
                    onClick={() => moveBy(i, i - 1, "up")}
                  >
                    <ArrowUpIcon className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    data-action="down"
                    className="btn-ghost btn-sm btn-icon"
                    aria-label={`Move ${file.name} down`}
                    disabled={i === files.length - 1}
                    onClick={() => moveBy(i, i + 1, "down")}
                  >
                    <ArrowDownIcon className="h-4 w-4" />
                  </button>
                </span>
              )}

              <button
                type="button"
                data-action="remove"
                className="btn-ghost btn-sm btn-icon shrink-0 hover:!bg-danger-50 hover:!text-danger-700"
                aria-label={`Remove ${file.name}`}
                onClick={() => remove(i)}
              >
                <CloseIcon className="h-4 w-4" />
              </button>
            </li>
          );
        })}
      </ul>

      <p role="status" aria-live="polite" className="sr-only">
        {announcement}
      </p>
    </section>
  );
}
