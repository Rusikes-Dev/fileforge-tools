import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import { tools } from "@/lib/tools/registry";

export const metadata: Metadata = pageMetadata(
  "/about",
  `About — ${site.name}`,
  "FileForge Tools is a collection of free, browser-based file converters and document utilities. Learn how the site works and why your files never leave your device."
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
        <p>
          The tools are free, with no accounts and no artificial limits. If something doesn&apos;t work
          the way you expect, please <Link href="/contact" className="text-accent-700 underline">let us know</Link>.
        </p>
      </div>
      <h2 className="mt-10 text-xl font-semibold">Technology</h2>
      <p className="mt-3 leading-relaxed text-ink-700">
        The site is built with Next.js and TypeScript. Image processing uses the browser&apos;s native
        canvas APIs, PDF operations use the open-source pdf-lib library, and QR codes are generated
        with the qrcode library — all running locally in your browser.
      </p>
      <a href="https://launchbuff.com" target="_blank" rel="noopener noreferrer" title="Featured on LaunchBuff">
        <img src="https://launchbuff.com/badge-featured-dark.svg" alt="Featured on LaunchBuff" width="256" height="80" />
      </a>
    </div>
  );
}
