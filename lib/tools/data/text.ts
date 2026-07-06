import type { ToolDef } from "../types";

export const textTools: ToolDef[] = [
  {
    slug: "word-counter",
    name: "Word Counter",
    shortName: "Word Counter",
    category: "text-tools",
    title: "Word Counter — Count Words, Characters & Sentences",
    description:
      "Count words, characters, sentences and paragraphs as you type. Includes reading time estimate. Free, private, runs in your browser.",
    intro:
      "Paste or type text to get a live count of words, characters, sentences and paragraphs, plus an estimated reading time.",
    about:
      "Word limits are everywhere — essays, ad copy, meta descriptions, application forms. This counter updates live as you type and counts words the way word processors do: sequences of characters separated by whitespace, with hyphenated words counted once. Reading time is estimated at a typical 220 words per minute. Everything stays in the text box on your device; nothing is sent anywhere.",
    steps: [
      "Paste or type your text into the box.",
      "Counts update instantly as you edit.",
      "Check words, characters (with and without spaces), sentences and paragraphs.",
      "Use the reading time estimate for speeches or articles.",
    ],
    inputFormats: ["Plain text"],
    outputFormats: ["Statistics"],
    aliases: ["count words", "essay word count", "how many words"],
    related: ["character-counter", "text-statistics", "remove-extra-spaces", "case-converter"],
    faqs: [
      {
        q: "How are words counted — does it match Microsoft Word?",
        a: "Words are whitespace-separated tokens, the same rule Word and Google Docs use, so counts match in practice. Edge cases like em-dashes joining words can differ by a word or two between any two counters.",
      },
      {
        q: "Do numbers and symbols count as words?",
        a: "Yes — any standalone token counts, so \"2026\" is one word, matching how word processors count.",
      },
      {
        q: "Is my text stored or sent anywhere?",
        a: "No. Counting happens in your browser as you type; the text never leaves the page.",
      },
    ],
    processing: "browser",
    indexable: true,
    popular: true,
  },
  {
    slug: "character-counter",
    name: "Character Counter",
    shortName: "Character Counter",
    category: "text-tools",
    title: "Character Counter — With and Without Spaces, Live",
    description:
      "Count characters with and without spaces in real time. Track limits for titles, meta descriptions, SMS and social posts. Private and free.",
    intro:
      "See a live character count — with and without spaces — as you type, plus line and word counts for context.",
    about:
      "Character limits are stricter than word limits: page titles (~60 characters), meta descriptions (~155), SMS segments (160), and many form fields. This counter shows characters with spaces, characters without spaces, plus words and lines so you can trim to fit a limit precisely. Unicode characters, including emoji and accented letters, are counted as people expect — one visible character each.",
    steps: [
      "Paste or type text in the box.",
      "Watch the character counts update live.",
      "Use \"without spaces\" for limits that exclude whitespace.",
      "Edit until you're inside your limit.",
    ],
    inputFormats: ["Plain text"],
    outputFormats: ["Statistics"],
    aliases: ["letter count", "count characters", "character limit checker"],
    related: ["word-counter", "text-statistics", "remove-extra-spaces"],
    faqs: [
      {
        q: "How are emoji and accented characters counted?",
        a: "As single characters, the way people read them. (Internally some emoji occupy multiple code units, but the visible-character count is what limits usually mean.)",
      },
      {
        q: "Do line breaks count as characters?",
        a: "Yes, each line break counts as one character in the \"with spaces\" figure, matching how most platforms enforce limits.",
      },
      {
        q: "What are common character limits I should know?",
        a: "Roughly: page titles 60, meta descriptions 155, X/Twitter posts 280, SMS segments 160, LinkedIn headlines 220. Always verify against the platform's current rules.",
      },
    ],
    processing: "browser",
    indexable: true,
    popular: true,
  },
  {
    slug: "case-converter",
    name: "Case Converter",
    shortName: "Case Converter",
    category: "text-tools",
    title: "Case Converter — UPPER, lower, Title & Sentence Case",
    description:
      "Convert text between UPPERCASE, lowercase, Title Case and Sentence case instantly in your browser. Copy the result with one click.",
    intro:
      "Fix text typed in the wrong case. Convert to UPPERCASE, lowercase, Title Case or Sentence case and copy the result.",
    about:
      "Retyping a paragraph because caps lock was on is wasted effort. Paste the text, click a case, and copy the result. Title Case capitalizes each word's first letter; Sentence case capitalizes the first letter after each sentence-ending punctuation mark and lowercases the rest. Conversions are instant and reversible — your original stays in the input box.",
    steps: [
      "Paste the text with the wrong casing.",
      "Click UPPERCASE, lowercase, Title Case or Sentence case.",
      "Review the output box.",
      "Click Copy result.",
    ],
    inputFormats: ["Plain text"],
    outputFormats: ["Plain text"],
    aliases: ["uppercase to lowercase", "capitalize text", "caps lock fix", "change text case"],
    related: ["remove-extra-spaces", "find-and-replace-text", "word-counter"],
    faqs: [
      {
        q: "Does Title Case handle small words like \"and\" or \"the\"?",
        a: "This converter capitalizes every word, which is the safest general rule. Style guides differ on lowercasing short words — adjust those few by hand if your style guide requires it.",
      },
      {
        q: "Will Sentence case fix names like \"london\"?",
        a: "No — it only knows sentence boundaries, not proper nouns. Correct names afterwards; the Find and Replace tool can help for repeated ones.",
      },
      {
        q: "Is there a length limit?",
        a: "No practical one — conversion is instant even for very long documents, because it all happens in your browser.",
      },
    ],
    processing: "browser",
    indexable: true,
  },
  {
    slug: "remove-duplicate-lines",
    name: "Remove Duplicate Lines",
    shortName: "Remove Duplicates",
    category: "text-tools",
    title: "Remove Duplicate Lines from Text — Free Online Tool",
    description:
      "Delete duplicate lines from lists and text. Case-sensitive or insensitive matching, keeps first occurrence, shows how many were removed.",
    intro:
      "Clean duplicate entries out of any list — emails, URLs, keywords, log lines. The first occurrence of each line is kept and the rest are removed.",
    about:
      "Merged mailing lists, exported keyword sets and concatenated logs accumulate duplicates that are tedious to remove by hand. Paste the list and the tool keeps the first occurrence of each line, preserving your original order. Case-insensitive matching treats \"Apple\" and \"apple\" as the same entry; optional whitespace trimming catches lines that differ only by stray spaces. The result reports exactly how many duplicates were removed.",
    steps: [
      "Paste your list, one entry per line.",
      "Choose case-sensitive or insensitive matching, and whether to trim spaces.",
      "Click Remove duplicates.",
      "Copy the cleaned list — the summary shows how many lines were removed.",
    ],
    inputFormats: ["Plain text"],
    outputFormats: ["Plain text"],
    aliases: ["dedupe list", "unique lines", "delete repeated lines"],
    related: ["sort-lines", "remove-extra-spaces", "find-and-replace-text"],
    faqs: [
      {
        q: "Which copy of a duplicate is kept?",
        a: "The first one, in its original position — the rest are removed, so your list order is preserved.",
      },
      {
        q: "Are \"Item\" and \"item \" treated as duplicates?",
        a: "Only if you enable the matching options: case-insensitive matching equates the capitalization, and trimming ignores leading/trailing spaces. Both are optional so you stay in control.",
      },
      {
        q: "Can I deduplicate and sort at the same time?",
        a: "Deduplicate here first, then paste the result into the Sort Lines tool — keeping the steps separate makes each result easy to verify.",
      },
    ],
    processing: "browser",
    indexable: true,
  },
  {
    slug: "sort-lines",
    name: "Sort Text Lines",
    shortName: "Sort Lines",
    category: "text-tools",
    title: "Sort Lines Alphabetically or Numerically — Online",
    description:
      "Sort lines of text A–Z, Z–A, numerically or by length, with optional case-insensitive comparison. Fast, private, browser-based.",
    intro:
      "Put any list in order: alphabetical (A–Z or Z–A), natural numeric order, or by line length — with one click.",
    about:
      "Plain alphabetical sorting puts \"item10\" before \"item2\" because it compares character by character. The natural sort option here compares embedded numbers by value, producing the order humans expect. You can also sort case-insensitively, reverse any order, or sort by line length, which is useful for reviewing data exports and organizing word lists.",
    steps: [
      "Paste your lines into the input box.",
      "Pick a sort: A–Z, Z–A, natural/numeric, or by length.",
      "Toggle case-insensitive if capitalization shouldn't matter.",
      "Click Sort lines and copy the result.",
    ],
    inputFormats: ["Plain text"],
    outputFormats: ["Plain text"],
    aliases: ["alphabetize list", "sort alphabetically", "order lines", "az sort"],
    related: ["remove-duplicate-lines", "remove-extra-spaces", "text-statistics"],
    faqs: [
      {
        q: "Why does normal sorting put item10 before item2?",
        a: "Character-by-character comparison sees \"1\" before \"2\" and stops there. Choose the natural sort option to compare the numbers by value: item2, then item10.",
      },
      {
        q: "How are empty lines handled?",
        a: "Empty lines sort to the top in ascending order. If you don't want them, remove blank lines first with the Remove Extra Spaces tool.",
      },
      {
        q: "Does sorting handle accented characters sensibly?",
        a: "Yes — locale-aware comparison places accented letters next to their base letters (é near e) instead of at the end of the alphabet.",
      },
    ],
    processing: "browser",
    indexable: true,
  },
  {
    slug: "remove-extra-spaces",
    name: "Remove Extra Spaces",
    shortName: "Remove Extra Spaces",
    category: "text-tools",
    title: "Remove Extra Spaces & Blank Lines from Text",
    description:
      "Collapse double spaces, trim line ends and delete blank lines from pasted text. Choose exactly which cleanups to apply. Browser-based.",
    intro:
      "Clean up messy whitespace: collapse repeated spaces, trim the ends of lines, and remove empty lines — each cleanup individually selectable.",
    about:
      "Text copied from PDFs, emails and websites arrives full of doubled spaces, trailing whitespace and stray blank lines. Rather than one opaque \"clean\" button, this tool lets you choose exactly which fixes to apply: collapse multiple spaces into one, trim whitespace from line starts/ends, remove blank lines, or collapse multiple blank lines into a single one to keep paragraph breaks. The summary shows how many characters were removed.",
    steps: [
      "Paste the messy text.",
      "Tick the cleanups you want: collapse spaces, trim lines, remove or collapse blank lines.",
      "Click Clean text.",
      "Copy the tidied result.",
    ],
    inputFormats: ["Plain text"],
    outputFormats: ["Plain text"],
    aliases: ["remove whitespace", "delete blank lines", "fix double spaces", "clean text"],
    related: ["remove-duplicate-lines", "find-and-replace-text", "word-counter"],
    faqs: [
      {
        q: "Will paragraph breaks be preserved?",
        a: "Yes, if you choose \"collapse multiple blank lines\" instead of \"remove blank lines\" — runs of empty lines become exactly one, keeping paragraphs separated.",
      },
      {
        q: "Does it remove tabs and non-breaking spaces?",
        a: "Yes — the collapse option treats tabs and non-breaking spaces (common in text copied from web pages) as spaces, which fixes most invisible-character problems.",
      },
      {
        q: "Why does text copied from a PDF have so many odd spaces?",
        a: "PDFs position text visually rather than storing clean paragraphs, so copying reconstructs spacing imperfectly. This cleanup is exactly for that case.",
      },
    ],
    processing: "browser",
    indexable: true,
  },
  {
    slug: "find-and-replace-text",
    name: "Find and Replace Text",
    shortName: "Find & Replace",
    category: "text-tools",
    title: "Find and Replace Text Online — With Match Count",
    description:
      "Find and replace text in your browser with case-sensitive, whole-word and regex options. See the match count before replacing.",
    intro:
      "Replace every occurrence of a word or phrase in pasted text. Supports case-sensitive matching, whole words only, and regular expressions.",
    about:
      "This is the find-and-replace from your editor, available anywhere: paste text, enter what to find and what to replace it with, and see how many matches exist before committing. Whole-word matching prevents \"cat\" from changing \"category\"; regex mode unlocks pattern replacements like normalizing dates or stripping prefixes, with clear errors when a pattern is invalid.",
    steps: [
      "Paste the text to edit.",
      "Enter the search term and its replacement.",
      "Toggle case sensitivity, whole word, or regex as needed — the match count updates.",
      "Click Replace all and copy the result.",
    ],
    inputFormats: ["Plain text"],
    outputFormats: ["Plain text"],
    aliases: ["replace word in text", "substitute text", "regex replace online"],
    related: ["case-converter", "remove-extra-spaces", "remove-duplicate-lines"],
    faqs: [
      {
        q: "How do I avoid replacing partial words?",
        a: "Enable \"whole words only\". Then replacing \"art\" won't touch \"start\" or \"artist\" — only standalone occurrences of \"art\".",
      },
      {
        q: "Can I use regular expressions?",
        a: "Yes. Switch on regex mode to use JavaScript regular expressions, including capture groups referenced as $1, $2 in the replacement.",
      },
      {
        q: "Can I preview how many changes will happen?",
        a: "The live match counter shows exactly how many occurrences the current settings find before you click Replace.",
      },
    ],
    processing: "browser",
    indexable: true,
  },
  {
    slug: "text-statistics",
    name: "Text Statistics",
    shortName: "Text Statistics",
    category: "text-tools",
    title: "Text Statistics — Word Frequency, Averages & Readability",
    description:
      "Analyze text: word and sentence counts, averages, most frequent words, reading and speaking time. Private, in-browser analysis.",
    intro:
      "Go beyond a simple count: see average word and sentence length, your most frequent words, and estimated reading and speaking times.",
    about:
      "Where the Word Counter answers \"how much?\", this tool answers \"what is it like?\". It computes average word length and words per sentence (long averages suggest dense prose), lists your ten most frequent meaningful words to reveal repetition, and estimates both silent reading time (~220 wpm) and speaking time (~140 wpm) for presentations. Common stop-words like \"the\" and \"of\" are excluded from the frequency list so it reflects your actual vocabulary.",
    steps: [
      "Paste the text you want to analyze.",
      "Review counts, averages and the top-ten word list.",
      "Use speaking time to plan a talk, reading time for articles.",
      "Edit the text and watch the statistics update.",
    ],
    inputFormats: ["Plain text"],
    outputFormats: ["Statistics"],
    aliases: ["word frequency counter", "analyze text", "reading time calculator", "speech length"],
    related: ["word-counter", "character-counter", "remove-extra-spaces"],
    faqs: [
      {
        q: "How is speaking time estimated?",
        a: "At about 140 words per minute, a comfortable presentation pace. Fast conversational speech runs closer to 160–180 wpm, so treat the figure as a planning guide.",
      },
      {
        q: "Why doesn't \"the\" appear in the frequency list?",
        a: "Common function words are filtered out so the list shows the vocabulary that actually characterizes your text.",
      },
      {
        q: "What's a good average sentence length?",
        a: "Clear non-fiction typically averages 15–20 words per sentence. Well above that, consider splitting sentences; well below can read as choppy.",
      },
    ],
    processing: "browser",
    indexable: true,
  },
];
