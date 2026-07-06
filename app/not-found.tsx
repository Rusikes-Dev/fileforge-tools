import Link from "next/link";
import ToolSearch from "@/components/common/ToolSearch";
import { buildSearchIndex } from "@/lib/tools/registry";

export default function NotFound() {
  return (
    <div className="container-site max-w-2xl py-16 text-center">
      <h1 className="text-3xl font-bold tracking-tight">Page not found</h1>
      <p className="mt-3 text-ink-700">
        The page you&apos;re looking for doesn&apos;t exist. Try searching for a tool instead:
      </p>
      <div className="mx-auto mt-6 max-w-md text-left">
        <ToolSearch index={buildSearchIndex()} />
      </div>
      <Link href="/" className="btn-primary mt-8">
        Back to the homepage
      </Link>
    </div>
  );
}
