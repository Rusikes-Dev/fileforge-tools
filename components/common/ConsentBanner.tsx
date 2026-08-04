"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { CloseIcon, ShieldCheckIcon } from "./Icon";

export const CONSENT_KEY = "ff:consent";
/** Fired when the user asks to reopen the prompt (e.g. from the footer). */
export const CONSENT_REOPEN_EVENT = "ff:consent-reopen";

type Choice = "granted" | "denied";

interface StoredConsent {
  ads: Choice;
  /** Schema version, so a future change to the categories can re-prompt. */
  v: 1;
}

/** Pushes a Consent Mode v2 update.
 *
 *  `gtag` is defined by the inline script in the document head, which runs
 *  before any advertising tag loads. Calls made before the tag itself arrives
 *  are queued on `dataLayer` and replayed by Google on load. */
function updateConsent(ads: Choice) {
  const w = window as typeof window & {
    dataLayer?: IArguments[];
    gtag?: (...args: unknown[]) => void;
  };
  const params = {
    ad_storage: ads,
    ad_user_data: ads,
    ad_personalization: ads,
    analytics_storage: ads,
  };
  if (typeof w.gtag === "function") {
    w.gtag("consent", "update", params);
    return;
  }
  // Defensive fallback if the head script was blocked: push the tuple directly
  // so the choice is not silently dropped.
  w.dataLayer = w.dataLayer || [];
  const shim = function (...args: unknown[]) {
    // eslint-disable-next-line prefer-rest-params
    w.dataLayer!.push(arguments);
  };
  shim("consent", "update", params);
}

function readStored(): StoredConsent | null {
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredConsent;
    return parsed?.v === 1 && (parsed.ads === "granted" || parsed.ads === "denied")
      ? parsed
      : null;
  } catch {
    return null;
  }
}

/** Opens the consent prompt again. Used by the footer's "Cookie settings" link. */
export function reopenConsent() {
  window.dispatchEvent(new Event(CONSENT_REOPEN_EVENT));
}

/**
 * Cookie consent prompt.
 *
 * The site's default consent state is set to denied by an inline script in the
 * document head *before* any advertising tag loads (see app/layout.tsx), so no
 * personalised-advertising storage can be written prior to a choice being made.
 * This component only records the user's decision and pushes the corresponding
 * Consent Mode update.
 */
export default function ConsentBanner() {
  const [visible, setVisible] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only prompt when no valid prior choice exists. The inline head script has
    // already replayed a stored choice, so returning visitors see nothing.
    if (!readStored()) setVisible(true);

    function onReopen() {
      setVisible(true);
    }
    window.addEventListener(CONSENT_REOPEN_EVENT, onReopen);
    return () => window.removeEventListener(CONSENT_REOPEN_EVENT, onReopen);
  }, []);

  const decide = useCallback((ads: Choice) => {
    try {
      localStorage.setItem(CONSENT_KEY, JSON.stringify({ ads, v: 1 } satisfies StoredConsent));
    } catch {
      // Storage blocked — the choice still applies for this page view, it just
      // won't persist, so the prompt reappears next visit. That is the correct
      // failure mode: never assume consent we could not record.
    }
    updateConsent(ads);
    setVisible(false);
  }, []);

  // Escape declines rather than silently dismissing, so closing the prompt can
  // never be interpreted as consent.
  useEffect(() => {
    if (!visible) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") decide("denied");
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [visible, decide]);

  if (!visible) return null;

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="false"
      aria-labelledby="consent-title"
      aria-describedby="consent-body"
      className="animate-slide-in-up fixed inset-x-0 bottom-0 z-[65] border-t border-ink-100 bg-surface/95 shadow-lg backdrop-blur-md sm:inset-x-4 sm:bottom-4 sm:mx-auto sm:max-w-2xl sm:rounded-2xl sm:border"
    >
      <div className="flex items-start gap-4 p-4 sm:p-5">
        <span
          aria-hidden
          className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-accent-100 bg-accent-50 text-accent-700 sm:flex"
        >
          <ShieldCheckIcon className="h-[18px] w-[18px]" />
        </span>

        <div className="min-w-0 flex-1">
          <h2 id="consent-title" className="text-sm font-semibold text-ink-900">
            Cookies for advertising
          </h2>
          <p id="consent-body" className="mt-1.5 text-sm leading-relaxed text-ink-700">
            The tools themselves never upload or track your files — that does not change either
            way. This is only about whether our advertising partner may use cookies to personalise
            the ads that keep the site free. See our{" "}
            <Link href="/cookies" className="font-medium text-accent-700 underline underline-offset-2">
              cookie policy
            </Link>
            .
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" className="btn-primary btn-sm" onClick={() => decide("granted")}>
              Accept
            </button>
            <button type="button" className="btn-secondary btn-sm" onClick={() => decide("denied")}>
              Reject non-essential
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={() => decide("denied")}
          aria-label="Dismiss and reject non-essential cookies"
          className="btn-ghost btn-sm btn-icon shrink-0"
        >
          <CloseIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
