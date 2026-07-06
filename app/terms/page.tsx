import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMetadata(
  "/terms",
  `Terms of Use — ${site.name}`,
  "The terms of use for FileForge Tools' free browser-based file conversion utilities."
);

export default function TermsPage() {
  return (
    <div className="container-site max-w-3xl py-10">
      <h1 className="text-3xl font-bold tracking-tight">Terms of use</h1>
      <p className="mt-2 text-sm text-ink-500">Last updated: July 2026</p>
      <div className="mt-6 space-y-6 leading-relaxed text-ink-700">
        <section>
          <h2 className="text-xl font-semibold text-ink-900">Use of the tools</h2>
          <p className="mt-2">
            {site.name} provides free, browser-based utilities for converting and manipulating files.
            You may use the tools for personal and commercial purposes. You are responsible for the
            files you process and for having the rights to use them.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-ink-900">No warranty</h2>
          <p className="mt-2">
            The tools are provided &quot;as is&quot; without warranty of any kind. While the tools are built
            and tested with care, we cannot guarantee that output files will be error-free or fit for
            a particular purpose. Always keep your original files.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-ink-900">Limitation of liability</h2>
          <p className="mt-2">
            To the maximum extent permitted by law, {site.name} is not liable for any damages arising
            from the use of, or inability to use, the tools — including loss of data or corrupted
            output files.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-ink-900">Acceptable use</h2>
          <p className="mt-2">
            You may not use the site in a way that disrupts its operation, attempts to circumvent its
            security, or violates applicable law.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-ink-900">Changes</h2>
          <p className="mt-2">
            These terms may be updated from time to time. Continued use of the site after changes are
            posted constitutes acceptance of the revised terms.
          </p>
        </section>
      </div>
    </div>
  );
}
