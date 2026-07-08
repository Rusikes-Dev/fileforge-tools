import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMetadata(
  "/contact",
  `Contact — ${site.name}`,
  "Report a bug, suggest a tool, or ask a question about FileForge Tools."
);

export default function ContactPage() {
  return (
    <div className="container-site max-w-3xl py-10">
      <h1 className="text-3xl font-bold tracking-tight">Contact</h1>
      <div className="mt-4 space-y-4 leading-relaxed text-ink-700">
        <p>
          Found a bug, have a question, or want to suggest a new tool? We&apos;d love to hear from you.
        </p>
        <p>
          Email us at{" "}
          <a href="mailto:rushikeshlade7@gmail.com" className="font-medium text-accent-700 underline">
            rushikeshlade7@gmail.com
          </a>
          . Please include the name of the tool, your browser, and — if reporting a bug — the steps
          that led to the problem. Don&apos;t attach confidential files; a description of the file type
          and size is enough.
        </p>
        <p className="text-sm text-ink-500">
          Because this site has no server-side components, there is no contact form — email keeps
          things simple and keeps the site free of tracking scripts.
        </p>
      </div>
    </div>
  );
}
