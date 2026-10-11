import type { ToolDef } from "@/lib/tools/types";
import ToolCard from "./ToolCard";

export default function RelatedTools({ tools }: { tools: ToolDef[] }) {
  if (tools.length === 0) return null;
  return (
    <section aria-labelledby="related-heading">
      <h2 id="related-heading" className="text-2xl font-bold">
        Related tools
      </h2>
      <p className="mt-1.5 text-sm text-ink-500">
        Other tools people commonly use alongside this one.
      </p>
      <div className="reveal mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((t) => (
          <ToolCard key={t.slug} tool={t} showCategory />
        ))}
      </div>
    </section>
  );
}
