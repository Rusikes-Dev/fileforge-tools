"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { CloseIcon, MenuIcon } from "@/components/common/Icon";

export default function MobileNav({ items }: { items: Array<{ name: string; href: string }> }) {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const pathname = usePathname();
  const panelRef = useRef<HTMLElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close on navigation. Previously the panel stayed open across client-side
  // route changes, covering the page the user had just navigated to.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Escape to dismiss, and lock background scroll while the panel is up.
  useEffect(() => {
    if (!open) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }
    function onPointerDown(e: PointerEvent) {
      const target = e.target as Node;
      if (!panelRef.current?.contains(target) && !buttonRef.current?.contains(target)) {
        setOpen(false);
      }
    }

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);

    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  const links = [{ name: "Home", href: "/" }, ...items];

  return (
    <div className="md:hidden">
      <button
        ref={buttonRef}
        type="button"
        className="btn-secondary btn-icon"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <CloseIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
      </button>

      {open && (
        <>
          <div
            className="animate-fade-in fixed inset-x-0 bottom-0 top-16 z-30 bg-ink-900/25 backdrop-blur-[2px]"
            aria-hidden
          />
          <nav
            ref={panelRef}
            id={menuId}
            aria-label="Main"
            className="animate-fade-in-up absolute inset-x-0 top-16 z-40 max-h-[calc(100vh-4rem)] overflow-y-auto border-b border-ink-100 bg-surface shadow-lg"
          >
            <ul className="container-site space-y-0.5 py-3">
              {links.map((item) => {
                const active =
                  item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={`flex items-center justify-between rounded-lg px-3 py-3 text-sm font-medium transition-colors ${
                        active
                          ? "bg-accent-50 text-accent-800"
                          : "text-ink-700 hover:bg-ink-50 hover:text-ink-900"
                      }`}
                      onClick={() => setOpen(false)}
                    >
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </>
      )}
    </div>
  );
}
