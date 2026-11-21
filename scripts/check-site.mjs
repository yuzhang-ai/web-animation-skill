// Whole-page pass over the built site (run build-site first).
//   node scripts/check-site.mjs [outDir]
// Home, gallery and two template pages, in both languages and both themes, at 1440 and 390 wide: wheel-scrolls in
// 600px steps, screenshots each stop into outDir, and reports console errors, page errors and
// sideways overflow.
import { mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const pw = (() => { for (const m of ["playwright", "playwright-core"]) try { return require(m); } catch {} console.error("npm i -D playwright"); process.exit(1); })();
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const site = join(root, "_site");
const out = process.argv[2] || join(root, "_site-check");
mkdirSync(out, { recursive: true });

const PAGES = [["home", "index.html"], ["gallery", "templates.html"], ["t-glow", "t/glow-cards.html"], ["t-blob", "t/iridescent-blob.html"]];
const LANGS = ["en", "zh"];
const browser = await pw.chromium.launch({ executablePath: process.env.CHROME_PATH || undefined, args: ["--use-angle=d3d11", "--enable-gpu", "--ignore-gpu-blocklist", "--autoplay-policy=no-user-gesture-required"] });
let failed = 0;
for (const lang of LANGS) for (const theme of ["dark", "light"]) {
  for (const [name, rawPath] of PAGES) {
    const path = lang === "zh" ? rawPath.replace(/^(t\/[\w-]+)\.html$/, "$1.zh.html") : rawPath;
    for (const [vw, vh] of [[1440, 900], [390, 844]]) {
      const ctx = await browser.newContext({ viewport: { width: vw, height: vh } });
      await ctx.addInitScript(([t, l]) => { try { localStorage.setItem("theme", t); localStorage.setItem("lang", l); } catch {} }, [theme, lang]);
      const page = await ctx.newPage();
      const problems = [];
      page.on("console", (m) => m.type() === "error" && problems.push(`console: ${m.text()}`));
      page.on("pageerror", (e) => problems.push(`pageerror: ${e.message}`));
      await page.goto(pathToFileURL(join(site, path)).href, { waitUntil: "load" });
      await page.waitForTimeout(2500);
      await page.mouse.move(vw * 0.6, vh * 0.5);
      const total = await page.evaluate(() => document.documentElement.scrollHeight);
      let i = 0;
      for (let y = 0; y < total && i < 24; y += 600, i++) {
        await page.screenshot({ path: join(out, `${lang}-${theme}-${name}-${vw}-${String(i).padStart(2, "0")}.jpg`), type: "jpeg", quality: 70 });
        await page.mouse.wheel(0, 600);
        await page.waitForTimeout(900);
      }
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
      if (overflow > 0) problems.push(`sideways overflow ${overflow}px`);
      console.log(`${problems.length ? "FAIL" : "ok  "} ${lang} ${theme} ${name} @${vw}  ${i} shots`);
      problems.forEach((p) => console.log("     " + p));
      if (problems.length) failed++;
      await ctx.close();
    }
  }
}
await browser.close();
process.exit(failed ? 1 : 0);
