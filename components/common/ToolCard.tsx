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
      data-cat={tool.category}
      className="card-interactive group flex flex-col gap-4"
    >
      <div className="flex items-start justify-between gap-3">
        <span aria-hidden className="tile">
          <CategoryIcon category={tool.category} className="h-5 w-5" />
        </span>
        <span
          aria-hidden
          className="flex h-8 w-8 items-center justify-center rounded-full bg-ink-100 text-ink-500 transition-all duration-300 ease-spring group-hover:-rotate-45 group-hover:bg-accent-700 group-hover:text-white dark:group-hover:bg-accent-600 dark:group-hover:text-ink-50"
        >
          <ArrowRightIcon className="h-4 w-4" />
        </span>
      </div>

      <div className="min-w-0">
        <h3 className="text-base font-bold leading-snug text-ink-900">{tool.shortName}</h3>
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
