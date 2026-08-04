"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export interface NavItem {
  name: string;
  href: string;
}

/**
 * Desktop primary navigation. Split out as a client component purely so the
 * header itself can stay a server component while still highlighting the
 * current section.
 */
export default function NavLinks({ items }: { items: NavItem[] }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Main" className="hidden items-center gap-0.5 md:flex">
      {items.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`relative rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              active
                ? "text-ink-900"
                : "text-ink-500 hover:bg-ink-50 hover:text-ink-900"
            }`}
          >
            {item.name}
            {active && (
              <span
                aria-hidden
                className="absolute inset-x-3 -bottom-[13px] h-0.5 rounded-full bg-accent-700"
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
