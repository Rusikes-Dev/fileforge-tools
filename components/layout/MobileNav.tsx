"use client";

import Link from "next/link";
import { useId, useState } from "react";

export default function MobileNav({ items }: { items: Array<{ name: string; href: string }> }) {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  return (
    <div className="md:hidden">
      <button
        type="button"
        className="btn-secondary"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? "Close" : "Menu"}
      </button>
      {open && (
        <nav
          id={menuId}
          aria-label="Main"
          className="absolute inset-x-0 top-14 border-b border-ink-100 bg-surface shadow-sm"
        >
          <ul className="container-site py-2">
            {[{ name: "Home", href: "/" }, ...items].map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block rounded px-3 py-2.5 text-sm text-ink-700 hover:bg-ink-50"
                  onClick={() => setOpen(false)}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}
