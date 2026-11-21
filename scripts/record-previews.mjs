// Records short looping preview videos for each template, in both themes:
//   templates/<id>/preview.mp4 + preview.jpg              (dark)
//   templates/<id>/preview-light.mp4 + preview-light.jpg  (?theme=light)
// The .jpg posters are taken from the videos, so a poster always matches its video.
//   node scripts/record-previews.mjs [template-id ...]
// Needs playwright (or playwright-core) and ffmpeg on PATH. Optional env: CHROME_PATH.
// While recording it moves the pointer in a figure-eight, and clicks or scrolls when the
// template's meta.json asks for it (check.click / check.scroll), so hover effects show.
import { readdirSync, existsSync, readFileSync, mkdtempSync, rmSync } from "node:fs";
import { join, dirname } from "node:path";
import { tmpdir } from "node:os";
import { execFileSync } from "node:child_process";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const pw = (() => { for (const m of ["playwright", "playwright-core"]) try { return require(m); } catch {} console.error("npm i -D playwright"); process.exit(1); })();
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const tdir = join(root, "templates");
const only = process.argv.slice(2);
const ids = readdirSync(tdir, { withFileTypes: true }).filter((d) => d.isDirectory() && existsSync(join(tdir, d.name, "index.html")))
  .map((d) => d.name).filter((id) => !only.length || only.includes(id));

const VW = 1280, VH = 800, SECONDS = 5;
const browser = await pw.chromium.launch({ executablePath: process.env.CHROME_PATH || undefined, args: ["--use-angle=d3d11", "--enable-gpu", "--ignore-gpu-blocklist"] });

for (const id of ids) for (const theme of ["dark", "light"]) {
  const meta = JSON.parse(readFileSync(join(tdir, id, "meta.json"), "utf8"));
  const suffix = theme === "light" ? "-light" : "";
  const tmp = mkdtempSync(join(tmpdir(), "rec-"));
  const ctx = await browser.newContext({ viewport: { width: VW, height: VH }, recordVideo: { dir: tmp, size: { width: VW, height: VH } } });
  const page = await ctx.newPage();
  const t0 = Date.now();
  // Templates with an embed mode (?embed) are filmed edge to edge, without their page title
  const embed = readFileSync(join(tdir, id, "index.html"), "utf8").includes('classList.add("embed")');
  const query = [embed && "embed", theme === "light" && "theme=light"].filter(Boolean).join("&");
  await page.goto(pathToFileURL(join(tdir, id, "index.html")).href + (query ? `?${query}` : ""), { waitUntil: "load" });
  await page.waitForTimeout(meta.check?.settle ?? 1200);

  // Where to crop: the same box the still preview uses
  const sel = embed ? (meta.check?.embedShot ?? "viewport") : (meta.check?.shot ?? ".stage, main");
  let clip = { x: 0, y: 0, w: VW, h: VH };
  if (sel !== "viewport") {
    const box = await page.evaluate((sel) => {
      const el = sel.split(",").map((s) => document.querySelector(s.trim())).find(Boolean); if (!el) return null;
      const r = el.getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height };
    }, sel);
    if (box?.w && box?.h) {
      let w = box.w + 48, h = box.h + 48;
      if (w / h > 1.6) h = w / 1.6; else w = h * 1.6;
      w = Math.min(w, VW); h = Math.min(h, VH);
      clip = { x: Math.max(0, Math.min(VW - w, box.x + box.w / 2 - w / 2)), y: Math.max(0, Math.min(VH - h, box.y + box.h / 2 - h / 2)), w, h };
    }
  }
  const startAt = (Date.now() - t0) / 1000;
  const steps = SECONDS * 30, scrollTotal = meta.check?.scroll ?? 0;
  for (let i = 0; i < steps; i++) {
    const t = i / steps;
    await page.mouse.move(clip.x + clip.w * (0.5 + 0.34 * Math.sin(t * Math.PI * 2)), clip.y + clip.h * (0.5 + 0.28 * Math.sin(t * Math.PI * 4)));
    if (meta.check?.click && i % 45 === 20) await page.mouse.click(clip.x + clip.w / 2, clip.y + clip.h / 2);
    if (scrollTotal && i % 3 === 0) await page.mouse.wheel(0, scrollTotal / (steps / 3));
    await page.waitForTimeout(1000 / 30);
  }
  const video = page.video();
  await page.close(); await ctx.close();
  const src = await video.path();
  const out = join(tdir, id, `preview${suffix}.mp4`);
  const even = (n) => Math.floor(n / 2) * 2;
  execFileSync("ffmpeg", ["-loglevel", "error", "-y", "-ss", String(startAt + 0.2), "-t", String(SECONDS - 0.4), "-i", src,
    "-vf", `crop=${even(clip.w)}:${even(clip.h)}:${even(clip.x)}:${even(clip.y)},scale=800:500:flags=lanczos,fps=30`,
    "-c:v", "libx264", "-preset", "slow", "-crf", "30", "-pix_fmt", "yuv420p", "-movflags", "+faststart", "-an", out]);
  execFileSync("ffmpeg", ["-loglevel", "error", "-y", "-ss", "1.6", "-i", out, "-frames:v", "1", "-q:v", "4", join(tdir, id, `preview${suffix}.jpg`)]);
  rmSync(tmp, { recursive: true, force: true });
  console.log("rec", id, theme);
}
await browser.close();
