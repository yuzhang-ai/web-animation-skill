# Exporting animations: GIF, MP4, WebM

Use this when the user needs a *file*, for example a README demo, a social post, a design review, or a bug report. If the deliverable is a full video with scenes, audio, and editing, use [Remotion](https://github.com/remotion-dev/skills) or [Motion Canvas](https://github.com/motion-canvas/motion-canvas) instead.

## Pick a method

| Situation | Method |
|---|---|
| Any web page / DOM animation, needs to be smooth | **A. Playwright + fake clock → frames → ffmpeg** (deterministic) |
| A single `<canvas>`, record in the user's browser | **B. `canvas.captureStream()` + MediaRecorder** → WebM |
| Small GIF generated client-side (e.g. "Download GIF" button) | **C. gifenc** |

Real-time screen recording drops frames whenever the machine is busy. Method A doesn't: it advances a fake clock exactly one frame at a time, so every frame is perfect even if each screenshot takes 200ms.

## A. Deterministic capture (Playwright + ffmpeg)

```js
// capture.mjs  →  node capture.mjs http://localhost:5173 frames 25 4
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const [url, outDir = "frames", fps = 25, seconds = 4] = process.argv.slice(2);
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 1 });
await page.clock.install();               // fake Date, setTimeout, rAF, performance.now
await page.goto(url, { waitUntil: "networkidle" });
// install() alone still lets fake time flow in real time — pause it, then step manually
await page.clock.pauseAt(await page.evaluate(() => Date.now() + 1));

const step = 1000 / fps;                  // runFor() takes whole ms: prefer 25 or 50 fps (40/20 ms)
for (let i = 0; i < fps * seconds; i++) {
  await page.clock.runFor(step);  // advances JS: rAF loops, GSAP, Motion, Anime.js, Three.js…
  // CSS animations / WAAPI run on the real document timeline, not the fake clock,
  // so seek them to the same time explicitly:
  await page.evaluate((t) => document.getAnimations().forEach((a) => { a.pause(); a.currentTime = t; }), (i + 1) * step);
  await page.screenshot({ path: `${outDir}/${String(i).padStart(5, "0")}.png` });
}
await browser.close();
```

Note that `currentTime` set this way is relative to each animation's start. Animations created later (on hover, or after a timeout) need their own offset, so keep the capture to animations that start on load.

Then encode the frames:

```bash
# MP4 (H.264, plays everywhere incl. GitHub README via <video>)
ffmpeg -framerate 25 -i frames/%05d.png -c:v libx264 -pix_fmt yuv420p -crf 18 -movflags +faststart demo.mp4

# WebM (smaller, good for web pages)
ffmpeg -framerate 25 -i frames/%05d.png -c:v libvpx-vp9 -b:v 0 -crf 32 demo.webm

# GIF — two-pass palette for clean colors; scale down and lower fps to keep size < 10 MB
ffmpeg -framerate 25 -i frames/%05d.png -vf "fps=12.5,scale=720:-1:flags=lanczos,split[a][b];[a]palettegen=stats_mode=diff[p];[b][p]paletteuse=dither=bayer:bayer_scale=4" demo.gif
```

Tips:
- To make a seamless loop, capture exactly one loop period. With a 4s cycle at 25fps, that is 100 frames.
- GitHub README: GIFs autoplay but are large. An MP4 uploaded to an issue or PR gives a `user-attachments` URL that you can embed and that plays inline.
- Animated WebP / AVIF are smaller than GIF: `ffmpeg ... -c:v libwebp -loop 0 -q:v 70 demo.webp`.

## B. Record a canvas in the browser (MediaRecorder)

```js
function recordCanvas(canvas, seconds = 4, fps = 60) {
  const stream = canvas.captureStream(fps);
  const mime = MediaRecorder.isTypeSupported("video/webm;codecs=vp9") ? "video/webm;codecs=vp9" : "video/webm";
  const rec = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 8_000_000 });
  const chunks = [];
  rec.ondataavailable = (e) => chunks.push(e.data);
  const done = new Promise((r) => (rec.onstop = () => r(new Blob(chunks, { type: mime }))));
  rec.start();
  setTimeout(() => rec.stop(), seconds * 1000);
  return done;
}

const blob = await recordCanvas(renderer.domElement);
const a = Object.assign(document.createElement("a"), { href: URL.createObjectURL(blob), download: "scene.webm" });
a.click();
```

- This works for Three.js, Konva, Two.js (canvas/WebGL renderer), Proton, and Lottie (canvas renderer). For WebGL, create the renderer with `preserveDrawingBuffer: true` if frames come out blank.
- It records in real time, so dropped frames end up in the file. Use method A for a perfect result.

## C. gifenc — encode GIFs in JS

[gifenc](https://github.com/mattdesl/gifenc) is a tiny, fast GIF encoder (works in browsers, Workers, and Node).

```js
import { GIFEncoder, quantize, applyPalette } from "gifenc";

function canvasToGif(drawFrame, { width, height, frames = 60, fps = 30 }) {
  const canvas = new OffscreenCanvas(width, height);
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  const gif = GIFEncoder();

  for (let i = 0; i < frames; i++) {
    drawFrame(ctx, i / frames);                       // t: 0 → 1 (deterministic)
    const { data } = ctx.getImageData(0, 0, width, height);
    const palette = quantize(data, 256);              // or reuse one palette for all frames
    const index = applyPalette(data, palette);
    gif.writeFrame(index, width, height, { palette, delay: 1000 / fps });
  }
  gif.finish();
  return new Blob([gif.bytes()], { type: "image/gif" });
}
```

- Drive your animation from `t` (a function of frame index), **not** from wall-clock time. That makes the output deterministic and loopable.
- Reusing one palette (quantized from a representative frame) is faster and avoids color flicker between frames.
- Move encoding into a Web Worker for > 100 frames so the UI doesn't freeze.
- Transparency: `quantize(data, 256, { format: "rgba4444", oneBitAlpha: true })` + `writeFrame(..., { transparent: true })`.
