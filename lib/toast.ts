export type ToastTone = "success" | "error" | "info";

export interface ToastPayload {
  id: number;
  message: string;
  tone: ToastTone;
}

const EVENT = "ff:toast";
let nextId = 0;

/**
 * Show a transient notification.
 *
 * Implemented as a DOM CustomEvent rather than React context so that any tool —
 * including ones rendered inside dynamically imported chunks — can call it
 * without the app needing a provider wrapped around every boundary or props
 * threaded through unrelated components.
 */
export function toast(message: string, tone: ToastTone = "success"): void {
  if (typeof window === "undefined") return;
  const detail: ToastPayload = { id: nextId++, message, tone };
  window.dispatchEvent(new CustomEvent<ToastPayload>(EVENT, { detail }));
}

export function onToast(handler: (payload: ToastPayload) => void): () => void {
  const listener = (e: Event) => handler((e as CustomEvent<ToastPayload>).detail);
  window.addEventListener(EVENT, listener);
  return () => window.removeEventListener(EVENT, listener);
}
