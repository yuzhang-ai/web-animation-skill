// Regenerates the README media from the built site (run build-site first):
//   docs/media/hero.jpg        1280×640 dark home (also the social card)
//   docs/media/hero-light.jpg  1280×640 light home
//   docs/media/demo.mp4        guided tour: camera tour → live cards → gallery → template page → light theme → 中文
//   docs/media/demo.gif        the first part of the tour, small enough for a README
//   node scripts/record-readme.mjs
// Needs playwright (or playwright-core) and ffmpeg. Optional env: CHROME_PATH.
import { mkdtempSync, rmSync } from "node:fs";
import { join, dirname } from "node:path";
import { tmpdir } from "node:os";
import { execFileSync } from "node:child_process";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const pw = (() => { for (const m of ["playwright", "playwright-core"]) try { return require(m); } catch {} console.error("npm i -D playwright"); process.exit(1); })();
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const site = (p) => pathToFileURL(join(root, "_site", p)).href;
const media = join(root, "docs/media");
const ff = (...a) => execFileSync("ffmpeg", ["-loglevel", "error", "-y", ...a]);
const browser = await pw.chromium.launch({ executablePath: process.env.CHROME_PATH || undefined,
  args: ["--use-angle=d3d11", "--enable-gpu", "--ignore-gpu-blocklist", "--autoplay-policy=no-user-gesture-required"] });

// ---- stills: the home hero in both themes, after the intro has played and the camera has moved once
for (const [theme, file] of [["dark", "hero.jpg"], ["light", "hero-light.jpg"]]) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 640 }, deviceScaleFactor: 1 });
  await ctx.addInitScript((t) => { localStorage.setItem("theme", t); localStorage.setItem("lang", "en"); }, theme);
  const page = await ctx.newPage();
  await page.goto(site("index.html"));
  // Shoot while the camera still frames the first preview (the fluid cursor), once its video is really playing
  await page.waitForTimeout(1600);
  await page.waitForFunction(() => { const v = document.querySelector(".shot.focus video"); return v && v.readyState >= 3 && v.currentTime > 1.2; }, null, { timeout: 15000 });
  await page.screenshot({ path: join(media, file), type: "jpeg", quality: 88 });
  await ctx.close();
  console.log("still", file);
}

// ---- the tour
const tmp = mkdtempSync(join(tmpdir(), "readme-"));
const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, recordVideo: { dir: tmp, size: { width: 1280, height: 800 } } });
await ctx.addInitScript(() => { if (!sessionStorage.getItem("tour")) { localStorage.setItem("theme", "dark"); localStorage.setItem("lang", "en"); sessionStorage.setItem("tour", "1"); } });
const page = await ctx.newPage();
const t0 = Date.now();
const mark = () => (Date.now() - t0) / 1000;
const glide = async (dy, steps = 24) => { for (let i = 0; i < steps; i++) { await page.mouse.wheel(0, dy / steps); await page.waitForTimeout(28); } };
const sweep = async (x0, y0, x1, y1, n = 30) => { for (let i = 0; i <= n; i++) { const t = i / n; await page.mouse.move(x0 + (x1 - x0) * t, y0 + (y1 - y0) * t); await page.waitForTimeout(20); } };

await page.goto(site("index.html"));
const start = mark();
await page.waitForTimeout(8200);                                  // intro + camera tour (two moves)
await glide(720); await page.waitForTimeout(600);                 // live stack cards
await sweep(200, 300, 1100, 520); await page.waitForTimeout(800);
const gifEnd = mark();
await glide(560); await page.waitForTimeout(1400);
await page.goto(site("templates.html")); await page.waitForTimeout(2200);   // gallery
await glide(620); await page.waitForTimeout(1600);
await page.goto(site("t/lottie-like-button.html")); await page.waitForTimeout(2600);   // a template page
await page.click('[data-tab="code"]'); await page.waitForTimeout(1300);
await page.click('[data-tab="live"]'); await page.waitForTimeout(800);
await page.click(".theme-toggle"); await page.waitForTimeout(2200);          // light theme
await page.click(".lang-toggle"); await page.waitForTimeout(2600);           // 中文
const end = mark();
const video = page.video();
await page.close(); await ctx.close();
const src = await video.path();

ff("-ss", String(start), "-to", String(end), "-i", src, "-vf", "fps=30,scale=1280:-2:flags=lanczos",
  "-c:v", "libx264", "-preset", "slow", "-crf", "26", "-pix_fmt", "yuv420p", "-movflags", "+faststart", "-an", join(media, "demo.mp4"));
// GIF: two-pass palette, 10 fps, 720px wide (keeps it around 3 MB)
const pal = join(tmp, "pal.png");
ff("-ss", String(start + 0.6), "-to", String(gifEnd), "-i", src, "-vf", "fps=10,scale=720:-1:flags=lanczos,palettegen=max_colors=96:stats_mode=diff", pal);
ff("-ss", String(start + 0.6), "-to", String(gifEnd), "-i", src, "-i", pal, "-lavfi", "fps=10,scale=720:-1:flags=lanczos[x];[x][1:v]paletteuse=dither=bayer:bayer_scale=5:diff_mode=rectangle", join(media, "demo.gif"));
rmSync(tmp, { recursive: true, force: true });
await browser.close();
console.log(`tour ${(end - start).toFixed(1)}s, gif ${(gifEnd - start - 0.6).toFixed(1)}s`);
