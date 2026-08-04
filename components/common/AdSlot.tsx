import AdUnit from "./AdUnit";

export type AdSlotName = "below-result" | "content" | "sidebar";

/**
 * Ad placement.
 *
 * Renders nothing unless BOTH `NEXT_PUBLIC_ADS_ENABLED=true` and a slot ID has
 * been configured for this position, so the site never ships an empty ad
 * container. Slot IDs come from the AdSense dashboard (Ads → By ad unit) and
 * are per-placement, which is why each position has its own variable.
 */
const slotIds: Record<AdSlotName, string | undefined> = {
  "below-result": process.env.NEXT_PUBLIC_AD_SLOT_BELOW_RESULT,
  content: process.env.NEXT_PUBLIC_AD_SLOT_CONTENT,
  sidebar: process.env.NEXT_PUBLIC_AD_SLOT_SIDEBAR,
};

// Reserved heights prevent the ad from pushing content down as it loads, which
// is the single largest source of Cumulative Layout Shift on ad-supported
// pages.
const minHeights: Record<AdSlotName, string> = {
  "below-result": "min-h-[100px]",
  content: "min-h-[280px]",
  sidebar: "min-h-[600px]",
};

export default function AdSlot({ slot }: { slot: AdSlotName }) {
  if (process.env.NEXT_PUBLIC_ADS_ENABLED !== "true") return null;

  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  const slotId = slotIds[slot];
  if (!client || !slotId) return null;

  return (
    <div className={`my-8 ${minHeights[slot]}`}>
      {/* Labelling advertising is required by AdSense policy and, separately,
          keeps the page honest for readers. */}
      <p className="mb-1.5 text-center text-[10px] font-medium uppercase tracking-widest text-ink-500">
        Advertisement
      </p>
      <AdUnit client={client} slotId={slotId} />
    </div>
  );
}
