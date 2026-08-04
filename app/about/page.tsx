import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import { tools } from "@/lib/tools/registry";
import { categories } from "@/lib/tools/categories";
import { getToolsByCategory } from "@/lib/tools/registry";
import { CategoryIcon, ShieldCheckIcon } from "@/components/common/Icon";

export const metadata: Metadata = pageMetadata(
  "/about",
  `About — ${site.name}`,
  "FileForge Tools is a collection of free, browser-based file converters and document utilities built by an independent developer. Learn who makes the site, how it works, and why your files never leave your device."
);

const UPDATED = "4 August 2026";

export default function AboutPage() {
  return (
    <div className="container-site max-w-3xl py-12 sm:py-16">
      <h1 className="text-display-sm">About {site.name}</h1>
      <p className="mt-3 text-sm text-ink-500">Last updated: {UPDATED}</p>

      <p className="mt-6 text-lg leading-relaxed text-ink-700">
        {site.name} is a collection of {tools.length} free utilities for everyday file tasks —
        converting images, combining and splitting PDFs, cleaning up text, and formatting data for
        development work.
      </p>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {categories.map((c) => (
          <Link key={c.id} href={`/${c.id}`} className="card-interactive group flex items-center gap-3">
            <span
              aria-hidden
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-ink-100 bg-ink-50 text-ink-700 group-hover:border-accent-100 group-hover:bg-accent-50 group-hover:text-accent-700"
            >
              <CategoryIcon category={c.id} className="h-[18px] w-[18px]" />
            </span>
            <span className="min-w-0">
              <span className="block font-semibold text-ink-900 group-hover:text-accent-700">
                {c.name}
              </span>
              <span className="text-sm text-ink-500">{getToolsByCategory(c.id).length} tools</span>
            </span>
          </Link>
        ))}
      </div>

      <div className="prose-site mt-12">
        <h2>The idea behind it</h2>
        <p>
          The site is built around one principle:{" "}
          <strong>your files should not have to leave your device to be processed</strong>. Every
          tool here runs entirely in your browser. There is no upload step, no server-side queue and
          no stored copies of your documents.
        </p>
        <p>
          That approach has practical benefits beyond privacy. Conversions start instantly because
          nothing has to travel over the network, large files aren&apos;t throttled by upload speed,
          and the tools keep working on a flaky connection once the page has loaded.
        </p>
        <p>
          The project started with a simple frustration: nearly every &ldquo;free&rdquo; converter
          online wanted an upload, an account, a watermark, or all three — even for tasks a browser
          can do perfectly well on its own. {site.shortName} is the site I wished existed: fast,
          genuinely free, and private by architecture rather than by promise.
        </p>

        <h2>Who builds this</h2>
        <p>
          {site.name} is designed, built and maintained by <strong>{site.author.name}</strong>, an
          independent developer from Maharashtra, India. It is a solo project — every tool, every
          line of copy and every bug fix on this site comes from one person, not a content farm.
        </p>
        <p>
          You can follow development, report bugs or suggest new tools on{" "}
          <a href={site.author.github} target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          . For anything else, the fastest way to get in touch is the{" "}
          <Link href="/contact">contact page</Link> or email at{" "}
          <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>.
        </p>

        <h2>How the tools are tested</h2>
        <p>
          Every tool is exercised against real-world files before release — phone photos, scanned
          PDFs, exported spreadsheets, messy copy-pasted text — across Chrome, Firefox, Edge and
          Safari on both desktop and mobile. The conversion logic is additionally covered by an
          automated test suite that runs on every change.
        </p>
        <p>
          When a tool has a limitation — for example very large files being constrained by your
          device&apos;s memory, or scanned PDFs containing images rather than selectable text — the
          tool page says so plainly instead of hiding it.
        </p>

        <h2>Technology</h2>
        <p>
          The site is built with Next.js and TypeScript and hosted on Vercel. Image processing uses
          the browser&apos;s native canvas APIs, PDF operations use the open-source pdf-lib and
          pdf.js libraries, DOCX generation uses docx, and QR codes are generated with the qrcode
          library — all running locally in your browser.
        </p>

        <h2>How the site is funded</h2>
        <p>
          The tools are free, with no accounts and no artificial limits. Hosting costs are modest
          because there are no servers processing files. The site displays unobtrusive advertising
          on content areas to cover running costs — never inside a tool&apos;s working area, and
          never in a way that interferes with using it.
        </p>
        <p>
          Your files are never involved in advertising in any form, because they never leave your
          device in the first place. Advertising scripts run in a separate context and have no
          access to anything you process. See the <Link href="/privacy">privacy policy</Link> for
          the full detail.
        </p>
      </div>

      <aside className="mt-12 rounded-2xl border border-accent-100 bg-accent-50 p-6">
        <h2 className="flex items-center gap-2 text-base font-semibold text-accent-800">
          <ShieldCheckIcon className="h-[18px] w-[18px]" />
          Don&apos;t take our word for it
        </h2>
        <p className="mt-2.5 text-sm leading-relaxed text-ink-700">
          Open your browser&apos;s developer tools, switch to the Network tab, and run any tool with
          a file. No request carrying your file will appear. You can also disconnect from the
          internet after the page loads — the tools keep working, because the code doing the work is
          already on your machine.
        </p>
      </aside>
    </div>
  );
}
