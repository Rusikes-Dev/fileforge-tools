export const site = {
  name: "FileForge Tools",
  shortName: "FileForge",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  description:
    "Free online file converter and document tools. Convert images, work with PDFs, clean up text and use developer utilities — processed locally in your browser.",
  tagline: "Free Online File Converter & Document Tools",
  // NOTE: You asked for "www.rushikeshlade7@gmail.com". Gmail ignores dots,
  // so mail sent to www.rushikeshlade7@gmail.com is delivered to the account
  // "wwwrushikeshlade7" — which is a DIFFERENT account from "rushikeshlade7".
  // If your Gmail login is rushikeshlade7@gmail.com, keep the line below as-is.
  // If your login really is wwwrushikeshlade7@gmail.com, change it back.
  // Verify by sending yourself a test email at this address before deploying.
  contactEmail: "rushikeshlade7@gmail.com",
  author: {
    name: "Rushikesh Lade",
    github: "https://github.com/Rusikes-Dev",
  },
};

export function absoluteUrl(path: string): string {
  return new URL(path, site.url).toString();
}
