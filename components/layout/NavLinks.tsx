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
    <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
      {items.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`group relative rounded-xl px-3 py-2 text-sm font-semibold transition-colors ${
              active
                ? "text-ink-900"
                : "text-ink-500 hover:bg-ink-100/70 hover:text-ink-900"
            }`}
          >
            {item.name}
            {/* Gradient underline: full width when current, grows in on hover. */}
            <span
              aria-hidden
              className={`absolute inset-x-3 -bottom-[13px] h-[3px] origin-center rounded-full bg-gradient-to-r from-[rgb(var(--aurora-1))] via-[rgb(var(--aurora-2))] to-[rgb(var(--aurora-3))] transition-transform duration-300 ease-out ${
                active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-50"
              }`}
            />
          </Link>
        );
      })}
    </nav>
  );
}
