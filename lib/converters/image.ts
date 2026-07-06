/**
 * Client-side image processing built on canvas.
 * All functions run in the browser only.
 */

export const IMAGE_SIZE_LIMIT = 25 * 1024 * 1024; // 25 MB per file
export const IMAGE_COUNT_LIMIT = 30;

export type ImageMime = "image/jpeg" | "image/png" | "image/webp";

export function extensionFor(mime: ImageMime): string {
  return mime === "image/jpeg" ? "jpg" : mime === "image/png" ? "png" : "webp";
}

export function validateImageFile(file: File, acceptedMimes: string[]): string | null {
  if (file.size > IMAGE_SIZE_LIMIT) {
    return `"${file.name}" is larger than the current 25 MB browser-processing limit.`;
  }
  const okMime = acceptedMimes.includes(file.type);
  const ext = file.name.toLowerCase().split(".").pop() ?? "";
  const extMap: Record<string, string> = {
    jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", webp: "image/webp",
    gif: "image/gif", svg: "image/svg+xml",
  };
  const okExt = acceptedMimes.includes(extMap[ext] ?? "");
  if (!okMime && !okExt) {
    return `"${file.name}" is not a supported format for this tool.`;
  }
  return null;
}

/** Decode a file to an ImageBitmap, honoring EXIF orientation. */
export async function decodeImage(file: File): Promise<ImageBitmap> {
  try {
    return await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    throw new Error(
      `"${file.name}" could not be decoded. The file may be corrupted or in an unsupported format.`
    );
  }
}

function canvasFor(width: number, height: number): { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D } {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Your browser could not create a drawing context for image processing.");
  return { canvas, ctx };
}

function toBlob(canvas: HTMLCanvasElement, mime: ImageMime, quality?: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Your browser ran out of memory while encoding this image. Try a smaller file."));
      },
      mime,
      quality
    );
  });
}

export interface ConvertOptions {
  mime: ImageMime;
  /** 0–1, for lossy formats */
  quality?: number;
  /** Fill color used when converting transparency to an opaque format */
  background?: string;
}

export async function convertImage(file: File, opts: ConvertOptions): Promise<Blob> {
  const bitmap = await decodeImage(file);
  try {
    const { canvas, ctx } = canvasFor(bitmap.width, bitmap.height);
    if (opts.mime === "image/jpeg") {
      ctx.fillStyle = opts.background ?? "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    ctx.drawImage(bitmap, 0, 0);
    return await toBlob(canvas, opts.mime, opts.quality);
  } finally {
    bitmap.close();
  }
}

export interface ResizeOptions extends ConvertOptions {
  width: number;
  height: number;
}

export async function resizeImage(file: File, opts: ResizeOptions): Promise<Blob> {
  const bitmap = await decodeImage(file);
  try {
    const { canvas, ctx } = canvasFor(Math.round(opts.width), Math.round(opts.height));
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    if (opts.mime === "image/jpeg") {
      ctx.fillStyle = opts.background ?? "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    return await toBlob(canvas, opts.mime, opts.quality);
  } finally {
    bitmap.close();
  }
}

export interface CropRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export async function cropImage(file: File, rect: CropRect, opts: ConvertOptions): Promise<Blob> {
  const bitmap = await decodeImage(file);
  try {
    const x = Math.max(0, Math.min(rect.x, bitmap.width - 1));
    const y = Math.max(0, Math.min(rect.y, bitmap.height - 1));
    const w = Math.max(1, Math.min(rect.width, bitmap.width - x));
    const h = Math.max(1, Math.min(rect.height, bitmap.height - y));
    const { canvas, ctx } = canvasFor(w, h);
    ctx.drawImage(bitmap, x, y, w, h, 0, 0, w, h);
    return await toBlob(canvas, opts.mime, opts.quality);
  } finally {
    bitmap.close();
  }
}

export interface TransformOptions extends ConvertOptions {
  /** rotation in degrees, multiples of 90 */
  rotate: 0 | 90 | 180 | 270;
  flipH?: boolean;
  flipV?: boolean;
}

export async function transformImage(file: File, opts: TransformOptions): Promise<Blob> {
  const bitmap = await decodeImage(file);
  try {
    const swap = opts.rotate === 90 || opts.rotate === 270;
    const { canvas, ctx } = canvasFor(swap ? bitmap.height : bitmap.width, swap ? bitmap.width : bitmap.height);
    if (opts.mime === "image/jpeg") {
      ctx.fillStyle = opts.background ?? "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((opts.rotate * Math.PI) / 180);
    ctx.scale(opts.flipH ? -1 : 1, opts.flipV ? -1 : 1);
    ctx.drawImage(bitmap, -bitmap.width / 2, -bitmap.height / 2);
    return await toBlob(canvas, opts.mime, opts.quality);
  } finally {
    bitmap.close();
  }
}

export async function imageDimensions(file: File): Promise<{ width: number; height: number }> {
  const bitmap = await decodeImage(file);
  const dims = { width: bitmap.width, height: bitmap.height };
  bitmap.close();
  return dims;
}
