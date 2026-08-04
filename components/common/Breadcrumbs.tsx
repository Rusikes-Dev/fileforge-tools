import Link from "next/link";
import type { Crumb } from "@/lib/seo";
import { ChevronRightIcon } from "./Icon";

export default function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm">
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
        {crumbs.map((c, i) => {
          const last = i === crumbs.length - 1;
          return (
            <li key={c.href} className="flex items-center gap-1.5">
              {i > 0 && <ChevronRightIcon className="h-3.5 w-3.5 shrink-0 text-ink-300" />}
              {last ? (
                <span aria-current="page" className="font-medium text-ink-700">
                  {c.name}
                </span>
              ) : (
                <Link
                  href={c.href}
                  className="text-ink-500 transition-colors hover:text-ink-900"
                >
                  {c.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
