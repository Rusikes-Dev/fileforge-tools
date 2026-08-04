"use client";

import { reopenConsent } from "./ConsentBanner";

/** Lets visitors change a consent decision they have already made. */
export default function CookieSettingsButton() {
  return (
    <button
      type="button"
      onClick={reopenConsent}
      className="text-left text-sm text-ink-500 transition-colors hover:text-ink-900"
    >
      Cookie settings
    </button>
  );
}
