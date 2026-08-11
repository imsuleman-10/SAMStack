/**
 * Compresses an image File/Blob using the browser Canvas API.
 * Targets a maximum file size of ~100KB (default).
 * Returns a new Blob in JPEG format.
 */
export async function compressImage(
  file: File,
  options: {
    maxWidthPx?: number;   // resize if wider than this (default 800)
    targetKB?: number;     // target size in KB (default 100)
    minQuality?: number;   // stop iterating below this quality (default 0.35)
  } = {}
): Promise<Blob> {
  const {
    maxWidthPx = 800,
    targetKB = 100,
    minQuality = 0.35,
  } = options;

  const targetBytes = targetKB * 1024;

  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      // --- 1. Resize if needed ---
      let { width, height } = img;
      if (width > maxWidthPx) {
        height = Math.round((height * maxWidthPx) / width);
        width = maxWidthPx;
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) { reject(new Error("Canvas not supported")); return; }
      ctx.drawImage(img, 0, 0, width, height);

      // --- 2. Binary-search quality until we're under targetBytes ---
      let lo = minQuality;
      let hi = 0.95;
      let bestBlob: Blob | null = null;

      const tryQuality = (q: number): Promise<Blob> =>
        new Promise((res) =>
          canvas.toBlob((b) => res(b!), "image/jpeg", q)
        );

      (async () => {
        // First try high quality — if already small enough, keep it
        let blob = await tryQuality(hi);
        if (blob.size <= targetBytes) {
          return resolve(blob);
        }

        // Binary search
        for (let i = 0; i < 8; i++) {
          const mid = (lo + hi) / 2;
          blob = await tryQuality(mid);
          if (blob.size <= targetBytes) {
            bestBlob = blob;
            lo = mid; // try higher quality
          } else {
            hi = mid; // try lower quality
          }
        }

        // If binary search couldn't hit target, try minimum quality
        if (!bestBlob) {
          bestBlob = await tryQuality(minQuality);
        }

        resolve(bestBlob!);
      })();
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };

    img.src = url;
  });
}

/**
 * Converts a Blob to a File with a given name.
 */
export function blobToFile(blob: Blob, name: string): File {
  return new File([blob], name, { type: blob.type, lastModified: Date.now() });
}
