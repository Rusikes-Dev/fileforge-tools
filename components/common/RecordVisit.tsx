"use client";

import { useRecordToolVisit } from "@/lib/hooks/useRecentTools";

/**
 * Records a tool visit in local storage. Rendered as a leaf so the tool page
 * itself can remain a server component.
 */
export default function RecordVisit({ slug }: { slug: string }) {
  useRecordToolVisit(slug);
  return null;
}
