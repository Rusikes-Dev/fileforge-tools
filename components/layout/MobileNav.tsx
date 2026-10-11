"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { CategoryIcon, CloseIcon, MenuIcon, SparkleIcon, StarsIcon } from "@/components/common/Icon";
import type { ToolCategoryId } from "@/lib/tools/types";

const categoryByHref: Record<string, ToolCategoryId> = {
  "/image-tools": "image-tools",
  "/pdf-tools": "pdf-tools",
  "/text-tools": "text-tools",
  "/developer-tools": "developer-tools",
};

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

  // Escape to dismiss, outside-tap to dismiss, and lock background scroll while
  // the panel is up.
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

  // Rendered through a portal for the same reason as the search palette: the
  // header's backdrop-filter makes it the containing block for fixed children,
  // which collapsed the backdrop to 0px tall and clipped the panel to the header.
  const overlay = (
    <>
      <div
        className="animate-fade-in fixed inset-x-0 bottom-0 top-16 z-[90] bg-ink-900/50 backdrop-blur-sm md:hidden"
        aria-hidden
      />
      <nav
        ref={panelRef}
        id={menuId}
        aria-label="Main"
        className="animate-slide-in-up fixed inset-x-3 top-[4.25rem] z-[95] max-h-[calc(100dvh-5rem)] overflow-y-auto rounded-3xl border border-ink-100 bg-surface p-2 shadow-lg md:hidden"
      >
        <ul className="space-y-0.5">
          {links.map((item, i) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            const category = categoryByHref[item.href];
            return (
              <li
                key={item.href}
                className="animate-fade-in-up"
                style={{ animationDelay: `${i * 35}ms` } as CSSProperties}
              >
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  data-cat={category}
                  className={`flex items-center gap-3 rounded-2xl px-3 py-3 text-[15px] font-semibold transition-colors ${
                    active
                      ? "bg-accent-50 text-accent-800"
                      : "text-ink-700 hover:bg-ink-50 hover:text-ink-900"
                  }`}
                  onClick={() => setOpen(false)}
                >
                  <span aria-hidden className="tile !h-9 !w-9 !rounded-xl">
                    {category ? (
                      <CategoryIcon category={category} className="h-[18px] w-[18px]" />
                    ) : item.href === "/" ? (
                      <SparkleIcon className="h-[18px] w-[18px]" />
                    ) : (
                      <StarsIcon className="h-[18px] w-[18px]" />
                    )}
                  </span>
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );

  return (
    <div className="md:hidden">
      <button
        ref={buttonRef}
        type="button"
        className="btn-secondary btn-icon"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <CloseIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
      </button>

      {open && typeof document !== "undefined" && createPortal(overlay, document.body)}
    </div>
  );
}
