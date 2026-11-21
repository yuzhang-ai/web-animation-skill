# Web Animation Skill

**English** · [简体中文](README.zh-CN.md)

**Copy-ready motion for coding agents.** Agents can't watch an animation, so they guess. This skill gives them 29 working templates to start from, a motion spec to time them by, and a way to check the frames before anything ships.

[![skills.sh installs](https://www.skills.sh/b/yuzhang-ai/web-animation-skill)](https://skills.sh/yuzhang-ai/web-animation-skill)
[![Live site](https://img.shields.io/badge/live-site-d7ff5a?style=flat-square)](https://yuzhang-ai.github.io/web-animation-skill/)
[![Templates](https://img.shields.io/badge/templates-29-9a8cff?style=flat-square)](https://yuzhang-ai.github.io/web-animation-skill/templates.html)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue?style=flat-square)](#license)

```bash
npx skills add yuzhang-ai/web-animation-skill
```

Works with Claude Code, Codex, Cursor, GitHub Copilot and any agent that reads `SKILL.md`.

<p align="center">
  <a href="https://yuzhang-ai.github.io/web-animation-skill/">
    <picture>
      <source media="(prefers-color-scheme: light)" srcset="docs/media/hero-light.jpg">
      <img src="docs/media/hero.jpg" alt="The site's home page: headline and entry points on the left, a camera touring live template previews on the right" width="860">
    </picture>
  </a>
</p>
<p align="center">
  <a href="https://yuzhang-ai.github.io/web-animation-skill/"><img src="docs/media/demo.gif" alt="Tour: the home page camera moving between previews, then the live stack cards" width="720"></a>
  <br>
  <a href="https://yuzhang-ai.github.io/web-animation-skill/"><b>Open the site</b></a> · <a href="https://yuzhang-ai.github.io/web-animation-skill/templates.html">Template gallery</a> · <a href="docs/media/demo.mp4">Full tour (MP4, 32 s)</a>
</p>

## Why

- **It starts from something that works.** Before writing an effect, the agent opens [templates/CATALOG.md](templates/CATALOG.md) and adapts the closest of 29 templates: one self-contained page each, with a prompt, the knobs worth changing and the pitfalls, all checked in a real browser. Weaker models copy a good example far better than they invent one.
- **It moves things on purpose.** The [motion spec](spec/motion.md) says which curve fits which situation (entering, leaving, a hard stop, an overshoot, a spring), how long things take by distance, and how every control state moves.
- **It looks before it ships.** The agent freezes time with Playwright, screenshots fixed moments and checks them: no first-frame flash, no jumps, nothing left at `opacity: 0`, reduced motion still works.
- **It writes current APIs.** `motion/react` instead of `framer-motion`, the Anime.js v4 API, GSAP plugins that are now free, COBE 2's `update()`, three.js `setAnimationLoop`.

## Install

```bash
npx skills add yuzhang-ai/web-animation-skill
```

Or copy `SKILL.md`, `rules/`, `templates/` and `spec/` into your agent's skills folder (for example `.claude/skills/web-animation/`).

**Pairs well with** GreenSock's official [gsap-skills](https://github.com/greensock/gsap-skills): they go deep on GSAP itself, this skill decides when you need GSAP at all and how to verify the result.

## Templates

29 templates across 13 stacks. Every one opens as a live page with Preview / Code / Prompt tabs, in dark or light, in English or Chinese.

| Stack | Templates |
|---|---|
| CSS & native APIs (11) | [View transition grid](https://yuzhang-ai.github.io/web-animation-skill/t/view-transition-grid.html) · [Conic ring](https://yuzhang-ai.github.io/web-animation-skill/t/conic-ring.html) · [Drag parallax track](https://yuzhang-ai.github.io/web-animation-skill/t/drag-parallax-track.html) · [Glow cards](https://yuzhang-ai.github.io/web-animation-skill/t/glow-cards.html) · [Infinite marquee](https://yuzhang-ai.github.io/web-animation-skill/t/infinite-marquee.html) · [Jelly button](https://yuzhang-ai.github.io/web-animation-skill/t/jelly-button.html) · [Motion curves](https://yuzhang-ai.github.io/web-animation-skill/t/motion-curves.html) · [Scroll drum picker](https://yuzhang-ai.github.io/web-animation-skill/t/scroll-drum-picker.html) · [Shape morph UI](https://yuzhang-ai.github.io/web-animation-skill/t/shape-morph-ui.html) · [SVG spinners](https://yuzhang-ai.github.io/web-animation-skill/t/svg-spinners.html) · [Text scramble](https://yuzhang-ai.github.io/web-animation-skill/t/text-scramble.html) |
| GSAP (4) | [Motion path timeline](https://yuzhang-ai.github.io/web-animation-skill/t/motion-path-timeline.html) · [Split-flap words](https://yuzhang-ai.github.io/web-animation-skill/t/split-flap-words.html) · [Scroll layout flip](https://yuzhang-ai.github.io/web-animation-skill/t/scroll-layout-flip.html) · [Split text reveal](https://yuzhang-ai.github.io/web-animation-skill/t/split-text-reveal.html) |
| Motion (1) | [Spring goo trail](https://yuzhang-ai.github.io/web-animation-skill/t/spring-goo-trail.html) |
| Anime.js v4 (1) | [Stagger ripple grid](https://yuzhang-ai.github.io/web-animation-skill/t/stagger-ripple-grid.html) |
| Three.js & WebGL (4) | [Iridescent blob](https://yuzhang-ai.github.io/web-animation-skill/t/iridescent-blob.html) · [Dot globe](https://yuzhang-ai.github.io/web-animation-skill/t/dot-globe.html) · [Fluid cursor](https://yuzhang-ai.github.io/web-animation-skill/t/fluid-cursor.html) · [Ink seam transition](https://yuzhang-ai.github.io/web-animation-skill/t/seam-transition.html) |
| Canvas 2D (1) | [Flow field hero](https://yuzhang-ai.github.io/web-animation-skill/t/flow-field-hero.html) |
| D3 (1) | [Donut transition](https://yuzhang-ai.github.io/web-animation-skill/t/donut-transition.html) |
| Lottie (1) | [Lottie like button](https://yuzhang-ai.github.io/web-animation-skill/t/lottie-like-button.html) |
| Flubber (1) | [Flubber morph](https://yuzhang-ai.github.io/web-animation-skill/t/flubber-morph.html) |
| Two.js (1) | [Vertex blobs](https://yuzhang-ai.github.io/web-animation-skill/t/vertex-blobs.html) |
| Konva (1) | [Canvas editor](https://yuzhang-ai.github.io/web-animation-skill/t/canvas-editor.html) |
| Proton (1) | [Particle fireworks](https://yuzhang-ai.github.io/web-animation-skill/t/particle-fireworks.html) |
| Export (1) | [GIF export](https://yuzhang-ai.github.io/web-animation-skill/t/gif-export.html) |

Browse them in the [gallery](https://yuzhang-ai.github.io/web-animation-skill/templates.html). Adapted and inspired sources are credited in [THIRD_PARTY.md](THIRD_PARTY.md).

## How it works

`SKILL.md` is the entry point. The agent looks for a close template first and follows the motion spec for timing. When nothing fits, it builds the effect with the workflow below and the one rule file it needs.

```
Brief    → one-line motion spec per element (+ its reduced-motion version)
Build    → closest template, else the lightest tool: CSS / native first, then a library
Animate  → transform & opacity, shared duration/easing tokens, interruptible
Refine   → capture frames at key timestamps and look at them; check perf
Render   → lazy-load, pause off-screen, export GIF/MP4 when asked
```

## Rules

| Area | Rule | Covers |
|---|---|---|
| **Process** | [workflow](rules/workflow.md) | Motion spec, tokens, timing rules of thumb, frame-by-frame verification with Playwright |
| | [art-direction](rules/art-direction.md) | Mood, palette, and type; one signature effect; rhythm and density; reactive polish recipes |
| | [choosing-library](rules/choosing-library.md) | Decision flow and matrix across native APIs and 11 libraries, plus pinned CDN URLs for no-build pages |
| | [accessibility](rules/accessibility.md) | `prefers-reduced-motion` per library, pause controls, WCAG 2.2.2 / 2.3.1 |
| | [performance](rules/performance.md) | Compositor-only properties, layout thrash, pausing off-screen loops |
| | [export](rules/export.md) | Deterministic capture → ffmpeg, MediaRecorder, gifenc |
| **Native** | [native-apis](rules/native-apis.md) | WAAPI, View Transitions, scroll-driven animations, `@starting-style`, `linear()` springs |
| | [css-keyframes](rules/css-keyframes.md) | `@keyframes`, staggering with custom properties |
| | [scroll-animations](rules/scroll-animations.md) | Scroll patterns across CSS, Motion, GSAP, Anime.js |
| **DOM / SVG** | [motion](rules/motion.md) | Motion (formerly Framer Motion + Motion One): React and vanilla |
| | [gsap](rules/gsap.md) | Timelines, ScrollTrigger, `useGSAP`, SplitText, MorphSVG, Flip (all free) |
| | [animejs](rules/animejs.md) | Anime.js **v4** API: stagger grids, `svg` module, `onScroll`, `createScope` |
| | [flubber](rules/flubber.md) | Standalone path morphing |
| | [d3](rules/d3.md) | Data joins and transition chaining |
| **Asset playback** | [lottie](rules/lottie.md) | lottie-web, dotLottie, `.lottie` format |
| | [rive](rules/rive.md) | State machines and inputs |
| **Canvas / WebGL** | [konva](rules/konva.md) | Interactive canvas: layers, drag, Transformer |
| | [two-js](rules/two-js.md) | Generative 2D vector scenes (SVG ⇄ canvas ⇄ WebGL) |
| | [proton](rules/proton.md) | Particle emitters, initializers, behaviours |
| | [three-js](rules/three-js.md) | Scenes, R3F, WebGPU, tweening 3D objects |

## Site and tooling

The site is [docs/](docs/) (home, gallery) plus [templates/](templates/) plus one generated page per template and language. Every push to `master` that touches them redeploys it through [.github/workflows/pages.yml](.github/workflows/pages.yml).

| Command | What it does |
|---|---|
| `node scripts/build-catalog.mjs` | Rebuilds `templates/catalog.json`, `CATALOG.md` and `THIRD_PARTY.md` from each `meta.json` |
| `node scripts/build-site.mjs` | Assembles `_site/`, exactly what Pages deploys |
| `node scripts/check-templates.mjs` | Opens every template in Chromium: console errors, mobile overflow, reduced motion |
| `node scripts/check-site.mjs` | Whole-page pass of the site in both languages and themes |
| `node scripts/record-previews.mjs` | Records each template's preview video in both themes |
| `node scripts/record-readme.mjs` | Re-shoots the images and tour on this page |

The checks need Playwright (`npm i -D playwright`) and the recorders need ffmpeg.

**Adding a template:** create `templates/<id>/` with `index.html`, `prompt.md` (Effect, Use it for, a fenced Prompt, Knobs, Pitfalls) and `meta.json`, add its Chinese copy to `templates/i18n.zh.json`, then run the catalog, check and record scripts.

## Scope

This skill is for **real-time browser animation**. For rendering videos as the final product, use [Remotion](https://github.com/remotion-dev/skills) or [Motion Canvas](https://github.com/motion-canvas/motion-canvas).

## License

MIT

---

If this saved your agent from one janky animation, a ⭐ helps other people find it.
