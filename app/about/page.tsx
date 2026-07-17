import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import { tools } from "@/lib/tools/registry";

export const metadata: Metadata = pageMetadata(
  "/about",
  `About — ${site.name}`,
  "FileForge Tools is a collection of free, browser-based file converters and document utilities built by an independent developer. Learn who makes the site, how it works, and why your files never leave your device."
);

export default function AboutPage() {
  return (
    <div className="container-site max-w-3xl py-10">
      <h1 className="text-3xl font-bold tracking-tight">About {site.name}</h1>
      <div className="mt-4 space-y-4 leading-relaxed text-ink-700">
        <p>
          {site.name} is a collection of {tools.length} free utilities for everyday file tasks:
          converting images between formats, combining and splitting PDFs, cleaning up text, and
          formatting data for development work.
        </p>
        <p>
          The site is built around one idea: <strong className="text-ink-900">your files should not
          have to leave your device to be processed</strong>. Every tool here runs entirely in your
          browser using JavaScript and WebAssembly-era browser APIs. There is no upload step, no
          server-side queue and no stored copies of your documents.
        </p>
        <p>
          That approach has practical benefits beyond privacy. Conversions start instantly because
          nothing has to travel over the network, large files aren&apos;t throttled by upload speed, and
          the tools keep working on flaky connections once the page has loaded.
        </p>
      </div>

      <h2 className="mt-10 text-xl font-semibold">Who builds this</h2>
      <div className="mt-3 space-y-4 leading-relaxed text-ink-700">
        <p>
          {site.name} is designed, built and maintained by{" "}
          <strong className="text-ink-900">{site.author.name}</strong>, an independent developer
          from Maharashtra, India. It is a solo project — every tool, every line of copy and every
          bug fix on this site comes from one person, not a content farm.
        </p>
        <p>
          The project started with a simple frustration: nearly every &quot;free&quot; converter online
          wanted an upload, an account, a watermark, or all three — even for tasks a browser can
          do perfectly well on its own. {site.shortName} is the site I wished existed: fast,
          genuinely free, and private by architecture rather than by promise.
        </p>
        <p>
          You can follow development, report bugs or suggest new tools on GitHub:{" "}
          <a
            href={site.author.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent-700 underline"
          >
            github.com/Rusikes-Dev
          </a>
          . For anything else, the fastest way to reach me is the{" "}
          <Link href="/contact" className="text-accent-700 underline">
            contact page
          </Link>{" "}
          or email at{" "}
          <a href={`mailto:${site.contactEmail}`} className="text-accent-700 underline">
            {site.contactEmail}
          </a>
          .
        </p>
      </div>

      <h2 className="mt-10 text-xl font-semibold">How the tools are tested</h2>
      <p className="mt-3 leading-relaxed text-ink-700">
        Every tool is exercised against real-world files before release — phone photos, scanned
        PDFs, exported spreadsheets, messy copy-pasted text — across Chrome, Firefox, Edge and
        Safari on both desktop and mobile. When a tool has a limitation (for example, very large
        files being constrained by your device&apos;s memory), the tool page says so plainly instead of
        hiding it.
      </p>

      <h2 className="mt-10 text-xl font-semibold">Technology</h2>
      <p className="mt-3 leading-relaxed text-ink-700">
        The site is built with Next.js and TypeScript and hosted on Vercel. Image processing uses
        the browser&apos;s native canvas APIs, PDF operations use the open-source pdf-lib library, and
        QR codes are generated with the qrcode library — all running locally in your browser.
      </p>

      <h2 className="mt-10 text-xl font-semibold">How the site is funded</h2>
      <p className="mt-3 leading-relaxed text-ink-700">
        The tools are free, with no accounts and no artificial limits. Hosting costs are modest
        because there are no servers processing files. The site may show unobtrusive ads on
        content pages to cover running costs — never inside the tools&apos; working areas, and never in
        a way that interferes with using them. Your files are never involved in advertising in any
        form, because they never leave your device in the first place.
      </p>
    </div>
  );
}
