/**
 * Helpers shared by every multi-file tool.
 *
 * Centralised so that duplicate detection, limits and error wording behave the
 * same everywhere instead of each tool re-implementing a slightly different
 * loop (the old per-tool loops let the same file be added twice, which also
 * produced duplicate React keys).
 */

/** Identity of a file for de-duplication and stable React keys. */
export function fileKey(file: File): string {
  return `${file.name}\u0000${file.size}\u0000${file.lastModified}`;
}

export interface AddFilesResult {
  /** The merged list (existing files first, then newly accepted ones). */
  files: File[];
  /** Human-readable reasons individual files were rejected. */
  issues: string[];
  /** How many incoming files were skipped because they were already added. */
  duplicates: number;
  /** How many valid files were left out because the limit was reached. */
  overLimit: number;
}

export interface AddFilesOptions {
  /** Maximum number of files allowed in the list. */
  limit: number;
  /** Return an error message for an invalid file, or null when it is fine. */
  validate: (file: File) => string | null;
}

/** Merge `incoming` into `existing`, validating, de-duplicating and capping. */
export function addUniqueFiles(
  existing: File[],
  incoming: File[],
  { limit, validate }: AddFilesOptions
): AddFilesResult {
  const files = [...existing];
  const seen = new Set(files.map(fileKey));
  const issues: string[] = [];
  let duplicates = 0;
  let overLimit = 0;

  for (const file of incoming) {
    const problem = validate(file);
    if (problem) {
      issues.push(problem);
      continue;
    }
    if (seen.has(fileKey(file))) {
      duplicates += 1;
      continue;
    }
    if (files.length >= limit) {
      overLimit += 1;
      continue;
    }
    seen.add(fileKey(file));
    files.push(file);
  }

  return { files, issues, duplicates, overLimit };
}

/**
 * Turn the outcome of `addUniqueFiles` into one message, or null when nothing
 * went wrong. Several rejected files are summarised instead of letting the last
 * error silently overwrite the earlier ones.
 */
export function describeAddResult(result: AddFilesResult, limit: number): string | null {
  const parts: string[] = [];
  if (result.issues.length > 0) {
    const shown = result.issues.slice(0, 2);
    const extra = result.issues.length - shown.length;
    parts.push(shown.join(" ") + (extra > 0 ? ` (+${extra} more skipped.)` : ""));
  }
  if (result.duplicates > 0) {
    parts.push(
      `${result.duplicates} duplicate file${result.duplicates === 1 ? " was" : "s were"} skipped.`
    );
  }
  if (result.overLimit > 0) {
    parts.push(
      `Only ${limit} files can be processed at a time — ${result.overLimit} more ${
        result.overLimit === 1 ? "was" : "were"
      } left out.`
    );
  }
  return parts.length > 0 ? parts.join(" ") : null;
}

/**
 * Give `name` a unique spelling among names already handed out, suffixing
 * " (2)", " (3)"… before the extension. Two inputs can share a base name
 * (`photo.jpg` from two folders) and would otherwise produce outputs that
 * overwrite each other on disk and collide as React keys.
 */
export function uniqueName(name: string, used: Map<string, number>): string {
  const count = used.get(name) ?? 0;
  used.set(name, count + 1);
  if (count === 0) return name;
  return name.replace(/(\.[^.]+)?$/, ` (${count + 1})$1`);
}
