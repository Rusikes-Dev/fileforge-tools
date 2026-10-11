import Link from "next/link";
import { site } from "@/lib/site";
import { GithubIcon, MailIcon, ShieldCheckIcon } from "../common/Icon";
import BrandMark from "../common/BrandMark";
import CookieSettingsButton from "../common/CookieSettingsButton";

const columns = [
  {
    heading: "Categories",
    links: [
      { name: "All tools", href: "/tools" },
      { name: "Image tools", href: "/image-tools" },
      { name: "PDF tools", href: "/pdf-tools" },
      { name: "Text tools", href: "/text-tools" },
      { name: "Developer tools", href: "/developer-tools" },
    ],
  },
  {
    heading: "Popular tools",
    links: [
      { name: "JPG to PDF", href: "/jpg-to-pdf" },
      { name: "Merge PDF", href: "/merge-pdf" },
      { name: "Compress PDF", href: "/compress-pdf" },
      { name: "Image compressor", href: "/image-compressor" },
      { name: "Word counter", href: "/word-counter" },
      { name: "JSON formatter", href: "/json-formatter" },
    ],
  },
  {
    heading: "Site",
    links: [
      { name: "Blog", href: "/blog" },
      { name: "About", href: "/about" },
      { name: "Contact", href: "/contact" },
      { name: "Sitemap", href: "/sitemap.xml" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { name: "Privacy policy", href: "/privacy" },
      { name: "Terms of use", href: "/terms" },
      { name: "Disclaimer", href: "/disclaimer" },
      { name: "Cookie policy", href: "/cookies" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative mt-auto border-t border-ink-100 bg-ink-50">
      {/* Aurora hairline across the top edge. */}
      <span
        aria-hidden
        className="absolute inset-x-0 -top-px h-[2px] bg-gradient-to-r from-transparent via-[rgb(var(--aurora-2))] to-transparent opacity-70"
      />
      <div className="container-site py-14">
        <div className="grid gap-10 md:grid-cols-[minmax(0,1.4fr)_repeat(4,minmax(0,1fr))]">
          {/* Brand + promise */}
          <div>
            <BrandMark className="w-fit" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-500">
              Free file conversion and document utilities that run entirely in your browser. Your
              files stay on your device.
            </p>
            <p className="badge-accent mt-4">
              <ShieldCheckIcon className="h-3.5 w-3.5" />
              No uploads · No tracking of files
            </p>

            <div className="mt-5 flex items-center gap-2">
              <a
                href={site.author.github}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary btn-sm btn-icon"
                aria-label="GitHub profile (opens in a new tab)"
              >
                <GithubIcon className="h-4 w-4" />
              </a>
              <a
                href={`mailto:${site.contactEmail}`}
                className="btn-secondary btn-sm btn-icon"
                aria-label="Email us"
              >
                <MailIcon className="h-4 w-4" />
              </a>
            </div>
          </div>

          {columns.map((col) => (
            <nav key={col.heading} aria-label={col.heading}>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-ink-900">
                {col.heading}
              </h2>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="inline-block text-sm text-ink-500 transition-all duration-200 hover:translate-x-1 hover:text-ink-900"
                    >
                      {l.name}
                    </Link>
                  </li>
                ))}
                {col.heading === "Legal" && (
                  <li>
                    <CookieSettingsButton />
                  </li>
                )}
              </ul>
            </nav>
          ))}
        </div>
      </div>

      <div className="border-t border-ink-100">
        <div className="container-site flex flex-col gap-2 py-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-ink-500">
            © {new Date().getFullYear()} {site.name}. All tools are free to use.
          </p>
          <p className="text-xs text-ink-500">
            Built by{" "}
            <a
              href={site.author.github}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-ink-700 underline underline-offset-2 hover:text-ink-900"
            >
              {site.author.name}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
