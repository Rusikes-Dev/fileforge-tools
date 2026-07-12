/**
 * Passport / ID photo sizing, cropping, and print-sheet layout — all done
 * with the Canvas API in the browser. No photo data ever leaves the device.
 *
 * IMPORTANT: passport/visa photo specifications vary by country and change
 * periodically. These presets reflect commonly published specs at the time
 * of writing, but the only way to be certain is to check the current
 * requirements on the issuing authority's own portal before submitting.
 */

export interface PassportPreset {
  id: string;
  label: string;
  widthMm: number;
  heightMm: number;
  dpi: number;
  background: string;
  note?: string;
}

export const PASSPORT_PRESETS: PassportPreset[] = [
  {
    id: "us",
    label: "US Passport / Visa (2×2 in)",
    widthMm: 50.8,
    heightMm: 50.8,
    dpi: 300,
    background: "Plain white or off-white",
    note: "Head height (chin to crown) should be 1–1⅜ in (25–35 mm). No glasses.",
  },
  {
    id: "india-passport",
    label: "India Passport (Passport Seva)",
    widthMm: 35,
    heightMm: 45,
    dpi: 300,
    background: "Plain white",
    note: "OCI cards and some Indian visas use a different 2×2 in square format instead — check your specific portal.",
  },
  {
    id: "india-oci-visa",
    label: "India OCI / Visa (2×2 in square)",
    widthMm: 50.8,
    heightMm: 50.8,
    dpi: 300,
    background: "Light cream / off-white (not pure white)",
  },
  {
    id: "uk",
    label: "UK Passport (35×45 mm)",
    widthMm: 35,
    heightMm: 45,
    dpi: 300,
    background: "Light grey or cream — not white",
    note: "UK visa (UKVI) applications typically require a white background instead — different rule from the passport itself.",
  },
  {
    id: "schengen",
    label: "Schengen / EU Visa (35×45 mm)",
    widthMm: 35,
    heightMm: 45,
    dpi: 300,
    background: "Plain white",
  },
  {
    id: "canada",
    label: "Canada Passport (50×70 mm)",
    widthMm: 50,
    heightMm: 70,
    dpi: 300,
    background: "Plain white",
    note: "Canadian passport photos must be taken and certified by a commercial photographer — this tool can help you preview sizing, but check IRCC rules before relying on a DIY photo.",
  },
  {
    id: "custom",
    label: "Custom size",
    widthMm: 35,
    heightMm: 45,
    dpi: 300,
    background: "As required",
  },
];

export function mmToPx(mm: number, dpi: number): number {
  return Math.round((mm / 25.4) * dpi);
}

export interface Rect { x: number; y: number; w: number; h: number }

/**
 * Crop a rectangle from `image`, where `cropRect` and `displaySize` are in
 * the same on-screen coordinate space the crop UI uses, and export it at
 * `outputPx` pixel dimensions.
 */
export function cropAndExport(
  image: HTMLImageElement,
  cropRect: Rect,
  displaySize: { w: number; h: number },
  outputPx: { w: number; h: number }
): Promise<Blob> {
  const scaleX = image.naturalWidth / displaySize.w;
  const scaleY = image.naturalHeight / displaySize.h;
  const sx = cropRect.x * scaleX;
  const sy = cropRect.y * scaleY;
  const sw = cropRect.w * scaleX;
  const sh = cropRect.h * scaleY;

  const canvas = document.createElement("canvas");
  canvas.width = outputPx.w;
  canvas.height = outputPx.h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Your browser could not create a drawing canvas.");
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(image, sx, sy, sw, sh, 0, 0, outputPx.w, outputPx.h);

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("Could not export the photo."))), "image/jpeg", 0.95);
  });
}

export type SheetSize = "4x6in" | "a4";

const SHEET_DIMENSIONS_MM: Record<SheetSize, { w: number; h: number }> = {
  "4x6in": { w: 101.6, h: 152.4 },
  a4: { w: 210, h: 297 },
};

/** Tile copies of a passport photo onto a printable sheet at 300 DPI. */
export async function buildPrintSheet(
  photoBlob: Blob,
  photoMm: { w: number; h: number },
  sheet: SheetSize
): Promise<Blob> {
  const dpi = 300;
  const gapMm = 3;
  const marginMm = 5;

  const sheetMm = SHEET_DIMENSIONS_MM[sheet];
  const sheetPx = { w: mmToPx(sheetMm.w, dpi), h: mmToPx(sheetMm.h, dpi) };
  const photoPx = { w: mmToPx(photoMm.w, dpi), h: mmToPx(photoMm.h, dpi) };
  const gapPx = mmToPx(gapMm, dpi);
  const marginPx = mmToPx(marginMm, dpi);

  const cols = Math.max(1, Math.floor((sheetPx.w - 2 * marginPx + gapPx) / (photoPx.w + gapPx)));
  const rows = Math.max(1, Math.floor((sheetPx.h - 2 * marginPx + gapPx) / (photoPx.h + gapPx)));

  const canvas = document.createElement("canvas");
  canvas.width = sheetPx.w;
  canvas.height = sheetPx.h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Your browser could not create a drawing canvas.");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const bitmap = await createImageBitmap(photoBlob);
  const gridW = cols * photoPx.w + (cols - 1) * gapPx;
  const gridH = rows * photoPx.h + (rows - 1) * gapPx;
  const startX = (sheetPx.w - gridW) / 2;
  const startY = (sheetPx.h - gridH) / 2;

  ctx.strokeStyle = "#cccccc";
  ctx.lineWidth = 1;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = startX + c * (photoPx.w + gapPx);
      const y = startY + r * (photoPx.h + gapPx);
      ctx.drawImage(bitmap, x, y, photoPx.w, photoPx.h);
      ctx.strokeRect(x + 0.5, y + 0.5, photoPx.w - 1, photoPx.h - 1);
    }
  }
  bitmap.close();

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("Could not build the print sheet."))), "image/png");
  });
}
