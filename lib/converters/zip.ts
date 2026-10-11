/**
 * Bundle several result files into one ZIP so a batch needs a single download
 * instead of one click per file. JSZip is imported on demand so it only loads
 * when somebody actually asks for the archive.
 */
export async function zipBlobs(items: Array<{ name: string; blob: Blob }>): Promise<Blob> {
  const { default: JSZip } = await import("jszip");
  const zip = new JSZip();
  const used = new Map<string, number>();

  for (const item of items) {
    // Two inputs can share a base name (a.jpg from two folders); suffix the
    // later ones instead of letting the archive silently overwrite the first.
    const count = used.get(item.name) ?? 0;
    used.set(item.name, count + 1);
    const name = count === 0 ? item.name : item.name.replace(/(\.[^.]+)?$/, ` (${count + 1})$1`);
    zip.file(name, item.blob);
  }

  return zip.generateAsync({ type: "blob", compression: "DEFLATE", compressionOptions: { level: 6 } });
}
