import Link from "next/link";
import type { ToolDef } from "@/lib/tools/types";

export default function ToolCard({ tool }: { tool: ToolDef }) {
  return (
    <Link
      href={`/${tool.slug}`}
      className="group card flex flex-col gap-1.5 transition-colors hover:border-accent-600"
    >
      <span className="font-medium text-ink-900 group-hover:text-accent-700">{tool.shortName}</span>
      <span className="line-clamp-2 text-sm text-ink-500">{tool.intro}</span>
    </Link>
  );
}
