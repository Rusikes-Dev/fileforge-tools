export interface BlogSection {
  heading: string;
  paragraphs: string[];
}

export interface BlogPost {
  slug: string;
  /** <title> tag and H1 */
  title: string;
  /** Meta description */
  description: string;
  /** Shown on the blog index card */
  excerpt: string;
  /** ISO date string, e.g. "2026-07-07" */
  publishedAt: string;
  /** Opening paragraphs before the first heading */
  intro: string[];
  sections: BlogSection[];
  /** Slugs of tools to link to at the end of the post */
  relatedTools: string[];
}
