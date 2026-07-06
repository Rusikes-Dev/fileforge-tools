import Link from "next/link";
import { site } from "@/lib/site";
import MobileNav from "./MobileNav";

const nav = [
  { name: "All Tools", href: "/tools" },
  { name: "Image Tools", href: "/image-tools" },
  { name: "PDF Tools", href: "/pdf-tools" },
  { name: "Text Tools", href: "/text-tools" },
  { name: "Developer Tools", href: "/developer-tools" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-ink-100 bg-white/95 backdrop-blur-sm">
      <div className="container-site flex h-14 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 font-semibold text-ink-900">
          <span aria-hidden className="flex h-6 w-6 items-center justify-center rounded bg-accent-700 text-xs font-bold text-white">
            F
          </span>
          {site.shortName}
        </Link>
        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded px-3 py-1.5 text-sm text-ink-700 hover:bg-ink-50 hover:text-ink-900"
            >
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/tools#search" className="btn-secondary hidden sm:inline-flex" aria-label="Search tools">
            Search
          </Link>
          <MobileNav items={nav} />
        </div>
      </div>
    </header>
  );
}
