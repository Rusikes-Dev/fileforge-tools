"use client";

import { reopenConsent } from "./ConsentBanner";

/** Lets visitors change a consent decision they have already made. */
export default function CookieSettingsButton() {
  return (
    <button
      type="button"
      onClick={reopenConsent}
      className="inline-block text-left text-sm text-ink-500 transition-all duration-200 hover:translate-x-1 hover:text-ink-900"
    >
      Cookie settings
    </button>
  );
}
