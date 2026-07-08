import type { ToolDef } from "../types";

export const devTools: ToolDef[] = [
  {
    slug: "json-formatter",
    name: "JSON Formatter",
    shortName: "JSON Formatter",
    category: "developer-tools",
    title: "JSON Formatter — Pretty Print & Beautify JSON Online",
    description:
      "Format and pretty-print JSON with 2 or 4 space indentation. Precise error messages with line numbers for invalid input. Runs locally.",
    intro:
      "Paste minified or messy JSON and get a cleanly indented, readable version. Invalid JSON produces an error with the line and position of the problem.",
    about: [
      "APIs return JSON on a single line; humans read it indented. This formatter parses your input with the browser's native JSON engine — the same strict parser your code will use — and re-serializes it with your chosen indentation. Because parsing is strict, formatting doubles as validation: trailing commas, single quotes and unquoted keys are reported with their location instead of being silently accepted. Your data stays in the browser, which matters when the JSON contains tokens or customer data.",
      "This is one of the most common everyday debugging steps — pasting in a raw API response, a log line, or a config blob to actually read its structure, rather than squinting at a single unbroken line of text.",
    ],
    useCases: [
      "Making an API response readable while debugging an integration",
      "Cleaning up a minified config file before editing it by hand",
      "Quickly checking the structure of a JSON payload pasted from logs or a support ticket",
    ],
    tips: [
      "Use 2-space indentation for a compact, scannable view; switch to 4 spaces if you find deeply nested structures easier to follow with more visual separation.",
      "If formatting fails, the error location doubles as a quick syntax check — fix that one spot and try again rather than re-reading the whole document.",
    ],
    steps: [
      "Paste JSON into the input panel.",
      "Choose 2-space or 4-space indentation.",
      "Click Format — or fix the reported error if the input is invalid.",
      "Copy the formatted output.",
    ],
    inputFormats: ["JSON"],
    outputFormats: ["JSON"],
    aliases: ["pretty print json", "beautify json", "json beautifier", "indent json"],
    related: ["json-minifier", "json-validator", "csv-to-json", "json-to-csv"],
    faqs: [
      {
        q: "Why does my JSON fail with a trailing comma?",
        a: "The JSON specification forbids trailing commas, even though JavaScript allows them. The error message points at the comma so you can remove it.",
      },
      {
        q: "Does formatting change my data?",
        a: "No — only whitespace changes. Keys, values and their order are preserved exactly, including large integer IDs (like database or Twitter/Discord snowflake IDs), which are kept exact rather than rounded the way a plain JSON.parse would.",
      },
      {
        q: "Is it safe to paste API responses with tokens in them?",
        a: "Formatting happens entirely in your browser; nothing is transmitted. Still, avoid sharing formatted output that contains live credentials.",
      },
      {
        q: "Can I format very large JSON documents?",
        a: "Yes, there's no artificial size limit — practical limits depend on your browser's available memory rather than a server-imposed cap.",
      },
      {
        q: "What's the difference between this and the JSON Validator?",
        a: "This tool both validates and reformats valid JSON into a readable layout. The JSON Validator focuses purely on checking correctness and explaining any errors, without changing the output.",
      },
    ],
    processing: "browser",
    indexable: true,
    popular: true,
  },
  {
    slug: "json-minifier",
    name: "JSON Minifier",
    shortName: "JSON Minifier",
    category: "developer-tools",
    title: "JSON Minifier — Compress JSON to One Line",
    description:
      "Minify JSON by stripping all unnecessary whitespace. Shows exact size reduction. Validates input first. Local browser processing.",
    intro:
      "Strip every unnecessary space and line break from JSON to get the smallest valid representation — with the size saving shown.",
    about: [
      "Minified JSON is what you want in config payloads, HTTP requests and storage: identical data, fewer bytes. The tool validates first (so you never ship broken JSON), then re-serializes without whitespace and reports the before/after sizes. Minification is fully reversible — run the output through the JSON Formatter to make it readable again.",
      "This matters most when every byte counts — embedding JSON into a URL query parameter, keeping a config payload under a size limit, or shaving unnecessary weight off a request body sent frequently over the network.",
    ],
    useCases: [
      "Shrinking a JSON payload before embedding it in a URL parameter or storage field with a size limit",
      "Preparing a compact config file for production where readability doesn't matter but size does",
      "Reducing the size of a request body sent frequently to an API",
    ],
    tips: [
      "Keep a formatted copy of important JSON for your own reference before minifying — minified output is functionally identical but much harder for a human to read or edit later.",
      "Check the size-reduction percentage shown after minifying — deeply nested, heavily indented JSON typically shrinks the most.",
    ],
    steps: [
      "Paste formatted or messy JSON.",
      "Click Minify.",
      "Check the size reduction shown.",
      "Copy the single-line output.",
    ],
    inputFormats: ["JSON"],
    outputFormats: ["JSON"],
    aliases: ["compress json", "json one line", "remove whitespace json"],
    related: ["json-formatter", "json-validator", "json-to-csv"],
    faqs: [
      {
        q: "Does minifying lose any information?",
        a: "No. Only insignificant whitespace is removed; every key and value survives byte-for-byte. Formatting it again restores readability.",
      },
      {
        q: "How much smaller does JSON get?",
        a: "Typically 10–40% depending on indentation depth and structure — deeply nested, heavily indented documents shrink the most. The exact figure is displayed after minifying.",
      },
      {
        q: "Will it fix invalid JSON while minifying?",
        a: "No — invalid input is rejected with a specific error. Minifying broken JSON would just move the problem downstream.",
      },
      {
        q: "Should I minify JSON before storing it in a database?",
        a: "It depends on your use case, but if the field has a size limit or storage cost matters, minified JSON stores the identical data more efficiently with no functional downside.",
      },
      {
        q: "Can I reverse the minification later?",
        a: "Yes, paste the minified output into the JSON Formatter tool and it will restore readable indentation without altering the data.",
      },
    ],
    processing: "browser",
    indexable: true,
  },
  {
    slug: "json-validator",
    name: "JSON Validator",
    shortName: "JSON Validator",
    category: "developer-tools",
    title: "JSON Validator — Check JSON Syntax with Line Numbers",
    description:
      "Validate JSON against the strict specification. Errors include line and column, with common causes explained. Runs in your browser.",
    intro:
      "Check whether a JSON document is valid. Errors are reported with line and column, plus a plain-English explanation of the likely cause.",
    about: [
      "\"Unexpected token\" errors in production often trace back to hand-edited JSON. This validator uses the strict native parser and translates its errors into actionable messages — pointing at the line and column and naming the usual suspects: trailing commas, single quotes instead of double, unquoted keys, comments (JSON has none), and unescaped control characters in strings. Valid documents get a summary of their structure (type, key count, nesting depth).",
      "This is often the fastest way to track down why a config file or API payload is silently failing to parse somewhere in a larger system — pinpointing the exact line and likely cause instead of scanning the whole document by eye.",
    ],
    useCases: [
      "Tracking down why a hand-edited config file is failing to load in an application",
      "Verifying a JSON payload is well-formed before sending it to an API",
      "Checking JSON pasted from a support ticket or bug report before investigating further",
    ],
    tips: [
      "If you're not sure why JSON copied from another source is failing, check first for smart/curly quotes (\u201c \u201d) accidentally introduced by a word processor — they look like regular quotes but aren't valid in JSON.",
      "Use the structure summary shown for valid documents as a quick sanity check that the data has the shape you expect (e.g. an array with the right number of items).",
    ],
    steps: [
      "Paste the JSON to check.",
      "Click Validate.",
      "If invalid, jump to the reported line and column and fix the highlighted cause.",
      "Re-validate until the green summary appears.",
    ],
    inputFormats: ["JSON"],
    outputFormats: ["Validation report"],
    aliases: ["check json", "json syntax checker", "is my json valid", "json lint"],
    related: ["json-formatter", "json-minifier", "csv-to-json"],
    faqs: [
      {
        q: "Why is JSON with comments invalid?",
        a: "The JSON specification has no comment syntax. Some tools accept them anyway (JSONC), but strict parsers — including the ones in browsers and most languages — reject them.",
      },
      {
        q: "Are single quotes really not allowed?",
        a: "Correct. JSON strings and keys must use double quotes. Single quotes are a JavaScript habit that strict JSON parsers reject.",
      },
      {
        q: "The validator says valid but my API rejects the JSON — why?",
        a: "The syntax is valid, but the API likely expects a particular schema: specific keys, types or value ranges. Check the API's documentation for its required structure.",
      },
      {
        q: "What does the structure summary tell me?",
        a: "For valid JSON, it reports the root type (object or array), the number of keys or items, and how deeply the structure is nested — a quick way to sanity-check the shape of the data.",
      },
      {
        q: "Can I validate JSON copied from a Python or JavaScript file?",
        a: "Only the JSON portion itself — if you copy a JavaScript object literal that uses single quotes or unquoted keys, it needs to be converted to strict JSON syntax first before it will validate.",
      },
    ],
    processing: "browser",
    indexable: true,
  },
  {
    slug: "csv-to-json",
    name: "CSV to JSON Converter",
    shortName: "CSV to JSON",
    category: "developer-tools",
    title: "CSV to JSON Converter — Paste or Upload, Get JSON",
    description:
      "Convert CSV to a JSON array of objects. Handles quoted fields, commas inside values, and custom delimiters. Local, no upload.",
    intro:
      "Turn CSV data — pasted or from a file — into a JSON array of objects, using the header row as keys. Quoted fields and embedded commas are handled correctly.",
    about: [
      "Naive CSV converters break on the first quoted field containing a comma. This one uses a proper CSV parser: quoted fields, escaped quotes (\"\"), embedded commas and line breaks inside values all parse per the CSV standard. The first row becomes the object keys; you can choose comma, semicolon or tab as the delimiter, and optionally convert numeric-looking values to real JSON numbers. Output can be copied or downloaded as a .json file.",
      "This bridges the common gap between spreadsheet-based data — exported from Excel, Google Sheets, or a database tool — and the JSON format that APIs, scripts and web applications actually expect to consume.",
    ],
    useCases: [
      "Converting a spreadsheet export into JSON to feed into a script or API",
      "Turning a CSV data dump into a JSON array for use in a web application prototype",
      "Preparing test or seed data for a database from a spreadsheet",
    ],
    tips: [
      "Turn on \"detect numbers\" only if you're sure no column has meaningful leading zeros (like ZIP codes) — otherwise those values will lose their leading digits.",
      "If your export was made in a European locale, try the semicolon delimiter — many regional spreadsheet settings export CSV with semicolons instead of commas.",
    ],
    steps: [
      "Paste CSV or choose a .csv file.",
      "Set the delimiter if it isn't a comma (semicolon and tab are common in exports).",
      "Click Convert to JSON.",
      "Copy the result or download it as a file.",
    ],
    inputFormats: ["CSV", "TSV"],
    outputFormats: ["JSON"],
    aliases: ["csv to json array", "spreadsheet to json", "excel csv to json"],
    related: ["json-to-csv", "json-formatter", "json-validator"],
    faqs: [
      {
        q: "My values contain commas — will they break the conversion?",
        a: "Not if they're quoted, which is how spreadsheets export them. The parser follows the CSV standard, so \"Smith, Jane\" stays one value.",
      },
      {
        q: "Why are my numbers coming out as strings?",
        a: "CSV has no types — everything is text. Enable \"detect numbers\" to convert numeric-looking values into JSON numbers; leave it off to preserve things like ZIP codes with leading zeros.",
      },
      {
        q: "My export uses semicolons, not commas. Will it work?",
        a: "Yes — select the semicolon delimiter. Spreadsheets in many European locales export semicolon-separated files.",
      },
      {
        q: "What happens if a row has fewer columns than the header?",
        a: "Missing cells are filled in as empty strings in the resulting JSON object, so the output stays consistent across all rows.",
      },
      {
        q: "Can I load the CSV directly from a file instead of pasting it?",
        a: "Yes, use the \"Load from file\" option to select a .csv or .tsv file from your computer directly.",
      },
    ],
    processing: "browser",
    indexable: true,
    popular: true,
  },
  {
    slug: "json-to-csv",
    name: "JSON to CSV Converter",
    shortName: "JSON to CSV",
    category: "developer-tools",
    title: "JSON to CSV Converter — Arrays of Objects to Spreadsheet",
    description:
      "Convert a JSON array of objects to CSV you can open in Excel or Sheets. Proper quoting, union of keys as columns, downloadable file.",
    intro:
      "Convert a JSON array of objects into CSV that opens cleanly in Excel or Google Sheets, with correct quoting and a stable column order.",
    about: [
      "API responses arrive as JSON; stakeholders want spreadsheets. This converter takes an array of objects, builds the column set from the union of all keys (objects may have different keys), and emits standards-compliant CSV: values containing commas, quotes or line breaks are quoted and escaped so spreadsheets import them intact. Nested objects and arrays are serialized as JSON strings inside their cell, keeping the data lossless.",
      "This is the tool for the common handoff moment when a developer has data as JSON but a colleague, client, or reporting tool needs it as a spreadsheet they can open, filter and sort in Excel or Google Sheets.",
    ],
    useCases: [
      "Turning an API response into a spreadsheet to share with a non-technical colleague",
      "Exporting JSON data from an app or database into CSV for reporting purposes",
      "Converting a JSON array into a format that can be opened, filtered and sorted in Excel",
    ],
    tips: [
      "If your objects don't all share the same keys, don't worry — the converter automatically creates a column for every key that appears anywhere in the array.",
      "Import phone numbers, ZIP codes or ID numbers as text in Excel afterward if you need to preserve leading zeros, since Excel applies its own type guessing on import.",
    ],
    steps: [
      "Paste a JSON array of objects (or a single object).",
      "Click Convert to CSV.",
      "Preview the output.",
      "Copy it or download a .csv file ready for Excel or Sheets.",
    ],
    inputFormats: ["JSON"],
    outputFormats: ["CSV"],
    aliases: ["json to excel", "json array to spreadsheet", "export json csv"],
    related: ["csv-to-json", "json-formatter", "json-minifier"],
    faqs: [
      {
        q: "What happens to nested objects?",
        a: "They are written into their cell as a JSON string, so no data is lost. If you need them flattened into separate columns, restructure the JSON before converting.",
      },
      {
        q: "My objects don't all have the same keys — is that a problem?",
        a: "No. The columns are the union of every key found; objects missing a key get an empty cell in that column.",
      },
      {
        q: "Will Excel mangle values like phone numbers?",
        a: "Excel applies its own type guessing on import (e.g. stripping leading zeros). The CSV itself is correct; import the column as text in Excel to preserve such values.",
      },
      {
        q: "Can I convert a single JSON object instead of an array?",
        a: "Yes, a single object is treated as a one-row result, producing a CSV with a header row and one data row.",
      },
      {
        q: "What delimiter does the output CSV use?",
        a: "Comma by default, matching the most common CSV convention — the same as accepted by the CSV to JSON tool's default setting.",
      },
    ],
    processing: "browser",
    indexable: true,
  },
  {
    slug: "url-encoder-decoder",
    name: "URL Encoder / Decoder",
    shortName: "URL Encode/Decode",
    category: "developer-tools",
    title: "URL Encoder & Decoder — Percent-Encoding Online",
    description:
      "Encode text for safe use in URLs or decode percent-encoded strings. Component and full-URL modes explained. Runs in your browser.",
    intro:
      "Percent-encode text for URLs, or decode %20-style strings back into readable text. Choose component encoding (strict) or full-URL encoding.",
    about: [
      "URLs only allow a limited character set; everything else must be percent-encoded. The important distinction this tool makes explicit: component encoding (encodeURIComponent) escapes characters like /, ? and & — correct for a single query-string value — while full-URL encoding (encodeURI) leaves URL structure intact — correct when encoding a complete address. Using the wrong one is the classic cause of broken links and double-encoded %2520 artifacts. Decoding reverses either form.",
      "This distinction trips up even experienced developers — encoding a whole URL with component-encoding mangles the `://` and `?` that make it a working link, while encoding a query parameter with full-URL encoding fails to escape characters like `&` that would otherwise break the parameter boundary.",
    ],
    useCases: [
      "Encoding a search term or query parameter safely before appending it to a URL",
      "Decoding a %20-style URL to read what it actually contains",
      "Diagnosing a broken link caused by double-encoding or the wrong encoding mode",
    ],
    tips: [
      "If you're encoding just one value that will be placed into a query string (like a search term), use component encoding — it's the right choice in the vast majority of cases.",
      "If a decoded URL still shows % symbols, it's likely been encoded twice — try decoding it a second time.",
    ],
    steps: [
      "Paste the text or URL.",
      "Pick Encode component, Encode full URL, or Decode.",
      "Click Convert.",
      "Copy the result.",
    ],
    inputFormats: ["Plain text", "URL"],
    outputFormats: ["Plain text", "URL"],
    aliases: ["percent encoding", "urlencode", "decode url", "%20 to space"],
    related: ["base64-encoder-decoder", "json-formatter", "qr-code-generator"],
    faqs: [
      {
        q: "Component encoding vs full-URL encoding — which do I need?",
        a: "Encoding a value that goes inside a query string (like a search term): component. Encoding a complete URL while keeping :// and ? working: full URL. When in doubt for a single parameter value, use component.",
      },
      {
        q: "Why does my decoded text show %2520?",
        a: "That's double encoding — a %20 was encoded again, turning % into %25. Decode twice to recover the original, and fix the pipeline that encodes twice.",
      },
      {
        q: "Are + signs spaces?",
        a: "Only in the historical form-encoding of query strings. Standard percent-encoding uses %20 for a space; this tool follows the standard and also decodes + as a space in decode mode when it appears in query-style input.",
      },
      {
        q: "Will encoding change letters and numbers?",
        a: "No. Letters, digits and a small set of safe characters (like - _ . ~) are left unchanged; only characters with special meaning in URLs are percent-encoded.",
      },
      {
        q: "Can I decode a URL that contains both encoded and plain characters?",
        a: "Yes, decoding only affects percent-encoded sequences and leaves already-plain characters untouched.",
      },
    ],
    processing: "browser",
    indexable: true,
  },
  {
    slug: "base64-encoder-decoder",
    name: "Base64 Encoder / Decoder",
    shortName: "Base64 Text",
    category: "developer-tools",
    title: "Base64 Encode & Decode Text Online — UTF-8 Safe",
    description:
      "Encode text to Base64 or decode Base64 to text, with full UTF-8 support for emoji and non-Latin scripts. Local browser processing.",
    intro:
      "Convert text to Base64 and back. Unlike naive implementations, this handles UTF-8 correctly, so emoji and non-Latin text round-trip safely.",
    about: [
      "Base64 turns arbitrary bytes into a safe alphabet of letters, digits, + and /, which is why it appears in HTTP headers, JWTs, email attachments and data URIs. JavaScript's raw btoa() breaks on any character outside Latin-1; this tool encodes the text as UTF-8 bytes first, so \"héllo 👋\" encodes and decodes without corruption. Note that Base64 is an encoding, not encryption — anyone can decode it.",
      "This comes up often when inspecting the payload of a JWT token, decoding a Base64-encoded HTTP header or environment variable, or preparing a short string for a system that expects Base64 as its transport format.",
    ],
    useCases: [
      "Decoding a Base64-encoded HTTP header or environment variable to see its actual contents",
      "Inspecting the header or payload segment of a JWT token, which is Base64-encoded",
      "Encoding a short piece of text for a system that requires a Base64 format",
    ],
    tips: [
      "Remember that Base64 is not encryption — anyone can decode it back to plain text, so never rely on it alone to protect sensitive data.",
      "If you're specifically working with images, use the dedicated Image to Base64 or Base64 to Image tools instead, which handle binary image data and MIME types directly.",
    ],
    steps: [
      "Paste text (to encode) or a Base64 string (to decode).",
      "Click Encode or Decode.",
      "Copy the output.",
      "For images, use the dedicated Image to Base64 tool instead.",
    ],
    inputFormats: ["Plain text", "Base64"],
    outputFormats: ["Base64", "Plain text"],
    aliases: ["btoa", "atob", "base64 string", "decode base64 text"],
    related: ["image-to-base64", "base64-to-image", "url-encoder-decoder"],
    faqs: [
      {
        q: "Is Base64 encryption?",
        a: "No. It's a reversible encoding with no key — anyone can decode it. Never use Base64 alone to protect secrets.",
      },
      {
        q: "Why did emoji break when I used btoa() in my code?",
        a: "btoa() only accepts Latin-1 characters. Encode the string as UTF-8 bytes first (as this tool does) — in modern JS, via TextEncoder.",
      },
      {
        q: "What are the = signs at the end of Base64?",
        a: "Padding. Base64 works in 3-byte groups; = fills out the final group when the input length isn't a multiple of three. Decoders handle it automatically.",
      },
      {
        q: "Can I decode a JWT token with this tool?",
        a: "You can decode the individual header and payload segments (the parts separated by dots) as Base64 text. Note that the signature segment isn't meant to be human-readable, and this doesn't verify the token's validity.",
      },
      {
        q: "What happens if I try to decode text that isn't valid Base64?",
        a: "You'll get a clear error explaining that the input isn't valid Base64, rather than a garbled or silent result.",
      },
    ],
    processing: "browser",
    indexable: true,
  },
  {
    slug: "uuid-generator",
    name: "UUID Generator",
    shortName: "UUID Generator",
    category: "developer-tools",
    title: "UUID v4 Generator — Create Random UUIDs Online",
    description:
      "Generate one or many cryptographically random UUID v4 identifiers. Uppercase and no-hyphen options. Generated locally in your browser.",
    intro:
      "Generate version-4 UUIDs using your browser's cryptographic random source. Create one or a batch, with uppercase and hyphen-free formatting options.",
    about: [
      "UUID v4 identifiers are 128-bit values with 122 random bits — enough that collisions are not a practical concern, which is why they're the default choice for database keys, request IDs and file names. Generation uses the Web Crypto API (crypto.randomUUID / getRandomValues), the same quality of randomness your backend would use, and happens on your device: the IDs you generate are never known to anyone else.",
      "This is a quick way to grab test data or placeholder identifiers while developing — seeding a database with sample records, generating mock request IDs for a test suite, or creating unique file names for a batch upload script.",
    ],
    useCases: [
      "Generating sample primary keys or IDs for test or seed data in a database",
      "Creating unique file names for a batch of uploaded files",
      "Producing mock request or transaction IDs for testing an API integration",
    ],
    tips: [
      "Generate a batch of several hundred at once if you're seeding test data — it's faster than generating one at a time.",
      "Use the no-hyphen option if the system you're pasting into expects a plain 32-character hex string rather than the standard hyphenated format.",
    ],
    steps: [
      "Choose how many UUIDs you need.",
      "Toggle uppercase or hyphen removal if your system requires it.",
      "Click Generate.",
      "Copy one UUID or the whole list.",
    ],
    inputFormats: ["—"],
    outputFormats: ["UUID v4"],
    aliases: ["guid generator", "random uuid", "unique id generator"],
    related: ["password-generator", "qr-code-generator", "base64-encoder-decoder"],
    faqs: [
      {
        q: "Can two generated UUIDs collide?",
        a: "The probability is astronomically small — you would need to generate about 2.7×10^18 UUIDs for even a 50% chance of one collision. Treat v4 UUIDs as unique.",
      },
      {
        q: "What's the difference between UUID and GUID?",
        a: "Nothing practical — GUID is Microsoft's name for the same 128-bit identifier format.",
      },
      {
        q: "Are these UUIDs predictable?",
        a: "No. They come from the browser's cryptographic random generator, not a seeded pseudo-random function, and they never leave your machine.",
      },
      {
        q: "How many UUIDs can I generate at once?",
        a: "Up to 500 in a single batch, each independently random and ready to copy as a list.",
      },
      {
        q: "Can I use these as database primary keys?",
        a: "Yes, UUID v4 is a common choice for primary keys, especially in distributed systems where IDs need to be generated independently without a central counter.",
      },
    ],
    processing: "browser",
    indexable: true,
  },
  {
    slug: "password-generator",
    name: "Password Generator",
    shortName: "Password Generator",
    category: "developer-tools",
    title: "Strong Password Generator — Random & Local",
    description:
      "Generate strong random passwords with length and character-set options. Uses cryptographic randomness, entirely in your browser.",
    intro:
      "Create strong random passwords with control over length, symbols, digits and ambiguous characters. Generated locally with cryptographic randomness — never transmitted.",
    about: [
      "Password strength comes from length and true randomness, not from clever substitutions. This generator draws characters uniformly from your selected sets using the Web Crypto API, guarantees at least one character from each enabled set, and shows an entropy estimate so you can see how length changes strength. The \"exclude ambiguous\" option drops lookalikes (l/1/I, O/0) for passwords that must occasionally be typed by hand. Nothing is stored or sent — generation is entirely local.",
      "This is worth reaching for any time you're creating a new account, resetting a compromised password, or setting up a shared credential like a Wi-Fi key — situations where a strong, unique, never-reused password matters most.",
    ],
    useCases: [
      "Creating a strong, unique password when signing up for a new account",
      "Generating a new password after a service reports a data breach affecting your old one",
      "Setting a Wi-Fi or shared device password that's strong but still readable if needed",
    ],
    tips: [
      "Save generated passwords into a password manager rather than trying to remember them — that's what makes long, random passwords practical to use everywhere.",
      "Turn on \"exclude ambiguous characters\" specifically for passwords you expect to type by hand, like a Wi-Fi key you'll read off a screen to a guest.",
    ],
    steps: [
      "Set the length — 16+ recommended, 20+ for important accounts.",
      "Choose character sets: lowercase, uppercase, digits, symbols.",
      "Click Generate (repeat until you're happy).",
      "Copy the password into your password manager.",
    ],
    inputFormats: ["—"],
    outputFormats: ["Password"],
    aliases: ["random password", "secure password maker", "strong password"],
    related: ["uuid-generator", "base64-encoder-decoder", "qr-code-generator"],
    faqs: [
      {
        q: "How long should my password be?",
        a: "16 characters with mixed sets gives roughly 100 bits of entropy — beyond realistic brute force. Use 20+ for high-value accounts, and never reuse passwords across sites.",
      },
      {
        q: "Is it safe to generate passwords on a website?",
        a: "Here, generation runs in your browser with the Web Crypto API and the password is never transmitted or logged. You can verify by loading the page and disconnecting from the internet before generating.",
      },
      {
        q: "Why exclude ambiguous characters?",
        a: "Characters like l, 1, I, O and 0 are easy to confuse when a password must be read or typed manually (e.g. a Wi-Fi key). Excluding them slightly reduces entropy — compensate with a couple of extra characters.",
      },
      {
        q: "Should every account really have a different password?",
        a: "Yes — reusing a password means a breach at one site can compromise your accounts elsewhere. A password manager makes using a unique strong password everywhere practical.",
      },
      {
        q: "What does the entropy estimate actually mean?",
        a: "It's a rough measure, in bits, of how many attempts an attacker would need to guess the password by brute force. Higher is stronger; around 80+ bits is considered very strong for most purposes.",
      },
    ],
    processing: "browser",
    indexable: true,
    popular: true,
  },
  {
    slug: "qr-code-generator",
    name: "QR Code Generator",
    shortName: "QR Code Generator",
    category: "developer-tools",
    title: "QR Code Generator — Free PNG & SVG, No Watermark",
    description:
      "Generate QR codes for URLs, text or Wi-Fi credentials. Download as PNG or SVG, choose size and error correction. No watermark, no upload.",
    intro:
      "Create a QR code from any text or URL and download it as PNG or scalable SVG. No watermark, no expiry — the code is generated in your browser.",
    about: [
      "The QR codes generated here are static: the data is encoded directly in the pattern, so they never expire and don't depend on this website existing — unlike \"dynamic\" QR services that route scans through their servers. Choose the pixel size for print use and the error-correction level (higher levels survive partial damage or a logo overlay, at the cost of a denser pattern). SVG output scales to any print size without blurring.",
      "This makes it a good fit for anything meant to last — a QR code printed on a flyer, business card, or product label — since a static code embedded in the pattern itself will keep working indefinitely, unlike services that could shut down or expire a redirect years later.",
    ],
    useCases: [
      "Printing a QR code on a business card, flyer, or poster that links to a website or contact card",
      "Sharing Wi-Fi credentials with guests without reading out a long password",
      "Generating a code for a menu, event page, or portfolio link intended for print",
    ],
    tips: [
      "Choose SVG output for anything that will be printed, especially at large sizes like a poster — it stays perfectly sharp at any scale, unlike a PNG.",
      "If you plan to place a logo in the center of the code, use a higher error-correction level (like H) so the code remains scannable despite the covered area.",
    ],
    steps: [
      "Type or paste the content — a URL, plain text, or Wi-Fi details.",
      "Pick a size and error-correction level (M is a good default).",
      "The QR code preview updates live.",
      "Download as PNG for screens or SVG for print.",
    ],
    inputFormats: ["Text", "URL"],
    outputFormats: ["PNG", "SVG"],
    aliases: ["make qr code", "url to qr", "free qr code no expiry", "wifi qr code"],
    related: ["url-encoder-decoder", "password-generator", "uuid-generator"],
    faqs: [
      {
        q: "Do these QR codes expire?",
        a: "No. The content is encoded in the code itself, not stored on a server, so the code works forever — even if this site disappears.",
      },
      {
        q: "Which error-correction level should I use?",
        a: "M (15%) suits most uses. Choose H (30%) if the code may get scuffed or you plan to place a small logo over the center; note the pattern becomes denser.",
      },
      {
        q: "PNG or SVG?",
        a: "PNG for screens, documents and quick sharing. SVG for print at any size — it's vector, so a business-card code and a poster code stay equally sharp.",
      },
      {
        q: "Is there a limit to how much text I can encode?",
        a: "QR codes can hold a few thousand characters, but very long content produces a very dense, harder-to-scan pattern. For anything long, a shortened URL that redirects to the full content scans much more reliably.",
      },
      {
        q: "Can I create a QR code for Wi-Fi credentials?",
        a: "Yes — format the content as a Wi-Fi QR string (network name and password) and the resulting code can be scanned by most phone cameras to join the network automatically.",
      },
    ],
    processing: "browser",
    indexable: true,
    popular: true,
  },
];
