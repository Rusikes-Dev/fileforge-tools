export type ToolCategoryId =
  | "image-tools"
  | "pdf-tools"
  | "text-tools"
  | "developer-tools";

export interface ToolFaq {
  q: string;
  a: string;
}

export interface ToolDef {
  slug: string;
  /** Full H1, e.g. "JPG to PDF Converter" */
  name: string;
  /** Short label used in cards and links */
  shortName: string;
  category: ToolCategoryId;
  /** <title> tag */
  title: string;
  /** Meta description */
  description: string;
  /** One or two sentences shown under the H1 */
  intro: string;
  /** Longer explanation shown below the tool, one or more paragraphs */
  about: string[];
  /** Specific scenarios where someone would reach for this tool */
  useCases: string[];
  /** Practical, tool-specific tips */
  tips: string[];
  steps: string[];
  inputFormats: string[];
  outputFormats: string[];
  /** Alternative search phrases for client-side tool search */
  aliases: string[];
  /** Slugs of related tools */
  related: string[];
  faqs: ToolFaq[];
  processing: "browser";
  indexable: boolean;
  popular?: boolean;
}

export interface CategoryDef {
  id: ToolCategoryId;
  name: string;
  title: string;
  description: string;
  intro: string;
  /** Additional paragraphs shown on the category hub page */
  about: string[];
}
