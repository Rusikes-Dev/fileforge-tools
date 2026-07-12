/**
 * Client-side background removal using @imgly/background-removal.
 *
 * The photo itself never leaves the browser — segmentation runs locally via
 * WebAssembly/ONNX Runtime Web. On first use in a session, the library fetches
 * its (photo-agnostic) model weights from IMG.LY's CDN — a one-time,
 * ~10-40 MB download of a generic pretrained model, cached by the browser
 * afterward. No user image data is ever part of that request.
 */

export const BG_REMOVAL_SIZE_LIMIT = 20 * 1024 * 1024; // 20 MB

export function validatePhotoFile(file: File): string | null {
  if (!file.type.startsWith("image/")) {
    return `"${file.name}" doesn't look like an image file.`;
  }
  if (file.size > BG_REMOVAL_SIZE_LIMIT) {
    return `"${file.name}" is larger than the 20 MB limit for this tool.`;
  }
  return null;
}

export type BgModelQuality = "small" | "medium" | "large";

export async function removeImageBackground(
  file: File,
  options: {
    model?: BgModelQuality;
    onProgress?: (label: string, current: number, total: number) => void;
  } = {}
): Promise<Blob> {
  const { removeBackground } = await import("@imgly/background-removal");
  try {
    return await removeBackground(file, {
      // @imgly/background-removal accepts "small"/"medium"/"large" at runtime
      // (aliased internally to isnet_quint8/isnet_fp16/isnet), but its public
      // .d.ts only exposes the post-alias enum — hence the cast.
      model: (options.model ?? "medium") as "small" | "medium" | "large" as never,
      output: { format: "image/png", quality: 0.9 },
      progress: (key, current, total) => options.onProgress?.(key, current, total),
    });
  } catch (err) {
    throw new Error(
      err instanceof Error && /fetch|network/i.test(err.message)
        ? "The background-removal model couldn't be downloaded. Check your internet connection and try again."
        : `"${file.name}" could not be processed. Try a different photo, ideally with a clear subject.`
    );
  }
}

/** Composite a cutout (with transparency) onto a solid background color. */
export async function flattenOntoColor(cutout: Blob, color: string): Promise<Blob> {
  const bitmap = await createImageBitmap(cutout);
  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Your browser could not create a drawing canvas.");
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bitmap, 0, 0);
  bitmap.close();
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("Could not export the image."))), "image/png");
  });
}
