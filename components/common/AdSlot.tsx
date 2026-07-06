/**
 * Optional ad placement. Disabled unless NEXT_PUBLIC_ADS_ENABLED=true.
 * Reserves height to avoid layout shift when an ad network is wired in later.
 */
export default function AdSlot({ slot }: { slot: "below-result" | "content" | "sidebar" }) {
  if (process.env.NEXT_PUBLIC_ADS_ENABLED !== "true") return null;
  return (
    <div
      data-ad-slot={slot}
      aria-hidden
      className="my-6 flex min-h-[90px] items-center justify-center rounded border border-dashed border-ink-300 text-xs text-ink-500"
    >
      Advertisement
    </div>
  );
}
