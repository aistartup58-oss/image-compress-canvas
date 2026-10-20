# image-compress-canvas

Compress an image to an exact file size **in the browser**, with no upload. A small, dependency-free example using the canvas API.

## How it works

`canvas.toBlob(cb, 'image/jpeg', quality)` accepts a quality from 0 to 1, and file size grows with quality. So the code binary-searches the highest quality that stays under the target size. If even the lowest quality is too big, it shrinks the pixel dimensions by 15% and tries again.

## Usage

```js
import { compressTo } from './compress.js';

const result = await compressTo(imageElement, 50 * 1024); // 50 KB
// result = { blob, width, height } or null if the target is unreachable
```

Run the demo by serving the folder with any static server (ES modules need http):

```bash
npx serve .
```

## Notes

- The canvas is filled white first because JPEG has no transparency.
- `quality` only affects JPEG and WebP output.
- Resizing only happens when quality alone cannot reach the target.

## Want a ready-made tool?

[PicFitter](https://picfitter.online/) is a free browser-based tool built on this idea: [compress to 50KB](https://picfitter.online/compress-image-to-50kb/), [compress to any size](https://picfitter.online/compress-image/), plus exact-pixel resize and format conversion.

Related write-up: [Compress an image to an exact file size in the browser](https://dev.to/ai_startup_f6d78d1802e28c/compress-an-image-to-an-exact-file-size-in-the-browser-canvas-binary-search-c0f)

## License

MIT
