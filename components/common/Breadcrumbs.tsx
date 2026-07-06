import Link from "next/link";
import type { Crumb } from "@/lib/seo";

export default function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-ink-500">
      <ol className="flex flex-wrap items-center gap-1">
        {crumbs.map((c, i) => {
          const last = i === crumbs.length - 1;
          return (
            <li key={c.href} className="flex items-center gap-1">
              {i > 0 && <span aria-hidden>/</span>}
              {last ? (
                <span aria-current="page" className="text-ink-700">{c.name}</span>
              ) : (
                <Link href={c.href} className="hover:text-ink-900 hover:underline">{c.name}</Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
