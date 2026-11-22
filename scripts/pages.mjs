// Renders one documentation page per template (site/t/<id>.html), in the style of a component docs page:
// sidebar of every template by stack, then title, live preview (Preview / Code / Prompt), how to use it,
// knobs, pitfalls and source. Everything comes from templates/<id>/{meta.json,prompt.md,index.html}.
const REPO = "https://github.com/yuzhang-ai/web-animation-skill";
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
// Inline markdown: `code`, **bold**, [text](url)
const inline = (s) => esc(s)
  .replace(/`([^`]+)`/g, "<code>$1</code>")
  .replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>")
  .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, t, u) => `<a href="${u.startsWith("http") ? u : `${REPO}/blob/master/${u.replace(/^(\.\.\/)+/, "")}`}">${t}</a>`);

function parsePrompt(md) {
  const field = (name) => (md.match(new RegExp(`\\*\\*${name}:\\*\\*\\s*(.+)`)) || [])[1] || "";
  const section = (h) => { const m = md.split(new RegExp(`^## ${h}\\s*$`, "m"))[1]; return m ? m.split(/^## /m)[0].trim() : ""; };
  const knobs = section("Knobs").split("\n").filter((l) => l.startsWith("|") && !/^\|\s*-/.test(l)).slice(1)
    .map((l) => l.split("|").slice(1, -1).map((c) => c.trim()));
  const pitfalls = section("Pitfalls").split("\n").filter((l) => l.startsWith("- ")).map((l) => l.slice(2));
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  return { effect: cap(field("Effect")), use: cap(field("Use it for")), knobs, pitfalls };
}

export const UI = {
  en: { templates: "Templates", spec: "Motion spec", search: "Search templates", getStarted: "Get started", overview: "Overview", gallery: "Gallery",
    install: "Install the skill", copyPrompt: "Copy prompt", more: "More", preview: "Preview", code: "Code", prompt: "Prompt", replay: "Replay",
    openFull: "Open full screen", copy: "Copy", useIt: "Use it", withAgent: "With your coding agent",
    withAgentP: "Install the skill once, then paste the prompt. The agent reads this template and adapts it to your project.",
    byHand: "By hand", byHandP: "One self-contained HTML file. Libraries load from pinned CDN URLs:", noDeps: "No dependencies: plain HTML, CSS and JavaScript.",
    copyCode: "Copy code", goodFor: "Good for:", knobs: "Knobs", knob: "Knob", changes: "What it changes", pitfalls: "Pitfalls", source: "Source",
    original: "Written for this repository. MIT licensed.", adapted: "Adapted from", inspired: "Inspired by",
    kept: "The original notice is kept at the top of the source.", rewritten: "Rewritten from scratch; no code copied.",
    viewGh: "View on GitHub", prev: "Previous", next: "Next", onPage: "On this page", template: "template", live: "live preview",
    lPrompt: "Prompt", lCode: "Code", lInstall: "Install command", themeLabel: "Switch light / dark theme", langLabel: "切换到简体中文", langShort: "中" },
  zh: { templates: "模板", spec: "动效规范", search: "搜索模板", getStarted: "开始", overview: "首页", gallery: "模板总览",
    install: "安装 Skill", copyPrompt: "复制提示词", more: "更多", preview: "预览", code: "代码", prompt: "提示词", replay: "重播",
    openFull: "全屏打开", copy: "复制", useIt: "使用方法", withAgent: "配合 AI 编程助手",
    withAgentP: "先安装一次 Skill，再粘贴提示词。Agent 会读取这个模板，并按你的项目改编。提示词保持英文，AI 理解得更准确。",
    byHand: "手动使用", byHandP: "一个独立的 HTML 文件，依赖库从固定版本的 CDN 地址加载：", noDeps: "无依赖：纯 HTML、CSS 和 JavaScript。",
    copyCode: "复制代码", goodFor: "适合：", knobs: "可调参数", knob: "参数", changes: "作用", pitfalls: "常见的坑", source: "来源",
    original: "为本仓库编写，MIT 许可。", adapted: "改编自", inspired: "灵感来自",
    kept: "源码顶部保留了原作的版权声明。", rewritten: "从零重写，未复制任何代码。",
    viewGh: "在 GitHub 上查看", prev: "上一个", next: "下一个", onPage: "本页内容", template: "模板", live: "实时预览",
    lPrompt: "提示词", lCode: "代码", lInstall: "安装命令", themeLabel: "切换浅色 / 深色", langLabel: "Switch to English", langShort: "EN" },
};

const ICON = {
  copy: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><rect x="5" y="5" width="9" height="9" rx="2"/><path d="M11 5V3.5A1.5 1.5 0 0 0 9.5 2h-6A1.5 1.5 0 0 0 2 3.5v6A1.5 1.5 0 0 0 3.5 11H5"/></svg>',
  chev: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="m4 6 4 4 4-4"/></svg>',
  replay: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><path d="M2.5 8a5.5 5.5 0 1 0 1.7-4M2.5 2.5V5H5"/></svg>',
  open: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 3h4v4M13 3 7.5 8.5M12 9.5V13H3V4h3.5"/></svg>',
  gh: '<svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg>',
  moon: '<svg class="moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/></svg>',
  sun: '<svg class="sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
};

export const SITE = "https://yuzhang-ai.github.io/web-animation-skill/";
// Link-preview tags (X, Slack, WeChat…): crawlers don't run JS, so everything is static and absolute
function social({ title, description, url, image, imageW, imageH, imageAlt, lang }) {
  return `
<link rel="canonical" href="${url}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Web Animation Skill">
<meta property="og:locale" content="${lang === "zh" ? "zh_CN" : "en_US"}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${image}">
<meta property="og:image:width" content="${imageW}">
<meta property="og:image:height" content="${imageH}">
<meta property="og:image:alt" content="${esc(imageAlt)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${image}">
<meta name="twitter:image:alt" content="${esc(imageAlt)}">`;
}

export function head({ title, description, base = "", lang = "en", alt = null, og = null }) {
  return `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">${og ? social({ title, description, lang, ...og }) : ""}
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 32 32%22%3E%3Crect width=%2232%22 height=%2232%22 rx=%228%22 fill=%22%230b0c0e%22/%3E%3Ccircle cx=%2216%22 cy=%2216%22 r=%227%22 fill=%22%23d7ff5a%22/%3E%3C/svg%3E">
<script>(() => { const r = document.documentElement; let t, l; try { t = localStorage.getItem("theme"); l = localStorage.getItem("lang"); } catch {}
  r.dataset.theme = t || (matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
  ${alt ? `if (l && l !== "${lang}") location.replace("${alt}"); /* only follow an explicit choice: a shared link opens as sent */` : ""} })();</script>
${alt ? `<link rel="alternate" hreflang="${lang === "zh" ? "en" : "zh-CN"}" href="${alt}"><link rel="alternate" hreflang="${lang === "zh" ? "zh-CN" : "en"}" href="${alt.replace(/(\.zh)?\.html$/, "") + (lang === "zh" ? ".zh" : "") + ".html"}">` : ""}<!-- keep: the in-page language switch reads these two links -->
<meta name="theme-color" content="#0b0c0e">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${base}assets/site.css">`;
}
export function nav(base = "", current = "", lang = "en") {
  const S = UI[lang];
  return `<header class="nav"><div class="wrap">
  <a class="brand" href="${base}index.html"><span class="mark"><i></i></span>web-animation</a>
  <nav class="links">
    <a class="text" href="${base}templates.html"${current === "templates" ? ' aria-current="page"' : ""}>${S.templates}</a>
    <a class="text hide-sm" href="${REPO}/blob/master/spec/motion.md">${S.spec}</a>
    <button class="icon-btn lang-toggle" type="button" aria-label="${S.langLabel}"><span class="label">${S.langShort}</span></button>
    <button class="icon-btn theme-toggle" type="button" aria-label="${S.themeLabel}">${ICON.moon}${ICON.sun}</button>
    <a class="icon-btn" href="${REPO}" aria-label="GitHub repository">${ICON.gh}</a>
  </nav>
</div></header>`;
}

const PAGE_CSS = `
.doc { display: grid; grid-template-columns: 232px minmax(0, 1fr) 180px; gap: 48px; max-width: 1320px; margin: 0 auto; padding: 0 24px; }
.side { position: sticky; top: 60px; align-self: start; height: calc(100vh - 60px); overflow: auto; padding: 28px 4px 40px 0; scrollbar-width: thin; }
.side input { width: 100%; height: 36px; padding: 0 12px; border-radius: 10px; border: 0; background: var(--card); color: var(--ink); font: 14px var(--font); box-shadow: inset 0 0 0 1px var(--line-2); margin-bottom: 18px; }
.side input::placeholder { color: var(--dim); }
.side h4 { margin: 20px 0 6px; padding: 0 10px; font-size: 12px; font-weight: 500; color: var(--dim); }
.side a { display: flex; justify-content: space-between; gap: 8px; padding: 6px 10px; border-radius: 8px; color: var(--muted); text-decoration: none; font-size: 14px; }
.side a:hover { color: var(--ink); background: var(--line); }
.side a[aria-current="page"] { color: var(--ink); background: var(--line); font-weight: 500; }
.side a[aria-current="page"]::after { content: ""; width: 6px; height: 6px; border-radius: 50%; background: var(--accent-ink); align-self: center; }
.main { padding: 32px 0 80px; min-width: 0; }
.crumbs { display: flex; gap: 8px; color: var(--dim); font-size: 13px; }
.crumbs a { color: var(--muted); text-decoration: none; }
.crumbs a:hover { color: var(--ink); }
.title-row { display: flex; justify-content: space-between; align-items: start; gap: 20px; margin-top: 14px; }
h1 { margin: 0; font: 600 clamp(30px, 3.6vw, 42px)/1.08 var(--font); letter-spacing: -.04em; }
.lede { margin: 14px 0 0; color: var(--muted); font-size: 16px; max-width: 44em; text-wrap: pretty; }
.chips { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 16px; }
.chip { padding: 4px 10px; border-radius: 8px; background: var(--line); color: var(--muted); font-size: 12.5px; }
.split { display: inline-flex; border-radius: 10px; flex: none; }
.split .btn { border-radius: 10px 0 0 10px; }
.split .btn + .btn { border-radius: 0 10px 10px 0; padding: 0 9px; margin-left: 1px; }
.preview { margin-top: 28px; border-radius: var(--radius); background: var(--card); box-shadow: inset 0 0 0 1px var(--line); overflow: hidden; }
.preview .bar { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 8px 10px 8px 16px; border-bottom: 1px solid var(--line); }
.preview .bar .label { color: var(--dim); font-size: 12.5px; }
.tabs { display: flex; gap: 2px; padding: 3px; border-radius: 10px; background: var(--line); }
.tabs button { height: 28px; padding: 0 12px; border: 0; border-radius: 8px; background: none; color: var(--muted); font: 500 13px var(--font); cursor: pointer; }
.tabs button[aria-selected="true"] { background: var(--card-2); color: var(--ink); box-shadow: 0 1px 2px rgba(0,0,0,.15); }
.tools { display: flex; gap: 2px; }
.pane { position: relative; }
.pane[hidden] { display: none; }
.pane iframe { display: block; width: 100%; height: var(--ph, 560px); border: 0; background: #0b0c0e; }
.pane pre { margin: 0; max-height: 560px; overflow: auto; padding: 18px 20px; font: 12.5px/1.6 var(--mono); color: var(--ink); white-space: pre; tab-size: 2; }
.pane.prompt pre { white-space: pre-wrap; }
.pane .copy-in { position: absolute; top: 10px; right: 14px; }
h2 { margin: 56px 0 14px; font: 600 22px/1.2 var(--font); letter-spacing: -.025em; scroll-margin-top: 80px; }
.ways { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.way { min-width: 0; padding: 18px 18px 16px; border-radius: 16px; background: var(--card); box-shadow: inset 0 0 0 1px var(--line); }
.way h3 { margin: 0 0 4px; font-size: 15px; font-weight: 600; }
.way p { margin: 0 0 14px; color: var(--muted); font-size: 14px; }
.way ol { margin: 0 0 14px; padding-left: 18px; color: var(--muted); font-size: 14px; }
.way ol li { margin: 4px 0; }
.deps { list-style: none; margin: 0 0 14px; padding: 0; display: grid; gap: 6px; }
.deps li { min-width: 0; display: flex; justify-content: space-between; gap: 10px; font-size: 13.5px; }
.deps code { min-width: 0; color: var(--muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.way .cmd { width: 100%; margin-bottom: 12px; }
table { width: 100%; border-collapse: collapse; font-size: 14px; }
th { text-align: left; font-weight: 500; color: var(--dim); font-size: 12.5px; padding: 8px 12px 8px 0; border-bottom: 1px solid var(--line); }
td { padding: 11px 12px 11px 0; border-bottom: 1px solid var(--line); vertical-align: top; color: var(--muted); }
td:first-child { color: var(--ink); white-space: nowrap; }
code { font: 0.9em var(--mono); padding: 1px 5px; border-radius: 5px; background: var(--line); }
pre code { padding: 0; background: none; }
.pits { margin: 0; padding: 0; list-style: none; display: grid; gap: 10px; }
.pits li { padding: 12px 14px 12px 38px; border-radius: 12px; background: var(--card); box-shadow: inset 0 0 0 1px var(--line); color: var(--muted); font-size: 14px; position: relative; }
.pits li::before { content: "!"; position: absolute; left: 13px; top: 12px; width: 16px; height: 16px; border-radius: 50%; display: grid; place-items: center; font: 700 10px var(--font); color: var(--on-accent); background: var(--accent); }
.pits li b, .pits li code { color: var(--ink); }
.src { color: var(--muted); font-size: 14px; }
.src a { color: var(--ink); }
.pager { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-top: 64px; }
.pager a { padding: 14px 16px; border-radius: 14px; box-shadow: inset 0 0 0 1px var(--line); text-decoration: none; transition: box-shadow .2s; }
.pager a:hover { box-shadow: inset 0 0 0 1px var(--muted); }
.pager small { display: block; color: var(--dim); font-size: 12px; }
.pager .next { text-align: right; grid-column: 2; }
.toc { position: sticky; top: 60px; align-self: start; padding-top: 34px; font-size: 13px; }
.toc h4 { margin: 0 0 8px; font-size: 12px; font-weight: 500; color: var(--dim); }
.toc a { display: block; padding: 4px 0; color: var(--muted); text-decoration: none; }
.toc a:hover { color: var(--ink); }
@media (max-width: 1180px) { .doc { grid-template-columns: 220px minmax(0, 1fr); } .toc { display: none; } }
@media (max-width: 820px) {
  .doc { grid-template-columns: minmax(0, 1fr); gap: 0; padding: 0 16px; }
  .side { position: static; height: auto; padding: 16px 0 0; }
  .side .groups { display: none; }
  .ways { grid-template-columns: 1fr; }
  .preview .bar .label { display: none; }
  .title-row { flex-direction: column; }
  .pane iframe { height: min(var(--ph, 560px), 70vh); }
}`;

const PREVIEW_H = { "motion-curves": 760, "svg-spinners": 640, "glow-cards": 640, "jelly-button": 460, "infinite-marquee": 420, "text-scramble": 460,
  "dot-globe": 640, "gif-export": 380, "split-flap-words": 380, "motion-path-timeline": 380, "flow-field-hero": 600 };

export function templatePage(t, all, groups, src, md, lang = "en") {
  const S = UI[lang], zh = lang === "zh", sfx = zh ? ".zh" : "";
  const T = (x) => (zh && x.zh?.title) || x.title;           // template title
  const GN = (gr) => (zh && gr.zh?.name) || gr.name;          // stack name
  const en = parsePrompt(md), z = zh ? t.zh : null;
  const p = { effect: z ? z.effect : en.effect, use: z ? z.use : en.use,
    knobs: en.knobs.map(([k, e], i) => [k, z ? z.knobs[i] : e]), pitfalls: z ? z.pits : en.pitfalls };
  const useFor = z ? z.useFor : t.useFor || [];
  const g = groups.find((x) => x.id === t.group);
  const flat = groups.flatMap((gr) => all.filter((x) => x.group === gr.id));
  const i = flat.findIndex((x) => x.id === t.id), prev = flat[i - 1], next = flat[i + 1];
  const side = groups.filter((gr) => gr.count).map((gr) => `<h4>${esc(GN(gr))}</h4>` +
    all.filter((x) => x.group === gr.id).map((x) => `<a href="${x.id}${sfx}.html"${x.id === t.id ? ' aria-current="page"' : ""} data-name="${esc((x.title + " " + (x.zh?.title || "") + " " + x.stack + " " + (x.tags || []).join(" ")).toLowerCase())}">${esc(T(x))}</a>`).join("")).join("");
  const libs = t.libs?.length
    ? `<ul class="deps">${t.libs.map((l) => `<li><span>${esc(l.name)} <span style="color:var(--dim)">${esc(l.version)}</span></span><code title="${esc(l.url)}">${esc(l.url.replace("https://cdn.jsdelivr.net/npm/", "jsdelivr/"))}</code></li>`).join("")}</ul>`
    : `<p>${S.noDeps}</p>`;
  const sourceLine = t.source.mode === "original"
    ? S.original
    : `${t.source.mode === "adapted" ? S.adapted : S.inspired} <a href="${esc(t.source.url)}">${esc(t.source.author)}</a> (${esc(t.source.license)}). ${t.source.mode === "adapted" ? S.kept : S.rewritten}`;
  return `<!doctype html>
<html lang="${zh ? "zh-CN" : "en"}">
<head>
${head({ title: `${T(t)} · ${GN(g)} ${S.template} · Web Animation Skill`, description: z ? z.summary : t.summary, base: "../", lang, alt: `${t.id}${zh ? "" : ".zh"}.html`,
  og: { url: `${SITE}t/${t.id}${sfx}.html`, image: `${SITE}templates/${t.id}/preview.jpg`, imageW: 800, imageH: 500,
        imageAlt: zh ? `${T(t)}模板预览` : `${t.title} template preview` } })}
<style>${PAGE_CSS}</style>
</head>
<body data-static="true">
${nav("../", "templates", lang)}
<div class="doc">
  <aside class="side" aria-label="Templates">
    <input type="search" placeholder="${S.search}" aria-label="${S.search}" id="find">
    <h4>${S.getStarted}</h4>
    <a href="../index.html">${S.overview}</a><a href="../templates.html">${S.gallery}</a><a href="${REPO}#install">${S.install}</a><a href="${REPO}/blob/master/spec/motion.md">${S.spec}</a>
    <div class="groups">${side}</div>
  </aside>

  <main class="main">
    <nav class="crumbs" aria-label="Breadcrumb"><a href="../templates.html">${S.templates}</a><span>/</span><a href="../templates.html#${g.id}">${esc(GN(g))}</a></nav>
    <div class="title-row">
      <h1>${esc(T(t))}</h1>
      <div class="split">
        <button class="btn sm primary" type="button" data-act="prompt">${ICON.copy} ${S.copyPrompt}</button>
        <button class="btn sm primary" type="button" data-act="menu" aria-haspopup="menu" aria-expanded="false" aria-label="${S.more}">${ICON.chev}</button>
      </div>
    </div>
    <p class="lede">${inline(p.effect || t.summary)}</p>
    <div class="chips">${useFor.map((u) => `<span class="chip">${esc(u)}</span>`).join("")}</div>

    <section class="preview" id="preview" style="--ph:${PREVIEW_H[t.id] || 560}px">
      <div class="bar">
        <div class="tabs" role="tablist">
          <button role="tab" aria-selected="true" data-tab="live">${S.preview}</button>
          <button role="tab" aria-selected="false" data-tab="code">${S.code}</button>
          <button role="tab" aria-selected="false" data-tab="prompt">${S.prompt}</button>
        </div>
        <span class="label">${esc(t.stack)}</span>
        <div class="tools">
          <button class="icon-btn" type="button" data-act="replay" aria-label="${S.replay}">${ICON.replay}</button>
          <a class="icon-btn" href="../templates/${t.id}/index.html" target="_blank" rel="noopener" aria-label="${S.openFull}">${ICON.open}</a>
        </div>
      </div>
      <div class="pane live" data-pane="live"><iframe src="../templates/${t.id}/index.html?embed" data-src title="${esc(T(t))} · ${S.live}" loading="lazy"></iframe></div>
      <div class="pane code" data-pane="code" hidden><button class="btn sm copy-in" type="button" data-act="code">${ICON.copy} ${S.copy}</button><pre><code id="src">${esc(src)}</code></pre></div>
      <div class="pane prompt" data-pane="prompt" hidden><button class="btn sm copy-in" type="button" data-act="prompt">${ICON.copy} ${S.copy}</button><pre id="prompt">${esc(t.promptText)}</pre></div>
    </section>

    <h2 id="use">${S.useIt}</h2>
    <div class="ways">
      <div class="way">
        <h3>${S.withAgent}</h3>
        <p>${S.withAgentP}</p>
        <div class="cmd"><code>npx skills add <b>yuzhang-ai/web-animation-skill</b></code><button type="button" data-copy-text="npx skills add yuzhang-ai/web-animation-skill" data-copy-label="${S.lInstall}" aria-label="Copy install command">${ICON.copy}</button></div>
        <button class="btn sm" type="button" data-act="prompt">${ICON.copy} ${S.copyPrompt}</button>
      </div>
      <div class="way">
        <h3>${S.byHand}</h3>
        <p>${S.byHandP}</p>
        ${libs}
        <button class="btn sm" type="button" data-act="code">${ICON.copy} ${S.copyCode}</button>
      </div>
    </div>
    ${p.use ? `<p class="src" style="margin-top:14px"><b style="color:var(--ink);font-weight:500">${S.goodFor}</b> ${inline(p.use)}</p>` : ""}

    ${p.knobs.length ? `<h2 id="knobs">${S.knobs}</h2>
    <table><thead><tr><th>${S.knob}</th><th>${S.changes}</th></tr></thead><tbody>${p.knobs.map(([k, e]) => `<tr><td>${inline(k)}</td><td>${inline(e)}</td></tr>`).join("")}</tbody></table>` : ""}

    ${p.pitfalls.length ? `<h2 id="pitfalls">${S.pitfalls}</h2>
    <ul class="pits">${p.pitfalls.map((x) => `<li>${inline(x)}</li>`).join("")}</ul>` : ""}

    <h2 id="source">${S.source}</h2>
    <p class="src">${sourceLine} <a href="${REPO}/tree/master/templates/${t.id}">${S.viewGh}</a></p>

    <nav class="pager">${prev ? `<a href="${prev.id}${sfx}.html"><small>${S.prev}</small>${esc(T(prev))}</a>` : "<span></span>"}${next ? `<a class="next" href="${next.id}${sfx}.html"><small>${S.next}</small>${esc(T(next))}</a>` : ""}</nav>
  </main>

  <nav class="toc" aria-label="${S.onPage}"><h4>${S.onPage}</h4><a href="#preview">${S.preview}</a><a href="#use">${S.useIt}</a>${p.knobs.length ? `<a href="#knobs">${S.knobs}</a>` : ""}${p.pitfalls.length ? `<a href="#pitfalls">${S.pitfalls}</a>` : ""}<a href="#source">${S.source}</a></nav>
</div>
<div class="menu" id="menu" role="menu" hidden>
  <button role="menuitem" type="button" data-act="code">${ICON.copy} ${S.copyCode}</button>
  <a role="menuitem" href="../templates/${t.id}/index.html" target="_blank" rel="noopener">${ICON.open} ${S.openFull}</a>
  <a role="menuitem" href="${REPO}/tree/master/templates/${t.id}">${ICON.gh} ${S.viewGh}</a>
</div>
<script src="../assets/site.js"></script>
<script src="../assets/i18n.js"></script>
<script>
(() => {
  const $ = (s) => document.querySelector(s), $$ = (s) => [...document.querySelectorAll(s)];
  const frame = $(".pane.live iframe"), menu = $("#menu"), more = $('[data-act="menu"]');
  // The live preview runs in the page's theme (templates take ?theme=light)
  const base = frame.getAttribute("src");
  const themed = () => base + (document.documentElement.dataset.theme === "light" ? "&theme=light" : "");
  frame.src = themed();
  addEventListener("themechange", () => (frame.src = themed()));
  // Tabs
  $$(".tabs [data-tab]").forEach((b) => b.addEventListener("click", () => {
    $$(".tabs [data-tab]").forEach((x) => x.setAttribute("aria-selected", String(x === b)));
    $$("[data-pane]").forEach((p) => (p.hidden = p.dataset.pane !== b.dataset.tab));
  }));
  // Actions
  document.addEventListener("click", (e) => {
    const a = e.target.closest("[data-act]")?.dataset.act;
    if (a === "prompt") copyText($("#prompt").textContent, "${S.lPrompt}");
    if (a === "code") copyText($("#src").textContent, "${S.lCode}");
    if (a === "replay") frame.src = frame.src;
    if (a === "menu") {
      e.stopPropagation();
      if (!menu.hidden) { menu.hidden = true; more.setAttribute("aria-expanded", "false"); return; }
      menu.hidden = false; more.setAttribute("aria-expanded", "true");
      const r = more.getBoundingClientRect();
      menu.style.top = r.bottom + 6 + "px"; menu.style.left = Math.max(8, r.right - menu.offsetWidth) + "px";
    } else if (!menu.contains(e.target)) { menu.hidden = true; more.setAttribute("aria-expanded", "false"); }
  });
  addEventListener("keydown", (e) => { if (e.key === "Escape") menu.hidden = true; });
  addEventListener("scroll", () => (menu.hidden = true), { passive: true });
  // Sidebar search: filter the list as you type
  const find = $("#find"), groups = $(".side .groups");
  find.addEventListener("input", () => {
    const q = find.value.trim().toLowerCase();
    groups.style.display = q ? "block" : "";
    groups.querySelectorAll("a").forEach((a) => (a.hidden = q && !a.dataset.name.includes(q)));
    groups.querySelectorAll("h4").forEach((h) => { let n = h.nextElementSibling, any = false; while (n && n.tagName === "A") { any ||= !n.hidden; n = n.nextElementSibling; } h.hidden = !any; });
  });
  // Bring the current template into view inside the sidebar only (scrollIntoView would also scroll the page)
  const cur = $(".side [aria-current]"), side = $(".side");
  if (cur && getComputedStyle(side).position === "sticky") side.scrollTop = cur.offsetTop - side.clientHeight / 2;
})();
</script>
</body>
</html>
`;
}
