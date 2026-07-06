export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** i;
  return `${value >= 100 || i === 0 ? Math.round(value) : value.toFixed(1)} ${units[i]}`;
}

export function percentChange(from: number, to: number): string {
  if (from === 0) return "0%";
  const pct = ((from - to) / from) * 100;
  return `${pct >= 0 ? "−" : "+"}${Math.abs(pct).toFixed(0)}%`;
}

/** Strip a filename to a safe base name (no path separators or control chars). */
export function safeBaseName(name: string): string {
  const base = name.replace(/\\/g, "/").split("/").pop() ?? "file";
  const noExt = base.replace(/\.[^.]+$/, "");
  const cleaned = noExt.replace(/[\u0000-\u001f<>:"|?*]/g, "").trim();
  return cleaned || "file";
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}
