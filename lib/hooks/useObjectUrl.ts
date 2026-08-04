"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Manages a blob/object URL for a single source, revoking the previous URL
 * whenever the source changes and the final URL on unmount.
 *
 * This exists because the obvious inline approach —
 *
 *   setUrl((old) => { if (old) URL.revokeObjectURL(old); return URL.createObjectURL(f); })
 *
 * — performs side effects inside a state updater. React may invoke updaters
 * more than once (it does so deliberately under StrictMode), which allocates a
 * second object URL that nothing ever revokes: a silent memory leak that grows
 * with every file the user loads. Keeping the URL in a ref and mutating it from
 * an event handler or effect avoids that entirely.
 */
export function useObjectUrl(source: Blob | null): string | null {
  const [url, setUrl] = useState<string | null>(null);
  const currentRef = useRef<string | null>(null);

  useEffect(() => {
    if (!source) {
      if (currentRef.current) URL.revokeObjectURL(currentRef.current);
      currentRef.current = null;
      setUrl(null);
      return;
    }

    const next = URL.createObjectURL(source);
    currentRef.current = next;
    setUrl(next);

    return () => {
      URL.revokeObjectURL(next);
      if (currentRef.current === next) currentRef.current = null;
    };
  }, [source]);

  return url;
}

/**
 * Manages a list of object URLs (e.g. one preview per rendered PDF page).
 * Replacing the list revokes the outgoing URLs; unmounting revokes whatever is
 * left, which the original page-preview code never did.
 */
export function useObjectUrlList(): {
  urls: string[];
  setBlobs: (blobs: Blob[]) => void;
  clear: () => void;
} {
  const [urls, setUrls] = useState<string[]>([]);
  const ref = useRef<string[]>([]);

  const revokeAll = useCallback(() => {
    ref.current.forEach((u) => URL.revokeObjectURL(u));
    ref.current = [];
  }, []);

  const setBlobs = useCallback(
    (blobs: Blob[]) => {
      revokeAll();
      const next = blobs.map((b) => URL.createObjectURL(b));
      ref.current = next;
      setUrls(next);
    },
    [revokeAll]
  );

  const clear = useCallback(() => {
    revokeAll();
    setUrls([]);
  }, [revokeAll]);

  // Revoke anything still outstanding when the tool unmounts.
  useEffect(() => () => revokeAll(), [revokeAll]);

  return { urls, setBlobs, clear };
}
