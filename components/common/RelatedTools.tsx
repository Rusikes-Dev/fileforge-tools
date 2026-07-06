import type { ToolDef } from "@/lib/tools/types";
import ToolCard from "./ToolCard";

export default function RelatedTools({ tools }: { tools: ToolDef[] }) {
  if (tools.length === 0) return null;
  return (
    <section aria-labelledby="related-heading">
      <h2 id="related-heading" className="text-xl font-semibold">Related tools</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((t) => (
          <ToolCard key={t.slug} tool={t} />
        ))}
      </div>
    </section>
  );
}
