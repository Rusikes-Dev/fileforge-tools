import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMetadata(
  "/disclaimer",
  `Disclaimer — ${site.name}`,
  "The limits of what FileForge Tools guarantees: accuracy, availability, file safety and third-party content."
);

const UPDATED = "4 August 2026";

export default function DisclaimerPage() {
  return (
    <div className="container-site max-w-3xl py-12 sm:py-16">
      <h1 className="text-display-sm">Disclaimer</h1>
      <p className="mt-3 text-sm text-ink-500">Last updated: {UPDATED}</p>

      <div className="prose-site mt-8">
        <h2>General information</h2>
        <p>
          {site.name} provides free, browser-based file and text utilities for general use. The
          tools and the accompanying guides are offered for informational and practical purposes.
          While we work to keep everything accurate and reliable, we make no warranty that any tool
          is free of defects or suitable for a particular purpose.
        </p>

        <h2>Keep your originals</h2>
        <p>
          File conversion is lossy or destructive in some cases by nature — compressing an image
          discards data, and splitting a PDF produces new documents. Always keep an unmodified copy
          of any file you care about before processing it. We cannot recover a file for you, because
          we never receive one in the first place.
        </p>

        <h2>Accuracy of results</h2>
        <p>
          Output depends heavily on the input. Unusual, malformed, encrypted or very large files may
          convert imperfectly or fail entirely. Text extracted from a PDF, for example, depends on
          how that PDF was produced — a scanned page contains images rather than text, so no text
          extraction tool can recover words from it without optical character recognition. Please
          check results before relying on them for anything important.
        </p>

        <h2>No professional advice</h2>
        <p>
          Nothing on this site constitutes legal, financial, medical or other professional advice.
          Articles on the blog are general guidance about file formats and workflows only.
        </p>

        <h2>Availability</h2>
        <p>
          The site is provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis. We do
          not guarantee uninterrupted access, and tools may change or be removed. Because processing
          happens in your browser, results also depend on your device&apos;s memory and your
          browser&apos;s capabilities.
        </p>

        <h2>External links</h2>
        <p>
          Some pages link to third-party websites for reference. We do not control those sites and
          are not responsible for their content, accuracy or privacy practices. A link is not an
          endorsement.
        </p>

        <h2>Advertising</h2>
        <p>
          Advertisements displayed on this site are supplied by third-party networks. We do not
          select individual adverts and do not endorse the products or services they promote. See
          the <Link href="/privacy">privacy policy</Link> for how advertising data is handled.
        </p>

        <h2>Limitation of liability</h2>
        <p>
          To the fullest extent permitted by law, {site.name} and its author are not liable for any
          loss or damage — including data loss, lost profits or business interruption — arising from
          use of, or inability to use, this site. Your use of the tools is at your own risk. This
          section should be read together with the <Link href="/terms">terms of use</Link>.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about this disclaimer can be sent to{" "}
          <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>.
        </p>
      </div>
    </div>
  );
}
