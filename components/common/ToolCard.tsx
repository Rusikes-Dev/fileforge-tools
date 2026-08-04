import Link from "next/link";
import type { ToolDef } from "@/lib/tools/types";
import { ArrowRightIcon, CategoryIcon } from "./Icon";

export default function ToolCard({
  tool,
  showCategory = false,
}: {
  tool: ToolDef;
  showCategory?: boolean;
}) {
  return (
    <Link
      href={`/${tool.slug}`}
      className="card-interactive group flex flex-col gap-3 focus-visible:shadow-focus"
    >
      <div className="flex items-start justify-between gap-3">
        <span
          aria-hidden
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-ink-100 bg-ink-50 text-ink-700 transition-colors duration-200 group-hover:border-accent-100 group-hover:bg-accent-50 group-hover:text-accent-700"
        >
          <CategoryIcon category={tool.category} className="h-[18px] w-[18px]" />
        </span>
        <ArrowRightIcon
          aria-hidden
          className="mt-1 h-4 w-4 shrink-0 -translate-x-1 text-ink-300 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:text-accent-700 group-hover:opacity-100"
        />
      </div>

      <div className="min-w-0">
        <h3 className="font-semibold leading-snug text-ink-900 transition-colors group-hover:text-accent-700">
          {tool.shortName}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-ink-500">{tool.intro}</p>
      </div>

      {showCategory && (
        <span className="badge-neutral mt-auto self-start">{categoryLabel(tool.category)}</span>
      )}
    </Link>
  );
}

function categoryLabel(id: ToolDef["category"]): string {
  switch (id) {
    case "image-tools":
      return "Image";
    case "pdf-tools":
      return "PDF";
    case "text-tools":
      return "Text";
    default:
      return "Developer";
  }
}
