import Link from "next/link";
import { site } from "@/lib/site";

/** Logo + wordmark, shared by the header and footer so they never drift. */
export default function BrandMark({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`group flex shrink-0 items-center gap-2.5 rounded-xl text-[17px] font-bold tracking-tight text-ink-900 ${className}`}
    >
      <span
        aria-hidden
        className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[rgb(var(--btn-a))] via-[rgb(var(--btn-b))] to-[rgb(var(--aurora-2))] text-sm font-extrabold text-white shadow-glow transition-transform duration-300 ease-spring group-hover:-rotate-6 group-hover:scale-110"
      >
        F
        <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-surface bg-[rgb(var(--aurora-4))]" />
      </span>
      {/* Wordmark folds away on very narrow phones so the header buttons still
          fit; the link keeps its accessible name. */}
      <span className="max-[359px]:sr-only">
        {site.shortName}
        <span className="text-gradient">.</span>
      </span>
    </Link>
  );
}
