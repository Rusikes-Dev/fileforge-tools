import type { ButtonHTMLAttributes, ReactNode } from "react";

/** Three bouncing dots, tinted by the surrounding text colour. */
export function LoaderDots({ className = "" }: { className?: string }) {
  return (
    <span className={`loader-dots ${className}`} aria-hidden="true">
      <i />
      <i />
      <i />
    </span>
  );
}

interface ActionButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  /** While true the button is disabled and shows `busyLabel` with loader dots. */
  busy?: boolean;
  busyLabel?: string;
  children: ReactNode;
}

/**
 * The one button every "do the work" action uses (Convert, Merge, Generate…).
 *
 * Centralising the busy state means every tool gets the same feedback — and a
 * double click while work is running can't start a second job, because the
 * button is genuinely disabled rather than just restyled.
 */
export default function ActionButton({
  busy = false,
  busyLabel = "Working…",
  className = "btn-primary",
  disabled,
  children,
  type = "button",
  ...rest
}: ActionButtonProps) {
  return (
    <button
      type={type}
      className={className}
      disabled={disabled || busy}
      aria-busy={busy || undefined}
      data-busy={busy || undefined}
      {...rest}
    >
      {busy ? (
        <>
          <LoaderDots />
          <span>{busyLabel}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}
