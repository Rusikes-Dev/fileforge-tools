export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
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
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

/**
 * Copy text to the clipboard, resolving to whether it succeeded.
 *
 * `navigator.clipboard` is undefined on insecure origins (plain http, some
 * in-app webviews) and its promise rejects when the document isn't focused or
 * the user denies permission. Calling it bare therefore throws an unhandled
 * rejection and leaves the UI claiming success. This wraps it and falls back to
 * the legacy `execCommand` path, which still works in those contexts.
 */
export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Fall through to the legacy path below.
  }

  try {
    const area = document.createElement("textarea");
    area.value = text;
    // Keep it off-screen but still selectable, and avoid scrolling the page.
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.top = "0";
    area.style.left = "-9999px";
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand("copy");
    area.remove();
    return ok;
  } catch {
    return false;
  }
}

/** Join conditional class names. Falsy values are dropped. */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/** Clamp a number into an inclusive range. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Format an ISO date string for display, e.g. "4 August 2026". */
export function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}
