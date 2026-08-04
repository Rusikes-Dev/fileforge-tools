import Link from "next/link";
import { site } from "@/lib/site";
import { buildSearchIndex } from "@/lib/tools/registry";
import MobileNav from "./MobileNav";
import NavLinks, { type NavItem } from "./NavLinks";
import CommandPalette from "./CommandPalette";
import ThemeToggle from "../common/ThemeToggle";

const nav: NavItem[] = [
  { name: "All Tools", href: "/tools" },
  { name: "Image", href: "/image-tools" },
  { name: "PDF", href: "/pdf-tools" },
  { name: "Text", href: "/text-tools" },
  { name: "Developer", href: "/developer-tools" },
  { name: "Blog", href: "/blog" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-ink-100 bg-surface/85 backdrop-blur-md">
      <div className="container-site flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5 text-[15px] font-semibold tracking-tight text-ink-900"
        >
          <span
            aria-hidden
            className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent-700 text-xs font-bold text-white shadow-xs"
          >
            F
          </span>
          {site.shortName}
        </Link>

        <NavLinks items={nav} />

        <div className="flex items-center gap-1.5">
          <CommandPalette index={buildSearchIndex()} />
          <ThemeToggle />
          <MobileNav items={nav} />
        </div>
      </div>
    </header>
  );
}
