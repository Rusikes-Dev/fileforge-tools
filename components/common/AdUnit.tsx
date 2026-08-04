"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

/**
 * A single responsive AdSense unit.
 *
 * The push must happen after the <ins> element is in the DOM, and exactly once
 * per element — pushing twice raises "adsbygoogle.push() error: All ins
 * elements already have ads in them" and can leave the slot blank. React 18
 * StrictMode double-invokes effects in development, so a ref guard is required
 * rather than optional.
 */
export default function AdUnit({ client, slotId }: { client: string; slotId: string }) {
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current) return;
    pushed.current = true;
    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
    } catch {
      // Blocked by an ad blocker or the script failed to load. Nothing to do —
      // the reserved space simply stays empty and the page is unaffected.
    }
  }, []);

  return (
    <ins
      className="adsbygoogle block"
      style={{ display: "block" }}
      data-ad-client={client}
      data-ad-slot={slotId}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}
