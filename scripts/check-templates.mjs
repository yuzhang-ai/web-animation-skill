// Opens every template in Chromium, checks it, and saves preview.jpg.
//   node scripts/check-templates.mjs [template-id ...]
// Needs `playwright` or `playwright-core` (npm i -D playwright). Optional env:
//   CHROME_PATH   use this Chromium/Chrome binary instead of Playwright's
//
// For each template it reports console errors, page errors, failed requests,
// sideways overflow at 390px wide, and the frame rate while the pointer moves.
// It also re-runs under prefers-reduced-motion and fails on errors there.
import { readdirSync, existsSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const pw = (() => {
  for (const m of ["playwright", "playwright-core"]) try { return require(m); } catch {}
  console.error("Install playwright first: npm i -D playwright");
  process.exit(1);
})();

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const tdir = join(root, "templates");
const only = process.argv.slice(2);
const ids = readdirSync(tdir, { withFileTypes: true })
  .filter((d) => d.isDirectory() && existsSync(join(tdir, d.name, "index.html")))
  .map((d) => d.name)
  .filter((id) => !only.length || only.includes(id));

const browser = await pw.chromium.launch({
  executablePath: process.env.CHROME_PATH || undefined,
  args: ["--use-angle=d3d11", "--enable-gpu", "--ignore-gpu-blocklist", "--enable-unsafe-webgpu"],
});

async function run(id, { width, height, reduced, embed }) {
  const meta = JSON.parse(readFileSync(join(tdir, id, "meta.json"), "utf8"));
  const page = await browser.newPage({ viewport: { width, height }, reducedMotion: reduced ? "reduce" : "no-preference" });
  const problems = [];
  page.on("console", (m) => m.type() === "error" && problems.push(`console: ${m.text()}`));
  page.on("pageerror", (e) => problems.push(`pageerror: ${e.message}`));
  page.on("requestfailed", (r) => problems.push(`request failed: ${r.url()}`));
  await page.goto(pathToFileURL(join(tdir, id, "index.html")).href + (embed ? "?embed" : ""), { waitUntil: "load" });
  await page.waitForTimeout(meta.check?.settle ?? 1200);

  // Sweep the pointer across the page so hover / cursor effects have something to show.
  const fps = await page.evaluate(() => new Promise((res) => {
    let n = 0; const t0 = performance.now();
    (function f() { n++; performance.now() - t0 < 1000 ? requestAnimationFrame(f) : res(n); })();
  }).then((n) => n));
  for (let i = 0; i <= 24; i++) {
    const t = i / 24;
    await page.mouse.move(width * (0.15 + 0.7 * t), height * (0.5 + 0.25 * Math.sin(t * Math.PI * 2)));
    await page.waitForTimeout(16);
  }
  if (meta.check?.click) await page.mouse.click(width / 2, height / 2);
  if (meta.check?.scroll) {
    for (let y = 0; y < meta.check.scroll; y += 300) { await page.mouse.wheel(0, 300); await page.waitForTimeout(120); }
  }
  await page.waitForTimeout(meta.check?.after ?? 400);

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  if (overflow > 0) problems.push(`sideways overflow: ${overflow}px`);
  return { page, problems, fps };
}

let failed = 0;
for (const id of ids) {
  // The still preview is the poster of the video, so shoot it the same way (embed mode when available)
  const embed = readFileSync(join(tdir, id, "index.html"), "utf8").includes('classList.add("embed")');
  const desk = await run(id, { width: 1280, height: 800, embed });
  // Preview: crop to the effect (meta.check.shot, else .stage, else main) at 16:10 with a margin,
  // so thumbnails show the effect rather than a mostly empty page. "viewport" keeps the full screen.
  const meta = JSON.parse(readFileSync(join(tdir, id, "meta.json"), "utf8"));
  const sel = embed ? (meta.check?.embedShot ?? "viewport") : (meta.check?.shot ?? ".stage, main");
  let clip;
  if (sel !== "viewport") {
    const box = await desk.page.evaluate((sel) => {
      // Try each selector in order (querySelector("a, b") would return whichever comes first in the page)
      const el = sel.split(",").map((s) => document.querySelector(s.trim())).find(Boolean); if (!el) return null;
      const r = el.getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height };
    }, sel);
    if (box && box.w > 0 && box.h > 0) {
      let w = box.w + 48, h = box.h + 48;
      if (w / h > 1.6) h = w / 1.6; else w = h * 1.6;
      w = Math.min(w, 1280); h = Math.min(h, 800);
      const cx = box.x + box.w / 2, cy = box.y + box.h / 2;
      clip = { x: Math.max(0, Math.min(1280 - w, cx - w / 2)), y: Math.max(0, Math.min(800 - h, cy - h / 2)), width: w, height: h };
    }
  }
  await desk.page.screenshot({ path: join(tdir, id, "preview.jpg"), type: "jpeg", quality: 82, ...(clip ? { clip } : {}) });
  await desk.page.close();
  const mobile = await run(id, { width: 390, height: 844 });
  await mobile.page.close();
  const reduced = await run(id, { width: 1280, height: 800, reduced: true });
  await reduced.page.close();

  const problems = [
    ...desk.problems.map((p) => `desktop ${p}`),
    ...mobile.problems.map((p) => `mobile ${p}`),
    ...reduced.problems.map((p) => `reduced ${p}`),
  ];
  const ok = problems.length === 0;
  if (!ok) failed++;
  console.log(`${ok ? "ok  " : "FAIL"} ${id.padEnd(24)} ${String(desk.fps).padStart(3)} fps`);
  for (const p of problems) console.log(`     ${p}`);
}
await browser.close();
process.exit(failed ? 1 : 0);
