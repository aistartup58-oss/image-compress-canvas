// Compress an image to a target file size in the browser (no upload).
// Binary-searches JPEG quality; shrinks dimensions only if needed.

function toBlob(canvas, type, quality) {
  return new Promise((resolve) => canvas.toBlob(resolve, type, quality));
}

export async function compressTo(img, targetBytes) {
  let w = img.naturalWidth, h = img.naturalHeight;

  for (let i = 0; i < 18; i++) {
    const c = document.createElement('canvas');
    c.width = Math.max(1, Math.round(w));
    c.height = Math.max(1, Math.round(h));
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#fff'; // JPEG has no transparency
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.drawImage(img, 0, 0, c.width, c.height);

    let lo = 0.05, hi = 0.95;
    let best = await toBlob(c, 'image/jpeg', lo);

    if (best && best.size <= targetBytes) {
      for (let j = 0; j < 7; j++) {
        const mid = (lo + hi) / 2;
        const b = await toBlob(c, 'image/jpeg', mid);
        if (b.size <= targetBytes) { best = b; lo = mid; } else { hi = mid; }
      }
      return { blob: best, width: c.width, height: c.height };
    }
    w *= 0.85; h *= 0.85; // still too big at lowest quality: shrink and retry
  }
  return null;
}
