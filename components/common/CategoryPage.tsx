import Breadcrumbs from "@/components/common/Breadcrumbs";
import ToolCard from "@/components/common/ToolCard";
import JsonLd from "@/components/common/JsonLd";
import type { CategoryDef } from "@/lib/tools/types";
import { getToolsByCategory } from "@/lib/tools/registry";
import { breadcrumbJsonLd, itemListJsonLd } from "@/lib/seo";

export default function CategoryPage({ category }: { category: CategoryDef }) {
  const tools = getToolsByCategory(category.id);
  const crumbs = [
    { name: "Home", href: "/" },
    { name: category.name, href: `/${category.id}` },
  ];
  return (
    <div className="container-site py-8">
      <JsonLd data={[breadcrumbJsonLd(crumbs), itemListJsonLd(tools)]} />
      <Breadcrumbs crumbs={crumbs} />
      <h1 className="mt-4 text-3xl font-bold tracking-tight">{category.name}</h1>
      <p className="mt-2 max-w-2xl text-ink-700">{category.intro}</p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((t) => (
          <ToolCard key={t.slug} tool={t} />
        ))}
      </div>
      <section aria-labelledby={`about-${category.id}`} className="mt-12 max-w-3xl space-y-3">
        <h2 id={`about-${category.id}`} className="text-xl font-semibold">
          About {category.name.toLowerCase()}
        </h2>
        {category.about.map((p) => (
          <p key={p.slice(0, 40)} className="text-sm leading-relaxed text-ink-700">
            {p}
          </p>
        ))}
      </section>
    </div>
  );
}
