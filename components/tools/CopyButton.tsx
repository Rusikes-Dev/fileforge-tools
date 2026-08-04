"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatedCheckIcon, CopyIcon } from "@/components/common/Icon";
import { copyText } from "@/lib/utils";
import { toast } from "@/lib/toast";

export default function CopyButton({
  text,
  label = "Copy result",
  className = "btn-secondary",
  disabled = false,
}: {
  text: string;
  label?: string;
  className?: string;
  disabled?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Previously the reset timer was never cleared, so navigating away mid-flash
  // set state on an unmounted component.
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleCopy = useCallback(async () => {
    // copyText never rejects; it reports failure so we can tell the user
    // instead of silently showing "Copied" when nothing was copied.
    const ok = await copyText(text);
    if (!ok) {
      toast("Couldn't copy — your browser blocked clipboard access.", "error");
      return;
    }
    setCopied(true);
    toast("Copied to clipboard");
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopied(false), 1800);
  }, [text]);

  return (
    <button
      type="button"
      className={className}
      onClick={handleCopy}
      disabled={disabled || !text}
      aria-label={copied ? "Copied to clipboard" : label}
    >
      {copied ? (
        <AnimatedCheckIcon className="h-4 w-4 text-accent-700" />
      ) : (
        <CopyIcon className="h-4 w-4" />
      )}
      <span>{copied ? "Copied" : label}</span>
    </button>
  );
}
