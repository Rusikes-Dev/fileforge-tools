"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * A localStorage-backed value that is hydration-safe.
 *
 * The first render always returns `initial` so the server-rendered HTML and the
 * client's first paint agree; the stored value is adopted in an effect
 * immediately afterwards. Reading localStorage during render instead would
 * produce a hydration mismatch on every page that uses it.
 *
 * `ready` lets callers avoid flashing empty state before hydration completes.
 */
export function useLocalStorage<T>(
  key: string,
  initial: T
): [T, (value: T | ((prev: T) => T)) => void, boolean] {
  const [value, setValue] = useState<T>(initial);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw !== null) setValue(JSON.parse(raw) as T);
    } catch {
      // Corrupt JSON or storage disabled (private browsing) — keep the default.
    }
    setReady(true);
  }, [key]);

  const update = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const resolved = next instanceof Function ? next(prev) : next;
        try {
          window.localStorage.setItem(key, JSON.stringify(resolved));
        } catch {
          // Quota exceeded or storage disabled — value still updates in memory.
        }
        return resolved;
      });
    },
    [key]
  );

  return [value, update, ready];
}
