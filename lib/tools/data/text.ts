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
    about: [
      "Word limits are everywhere — essays, ad copy, meta descriptions, application forms. This counter updates live as you type and counts words the way word processors do: sequences of characters separated by whitespace, with hyphenated words counted once. Reading time is estimated at a typical 220 words per minute. Everything stays in the text box on your device; nothing is sent anywhere.",
      "This is especially useful for anything with a strict word ceiling — a college application essay, a scholarship submission, a press release with an editorial limit — where going even slightly over can mean a form rejects your submission outright.",
    ],
    useCases: [
      "Checking an essay or application response stays within a strict word limit",
      "Estimating how long a speech or presentation script will take to deliver",
      "Tracking word count while drafting a blog post or article against an editorial target",
    ],
    tips: [
      "If a form has a strict limit, count here first — some platforms count words differently, so leave a small buffer under the stated maximum.",
      "Use the paragraph count alongside the word count to judge whether a long piece of writing needs to be broken up for readability.",
    ],
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
      {
        q: "Why might my word count differ slightly from another tool?",
        a: "Small differences usually come from how hyphens, em-dashes, or numbers are treated as word boundaries. These edge cases rarely shift the count by more than one or two words.",
      },
      {
        q: "How accurate is the reading time estimate?",
        a: "It's based on an average adult reading pace of about 220 words per minute. Dense or technical writing will take longer to read than the estimate suggests, and skimming will be faster.",
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
    about: [
      "Character limits are stricter than word limits: page titles (~60 characters), meta descriptions (~155), SMS segments (160), and many form fields. This counter shows characters with spaces, characters without spaces, plus words and lines so you can trim to fit a limit precisely. Unicode characters, including emoji and accented letters, are counted as people expect — one visible character each.",
      "This matters most for anything with a hard platform-enforced cutoff, where a submission that's even one character too long gets truncated or rejected outright — a page title that gets cut off mid-word in search results, or a social post that fails to publish.",
    ],
    useCases: [
      "Writing a page title or meta description that fits within a search engine's display limit",
      "Fitting a social media post or bio within a platform's exact character cap",
      "Checking a form field response won't be truncated by a hidden character limit",
    ],
    tips: [
      "For SEO titles and meta descriptions, aim comfortably under the limit rather than exactly at it — search engines sometimes render slightly differently across devices.",
      "If you're counting for SMS, remember that some special characters can switch a message into a mode with a lower per-segment limit — check your carrier's specifics for anything unusual.",
    ],
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
      {
        q: "Why does my character count differ from what a platform shows?",
        a: "Some platforms count certain emoji or special characters as more than one character internally, even though they display as one symbol. If your count is close to a limit, leave a small buffer to be safe.",
      },
      {
        q: "Should I count with spaces or without spaces for a form field?",
        a: "Most platforms, including SMS and social media character limits, count spaces as regular characters — so the \"with spaces\" figure is usually the one that matters.",
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
    about: [
      "Retyping a paragraph because caps lock was on is wasted effort. Paste the text, click a case, and copy the result. Title Case capitalizes each word's first letter; Sentence case capitalizes the first letter after each sentence-ending punctuation mark and lowercases the rest. Conversions are instant and reversible — your original stays in the input box.",
      "This comes up constantly in everyday writing — fixing an email typed entirely in caps lock by mistake, converting a heading to proper Title Case for a document, or normalizing a list of names that was pasted in from a source with inconsistent capitalization.",
    ],
    useCases: [
      "Fixing an email or message accidentally typed with caps lock left on",
      "Converting a heading or title to consistent Title Case for a document or presentation",
      "Normalizing a list of names or entries that arrived with inconsistent capitalization",
    ],
    tips: [
      "After using Title Case, manually lowercase small connector words (like \"of\" or \"the\") in the middle of a title if your specific style guide calls for it.",
      "Sentence case is the quickest way to fix a paragraph typed entirely in caps lock — it recognizes sentence boundaries and capitalizes accordingly.",
    ],
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
      {
        q: "Can I convert back to the original casing if I make a mistake?",
        a: "Your original text stays untouched in the input box, so you can simply re-click a different case option or copy the input again — nothing is destructively overwritten.",
      },
      {
        q: "What's the difference between Title Case and Sentence case?",
        a: "Title Case capitalizes the first letter of every word — appropriate for headings and titles. Sentence case only capitalizes the first letter of each sentence, the way normal prose is written.",
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
    about: [
      "Merged mailing lists, exported keyword sets and concatenated logs accumulate duplicates that are tedious to remove by hand. Paste the list and the tool keeps the first occurrence of each line, preserving your original order. Case-insensitive matching treats \"Apple\" and \"apple\" as the same entry; optional whitespace trimming catches lines that differ only by stray spaces. The result reports exactly how many duplicates were removed.",
      "This is a common cleanup step after combining data from multiple sources — merging two mailing lists exported from different tools, or consolidating a keyword list pulled from several research sessions — where the same entries inevitably show up more than once.",
    ],
    useCases: [
      "Cleaning duplicate entries out of a mailing list merged from two different sources",
      "Removing repeated keywords from a list pulled together from multiple research sessions",
      "De-duplicating a list of URLs or file names before further processing",
    ],
    tips: [
      "Enable case-insensitive matching if your list might contain the same entry typed with different capitalization, like \"Email@test.com\" and \"email@test.com\".",
      "Turn on whitespace trimming if the list was copied from a source that might have added invisible trailing spaces to some lines.",
    ],
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
      {
        q: "How many duplicates can this handle in one go?",
        a: "There's no practical limit — the tool processes the entire pasted list at once, since it all runs in your browser rather than being queued on a server.",
      },
      {
        q: "Will this work on a list of email addresses or URLs?",
        a: "Yes — it treats every line as a plain text entry regardless of content, so email addresses, URLs, product codes or any other list type work the same way.",
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
    about: [
      "Plain alphabetical sorting puts \"item10\" before \"item2\" because it compares character by character. The natural sort option here compares embedded numbers by value, producing the order humans expect. You can also sort case-insensitively, reverse any order, or sort by line length, which is useful for reviewing data exports and organizing word lists.",
      "This comes up often when working with exported data or file listings — sorting a folder of numbered files correctly (file2 before file10), alphabetizing a list of names for a directory, or arranging entries by length to spot unusually short or long outliers.",
    ],
    useCases: [
      "Sorting a list of numbered files or items so they appear in the order a person would expect (2 before 10)",
      "Alphabetizing a list of names, products, or entries for a directory or catalog",
      "Sorting by line length to quickly spot unusually short or long entries in a data export",
    ],
    tips: [
      "Use natural/numeric sort whenever your list contains numbers embedded in text, like file names or version numbers — plain alphabetical sort will order them incorrectly.",
      "Sorting by length is a quick way to audit a list for outliers, like an accidentally truncated entry or an unusually long one that needs review.",
    ],
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
      {
        q: "Can I sort a list in reverse alphabetical order?",
        a: "Yes, choose the Z–A option to get the exact reverse of standard alphabetical order.",
      },
      {
        q: "Will sorting remove duplicate entries?",
        a: "No, sorting only reorders the lines — duplicates stay in the list. Use Remove Duplicate Lines first if you also want to deduplicate.",
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
    about: [
      "Text copied from PDFs, emails and websites arrives full of doubled spaces, trailing whitespace and stray blank lines. Rather than one opaque \"clean\" button, this tool lets you choose exactly which fixes to apply: collapse multiple spaces into one, trim whitespace from line starts/ends, remove blank lines, or collapse multiple blank lines into a single one to keep paragraph breaks. The summary shows how many characters were removed.",
      "This is the fix for the specific frustration of pasting text from a PDF or webpage and finding it riddled with inconsistent spacing that makes it look unprofessional in a document or awkward when pasted into a form field.",
    ],
    useCases: [
      "Cleaning up text copied from a PDF that came out with irregular spacing",
      "Removing extra blank lines from a document before pasting it somewhere with strict formatting",
      "Tidying text pasted from a website that carried over inconsistent whitespace",
    ],
    tips: [
      "Use \"collapse multiple blank lines\" rather than \"remove blank lines\" if you want to keep paragraph breaks intact while still cleaning up excessive gaps.",
      "If a document still looks oddly spaced after cleanup, check for non-breaking spaces — this tool's collapse option catches most, but occasionally a source uses unusual invisible characters.",
    ],
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
      {
        q: "Can I apply just one of the cleanups instead of all of them?",
        a: "Yes, each cleanup — collapsing spaces, trimming lines, and handling blank lines — has its own checkbox, so you can apply exactly the fixes you need.",
      },
      {
        q: "Will this change the actual words in my text?",
        a: "No, only whitespace is affected. The words, punctuation and capitalization of your text remain exactly as you pasted them.",
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
    about: [
      "This is the find-and-replace from your editor, available anywhere: paste text, enter what to find and what to replace it with, and see how many matches exist before committing. Whole-word matching prevents \"cat\" from changing \"category\"; regex mode unlocks pattern replacements like normalizing dates or stripping prefixes, with clear errors when a pattern is invalid.",
      "This is especially handy when you don't have access to the original document in an editor — for example fixing a repeated typo or an outdated name across text that was pasted from an email, a chat log, or a plain text export.",
    ],
    useCases: [
      "Correcting a repeated typo or outdated name across a block of pasted text",
      "Standardizing formatting like date styles or spacing patterns using a regex pattern",
      "Replacing a placeholder value across a template before sending it out",
    ],
    tips: [
      "Check the live match count before clicking Replace — if the number looks higher or lower than expected, adjust whole-word or case-sensitivity settings before committing.",
      "For simple text swaps, leave regex mode off — it's only needed when you want to match a pattern rather than an exact phrase.",
    ],
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
      {
        q: "What happens if my regex pattern is invalid?",
        a: "The tool shows a clear error describing the problem with the pattern, rather than silently failing or replacing nothing.",
      },
      {
        q: "Is the replacement case-sensitive by default?",
        a: "No, matching is case-insensitive by default so \"Cat\" and \"cat\" are both found. Enable case-sensitive matching if you need exact-case matches only.",
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
    about: [
      "Where the Word Counter answers \"how much?\", this tool answers \"what is it like?\". It computes average word length and words per sentence (long averages suggest dense prose), lists your ten most frequent meaningful words to reveal repetition, and estimates both silent reading time (~220 wpm) and speaking time (~140 wpm) for presentations. Common stop-words like \"the\" and \"of\" are excluded from the frequency list so it reflects your actual vocabulary.",
      "This is particularly useful when preparing a speech or presentation, where knowing the estimated speaking time helps you fit within an allotted slot, or when editing an article, where the frequency list can reveal a word you've unintentionally overused.",
    ],
    useCases: [
      "Estimating how long a speech or presentation script will take to actually deliver",
      "Spotting overused words in an article or essay by reviewing the frequency list",
      "Checking whether sentence length is too dense or too choppy for the intended audience",
    ],
    tips: [
      "If the average words-per-sentence figure looks high (above ~25), consider breaking up longer sentences for easier reading.",
      "Use the speaking time estimate as a planning guide, but do a live read-through too — actual pace varies with pauses and emphasis.",
    ],
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
      {
        q: "Can this tool help me improve my writing style?",
        a: "It won't rewrite anything for you, but the averages and frequency list are useful diagnostics — a very high average sentence length or a word repeated unusually often are both worth a second look.",
      },
      {
        q: "Does it work on non-English text?",
        a: "Basic counts (words, characters, sentences) work on any language. The word-frequency stop-word filtering is tuned for English, so frequency results for other languages may include common function words.",
      },
    ],
    processing: "browser",
    indexable: true,
  },
];
