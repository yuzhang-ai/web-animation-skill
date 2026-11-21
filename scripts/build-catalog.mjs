// Builds the template catalog from templates/*/meta.json.
//   node scripts/build-catalog.mjs
// Writes:
//   templates/catalog.json   machine-readable list
//   templates/catalog.js     the same as `window.CATALOG`, plus each prompt, for the showcase and stack pages
//   templates/CATALOG.md     the index an agent reads first, grouped by stack
//   THIRD_PARTY.md           credits and licenses for adapted / inspired templates
import { readdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dir = join(root, "templates");
const RULE = (f) => `https://github.com/yuzhang-ai/web-animation-skill/blob/master/rules/${f}`;

// One entry per stack page. `best` says what this stack is uniquely good at.
export const GROUPS = [
  { id: "native", name: "CSS & native APIs", rule: "native-apis.md",
    best: "Zero-KB motion: transitions, @keyframes, @property, Web Animations, View Transitions and scroll-driven timelines. Reach for these first." },
  { id: "gsap", name: "GSAP", rule: "gsap.md",
    best: "Choreography: timelines, scroll scrubbing and pinning, SplitText, Flip layout morphs, MotionPath and DrawSVG." },
  { id: "motion", name: "Motion", rule: "motion.md",
    best: "Physics: springs that keep their velocity when interrupted, gestures, drag and layout animation, in React or vanilla JS." },
  { id: "anime", name: "Anime.js v4", rule: "animejs.md",
    best: "Staggers: grid ripples from any point, per-element function values, SVG drawing, in a small modular package." },
  { id: "webgl", name: "Three.js & WebGL", rule: "three-js.md",
    best: "The GPU: 3D scenes, custom shaders, fluid and particle simulations that would melt the DOM." },
  { id: "canvas", name: "Canvas 2D", rule: "performance.md",
    best: "Thousands of strokes or particles per frame without DOM nodes: flow fields, trails, generative art." },
  { id: "d3", name: "D3", rule: "d3.md",
    best: "Data: joins and interpolated transitions that animate charts from one dataset to the next." },
  { id: "lottie", name: "Lottie", rule: "lottie.md",
    best: "Designer handoff: multi-layer After Effects animations played back as vectors, with frame-exact scrubbing and segments." },
  { id: "flubber", name: "Flubber", rule: "flubber.md",
    best: "Shape morphing between any two SVG paths, including one shape splitting into many and many merging into one." },
  { id: "two", name: "Two.js", rule: "two-js.md",
    best: "Generative vector scenes with per-vertex control, rendered to SVG, canvas or WebGL from the same code." },
  { id: "konva", name: "Konva", rule: "konva.md",
    best: "Interactive canvas apps: drag, select, rotate and resize handles, snapping and hit detection on every shape." },
  { id: "proton", name: "Proton", rule: "proton.md",
    best: "Particle systems: emitters, initializers and behaviours for sparks, fireworks, snow, smoke and trails." },
  { id: "export", name: "Export", rule: "export.md",
    best: "Turning a web animation into a GIF, MP4 or WebM: deterministic frames, encoded in the browser or with ffmpeg." },
].map((g) => ({ ...g, ruleUrl: RULE(g.rule) }));

const CATEGORIES = ["button", "hover", "text", "scroll", "transition", "loader", "background", "3d", "data", "diagram", "app"];
const REQUIRED = ["id", "title", "summary", "category", "group", "stack", "source"];

const items = readdirSync(dir, { withFileTypes: true })
  .filter((d) => d.isDirectory() && existsSync(join(dir, d.name, "meta.json")))
  .map((d) => {
    const meta = JSON.parse(readFileSync(join(dir, d.name, "meta.json"), "utf8"));
    for (const k of REQUIRED) if (!meta[k]) throw new Error(`${d.name}/meta.json: missing "${k}"`);
    if (meta.id !== d.name) throw new Error(`${d.name}/meta.json: id "${meta.id}" must match folder name`);
    for (const f of ["index.html", "prompt.md"])
      if (!existsSync(join(dir, d.name, f))) throw new Error(`${d.name}: missing ${f}`);
    if (!CATEGORIES.includes(meta.category)) throw new Error(`${d.name}: unknown category "${meta.category}"`);
    if (!GROUPS.some((g) => g.id === meta.group)) throw new Error(`${d.name}: unknown group "${meta.group}"`);
    // The copyable prompt is the first fenced block under "## Prompt"
    const md = readFileSync(join(dir, d.name, "prompt.md"), "utf8");
    const block = md.split(/^## Prompt\s*$/m)[1]?.match(/```[a-z]*\n([\s\S]*?)```/);
    if (!block) throw new Error(`${d.name}/prompt.md: no fenced block under "## Prompt"`);
    return {
      ...meta,
      path: `templates/${d.name}/`,
      promptText: block[1].trim(),
      preview: existsSync(join(dir, d.name, "preview.jpg")) ? `templates/${d.name}/preview.jpg` : null,
    };
  });

const groupIndex = (id) => GROUPS.findIndex((g) => g.id === id);
items.sort((a, b) => groupIndex(a.group) - groupIndex(b.group) || (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || a.title.localeCompare(b.title));

// Simplified Chinese copy for the website (templates/i18n.zh.json). Prompts stay in English: agents follow them more reliably.
const zh = JSON.parse(readFileSync(join(dir, "i18n.zh.json"), "utf8"));
for (const t of items) {
  const z = zh.templates[t.id];
  if (!z) throw new Error(`i18n.zh.json: missing template "${t.id}"`);
  const md = readFileSync(join(dir, t.id, "prompt.md"), "utf8").replace(/\r/g, "");
  const knobs = (md.split(/^## Knobs\s*$/m)[1] || "").split(/^## /m)[0].split("\n").filter((l) => l.startsWith("|") && !/^\|\s*-/.test(l)).length - 1;
  const pits = (md.split(/^## Pitfalls\s*$/m)[1] || "").split("\n").filter((l) => l.startsWith("- ")).length;
  if (z.knobs.length !== Math.max(0, knobs) || z.pits.length !== pits)
    throw new Error(`i18n.zh.json: "${t.id}" has ${z.knobs.length} knobs / ${z.pits.length} pitfalls, prompt.md has ${knobs} / ${pits}`);
  t.zh = z;
}
const groups = GROUPS.map((g) => {
  if (!zh.groups[g.id]) throw new Error(`i18n.zh.json: missing group "${g.id}"`);
  return { ...g, zh: zh.groups[g.id], count: items.filter((t) => t.group === g.id).length };
});
const data = { count: items.length, groups, templates: items };
writeFileSync(join(dir, "catalog.json"), JSON.stringify(data, null, 2) + "\n");
writeFileSync(join(dir, "catalog.js"), `// Generated by scripts/build-catalog.mjs\nwindow.CATALOG = ${JSON.stringify(data)};\n`);

// --- CATALOG.md -----------------------------------------------------------
let md = `# Template catalog

${items.length} runnable templates across ${groups.filter((g) => g.count).length} stacks. Each folder has:

- \`index.html\`: one self-contained page. Open it in a browser; libraries load from pinned CDN URLs.
- \`prompt.md\`: what the effect is, a copyable prompt, the knobs worth changing, and the pitfalls.
- \`meta.json\`: stack, dependencies, source and license.

**How to use:** pick the closest row (by effect first, then by the stack your project already uses), read its \`prompt.md\` and \`index.html\`, copy the code into the project, then change content, colours and timing. Keep the reduced-motion branch and the cleanup code. Don't rebuild an effect from scratch when a template is close.

Generated by \`node scripts/build-catalog.mjs\` from each \`meta.json\`; don't edit by hand.
`;
for (const g of groups) {
  const rows = items.filter((t) => t.group === g.id);
  if (!rows.length) continue;
  md += `\n## ${g.name}\n\n${g.best} Rule: [${g.rule}](../rules/${g.rule}).\n\n| Template | What it does | Built with | Good for |\n|---|---|---|---|\n`;
  for (const t of rows) md += `| [${t.title}](${t.id}/) | ${t.summary} | ${t.stack} | ${(t.useFor || []).join(", ")} |\n`;
}
writeFileSync(join(dir, "CATALOG.md"), md);

// --- THIRD_PARTY.md -------------------------------------------------------
const credited = items.filter((t) => t.source.mode !== "original");
let tp = `# Third-party credits

Templates in \`templates/\` are MIT-licensed as part of this repository unless noted below.

- **adapted**: code derived from the source. The original copyright and license apply to those parts, and the notice is kept at the top of \`index.html\`.
- **inspired**: the effect was rewritten from scratch after studying the source. No code was copied; the credit is a courtesy.

| Template | Mode | Source | Author | License |
|---|---|---|---|---|
`;
for (const t of credited)
  tp += `| [${t.title}](templates/${t.id}/) | ${t.source.mode} | [link](${t.source.url}) | ${t.source.author} | ${t.source.license} |\n`;
tp += `\nLibraries loaded from CDNs keep their own licenses (GSAP: GSAP Standard License, free including commercial use; all others listed in each template's meta.json are MIT or ISC).\n`;
writeFileSync(join(root, "THIRD_PARTY.md"), tp);

console.log(`catalog: ${items.length} templates, ${groups.filter((g) => g.count).length} stacks`);
