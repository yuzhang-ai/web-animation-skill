// Assembles the GitHub Pages site into _site/:
//   docs/            → /            (home, gallery, shared assets)
//   templates/       → /templates/  (the live template pages, previews, catalog)
//   generated        → /t/<id>.html and /t/<id>.zh.html (one documentation page per template and language)
//   node scripts/build-site.mjs
// The Pages workflow runs this too, so the local _site/ is exactly what gets deployed.
import { cpSync, rmSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { templatePage } from "./pages.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "_site");
rmSync(out, { recursive: true, force: true });
mkdirSync(out);
cpSync(join(root, "docs"), out, { recursive: true });
cpSync(join(root, "templates"), join(out, "templates"), { recursive: true });

const catalog = JSON.parse(readFileSync(join(root, "templates/catalog.json"), "utf8"));
mkdirSync(join(out, "t"));
for (const t of catalog.templates) {
  const src = readFileSync(join(root, "templates", t.id, "index.html"), "utf8").replace(/\r\n/g, "\n");
  const md = readFileSync(join(root, "templates", t.id, "prompt.md"), "utf8").replace(/\r\n/g, "\n");
  writeFileSync(join(out, "t", `${t.id}.html`), templatePage(t, catalog.templates, catalog.groups, src, md, "en"));
  writeFileSync(join(out, "t", `${t.id}.zh.html`), templatePage(t, catalog.templates, catalog.groups, src, md, "zh"));
}
console.log(`site: _site/ (docs + templates + ${catalog.templates.length * 2} template pages, en + zh)`);
