export const site = {
  name: "FileForge Tools",
  shortName: "FileForge",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  description:
    "Free online file converter and document tools. Convert images, work with PDFs, clean up text and use developer utilities — processed locally in your browser.",
  tagline: "Free Online File Converter & Document Tools",
  contactEmail: "hello@fileforge.tools",
};

export function absoluteUrl(path: string): string {
  return new URL(path, site.url).toString();
}
