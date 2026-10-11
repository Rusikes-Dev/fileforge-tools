import BrandMark from "../common/BrandMark";
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
    <header className="header-shell sticky top-0 z-40">
      <div className="container-site flex h-16 items-center justify-between gap-3">
        <BrandMark />

        <NavLinks items={nav} />

        <div className="flex items-center gap-2">
          <CommandPalette index={buildSearchIndex()} />
          <ThemeToggle />
          <MobileNav items={nav} />
        </div>
      </div>
    </header>
  );
}
