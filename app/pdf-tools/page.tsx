import type { Metadata } from "next";
import CategoryPage from "@/components/common/CategoryPage";
import { getCategory } from "@/lib/tools/categories";
import { pageMetadata } from "@/lib/seo";

const category = getCategory("pdf-tools")!;

export const metadata: Metadata = pageMetadata(
  `/${category.id}`,
  category.title,
  category.description
);

export default function Page() {
  return <CategoryPage category={category} />;
}
