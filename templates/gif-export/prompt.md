# GIF export

**Effect:** two squares side by side: on the left, four coloured arcs sweep around a pulsing dot on a live canvas; on the right, the same loop as a GIF that was just encoded in the browser, with its frame count, size and encode time, and a Save link.

**Use it for:** README and social previews, shareable stickers, loops for design review. See rules/export.md for MP4/WebM and Playwright capture.

## Prompt

```
Encode a canvas animation to a GIF in the browser with gifenc 1.0.3 (import { GIFEncoder, quantize, applyPalette } from "https://cdn.jsdelivr.net/npm/gifenc@1.0.3/dist/gifenc.esm.js").
- Write draw(ctx, t, size) as a pure function of t ∈ [0, 1): every angle and size uses t·2π, so frame N equals frame 0 and the loop is seamless.
- Live preview: a rAF loop advancing t by dt / period.
- Export: an offscreen canvas (getContext("2d", { willReadFrequently: true })), N = 40 frames; for each, draw(ctx, i / N), getImageData, quantize(data, 128) once for a shared palette, applyPalette, gif.writeFrame(index, S, S, { palette, delay: 50 }). gif.finish(); new Blob([gif.bytes()], { type: "image/gif" }) → object URL for an <img> and a download link.
- Reduced motion: show frame 0 as a still PNG instead of the GIF.
Start from templates/gif-export/index.html.
```

## Knobs

| Knob | Effect |
|---|---|
| `N`, `delay` | Frames and ms per frame (loop length = N × delay) |
| `quantize(data, 128)` | Palette size: fewer colours = smaller file |
| `S` | Output size in pixels |

## Pitfalls

- Drawing from the wall clock makes the last frame not match the first: the GIF stutters at the loop point.
- Quantize one palette for all frames (or per frame with care); per-frame palettes flicker.
- Revoke old object URLs when re-encoding.
