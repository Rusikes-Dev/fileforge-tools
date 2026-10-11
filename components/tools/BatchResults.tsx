"use client";

import { useState } from "react";
import { ArchiveIcon, DownloadIcon, FileIcon } from "@/components/common/Icon";
import ActionButton from "@/components/ui/ActionButton";
import { zipBlobs } from "@/lib/converters/zip";
import { toast } from "@/lib/toast";
import { downloadBlob, formatBytes, percentChange } from "@/lib/utils";

export interface BatchItem {
  name: string;
  originalSize: number;
  blob: Blob;
}

/**
 * Finished files, one row each, plus a single "Download all (.zip)" button once
 * there is more than one. Thirty converted images used to mean thirty separate
 * download clicks.
 */
export default function BatchResults({
  results,
  zipName = "converted-files.zip",
  showDelta = true,
}: {
  results: BatchItem[];
  zipName?: string;
  /** Show before → after sizes and the % change. Off when the formats differ so much the comparison means nothing (DOCX → PDF). */
  showDelta?: boolean;
}) {
  const [zipping, setZipping] = useState(false);

  async function downloadAll() {
    setZipping(true);
    try {
      const zip = await zipBlobs(results.map((r) => ({ name: r.name, blob: r.blob })));
      downloadBlob(zip, zipName);
    } catch {
      toast("Couldn't build the ZIP — try downloading the files one by one.", "error");
    } finally {
      setZipping(false);
    }
  }

  const totalBefore = results.reduce((n, r) => n + r.originalSize, 0);
  const totalAfter = results.reduce((n, r) => n + r.blob.size, 0);

  return (
    <div>
      <p className="font-semibold text-accent-800">
        {results.length} file{results.length > 1 ? "s" : ""} ready
        <span className="ml-2 font-normal tabular-nums text-ink-700">
          {showDelta
            ? `${formatBytes(totalBefore)} → ${formatBytes(totalAfter)}${
                totalBefore > 0 ? ` (${percentChange(totalBefore, totalAfter)})` : ""
              }`
            : formatBytes(totalAfter)}
        </span>
      </p>

      <ul className="mt-3 divide-y divide-accent-100 overflow-hidden rounded-2xl border border-accent-100 bg-surface">
        {results.map((r, i) => {
          const smaller = r.blob.size <= r.originalSize;
          return (
            <li key={`${r.name}-${i}`} className="flex flex-wrap items-center gap-x-3 gap-y-2 px-3 py-2.5 text-sm">
              <span aria-hidden className="tile !h-9 !w-9 !rounded-lg">
                <FileIcon className="h-4 w-4" />
              </span>
              <span className="min-w-0 flex-1 basis-40">
                <span className="block truncate font-medium text-ink-900" title={r.name}>
                  {r.name}
                </span>
                <span className="block text-xs tabular-nums text-ink-500">
                  {showDelta
                    ? `${formatBytes(r.originalSize)} → ${formatBytes(r.blob.size)}`
                    : formatBytes(r.blob.size)}
                </span>
              </span>
              {showDelta && (
                <span
                  className={`badge shrink-0 tabular-nums ${
                    smaller ? "bg-accent-50 text-accent-800" : "bg-warning-50 text-warning-700"
                  }`}
                >
                  {percentChange(r.originalSize, r.blob.size)}
                </span>
              )}
              <button
                type="button"
                className="btn-secondary btn-sm shrink-0"
                onClick={() => downloadBlob(r.blob, r.name)}
                aria-label={`Download ${r.name}`}
              >
                <DownloadIcon className="h-3.5 w-3.5" />
                Download
              </button>
            </li>
          );
        })}
      </ul>

      {results.length > 1 && (
        <ActionButton
          className="btn-primary mt-4"
          busy={zipping}
          busyLabel="Zipping…"
          onClick={downloadAll}
        >
          <ArchiveIcon className="h-4 w-4" />
          Download all (.zip)
        </ActionButton>
      )}
    </div>
  );
}
