/**
 * Client-side text extraction from images using tesseract.js.
 * Recognition runs locally via WebAssembly. On first use per language,
 * tesseract.js fetches its (image-agnostic) trained-data file for that
 * language from its CDN — a one-time few-MB download, cached afterward.
 * The photo itself is never uploaded anywhere.
 */

export const OCR_SIZE_LIMIT = 20 * 1024 * 1024; // 20 MB

export const OCR_LANGUAGES = [
  { code: "eng", label: "English" },
  { code: "hin", label: "Hindi" },
  { code: "spa", label: "Spanish" },
  { code: "fra", label: "French" },
  { code: "deu", label: "German" },
  { code: "ara", label: "Arabic" },
  { code: "chi_sim", label: "Chinese (Simplified)" },
] as const;

export function validateOcrImage(file: File): string | null {
  if (!file.type.startsWith("image/")) {
    return `"${file.name}" doesn't look like an image file.`;
  }
  if (file.size > OCR_SIZE_LIMIT) {
    return `"${file.name}" is larger than the 20 MB limit for this tool.`;
  }
  return null;
}

export async function extractTextFromImage(
  file: File,
  langCode: string,
  onProgress?: (status: string, progress: number) => void
): Promise<string> {
  const { createWorker } = await import("tesseract.js");
  const worker = await createWorker(langCode, 1, {
    logger: (m) => onProgress?.(m.status, m.progress ?? 0),
  });
  try {
    const { data } = await worker.recognize(file);
    return data.text.trim();
  } catch {
    throw new Error(`"${file.name}" could not be processed for text recognition.`);
  } finally {
    await worker.terminate();
  }
}
