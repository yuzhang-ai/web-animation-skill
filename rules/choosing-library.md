# Choosing an animation tool

Start from the top and stop at the first tool that covers the need. Every library you add costs bundle size, cleanup code, and one more API to keep in sync.

## Decision flow

```
Is the deliverable a video file (explainer, promo)?
  └─ Yes → Not this skill: Remotion / Motion Canvas (see export.md for GIF/MP4 of web pages)

Can CSS / native APIs do it?  → native-apis.md, css-keyframes.md
  hover/press states, simple enter, spinners .............. CSS transitions / @keyframes
  enter from display:none, dialogs, popovers .............. @starting-style
  page/state change, shared-element morph ................. View Transitions API
  scroll reveal / progress (no pinning) ................... animation-timeline: view() / scroll()
  imperative one-off tween with a promise ................. el.animate() (WAAPI)

React project?
  enter/exit, layout, shared element, gestures, drag ...... Motion (motion/react)

Scroll choreography: pinning, scrubbed timelines, horizontal sections?
  └─ GSAP + ScrollTrigger

Complex timelines, text splitting, SVG morph/draw, FLIP?
  ├─ GSAP (all plugins free) ...... biggest ecosystem
  └─ Anime.js v4 .................. lighter, modular, great SVG + stagger grids

Small vanilla tweens + springs, no framework? ............ Motion (vanilla) / motion/mini

Designer hands you a file?
  After Effects → Lottie (.lottie / .json)   Rive editor → Rive (.riv, state machines)

Data changes → D3 transitions
SVG path → path morph, standalone .......................... Flubber

Drawing on a canvas?
  interactive editor-like (drag, select, transform) ....... Konva
  generative 2D vector scenes (SVG ⇄ canvas ⇄ WebGL) ...... Two.js
  particles: sparks, confetti, snow, smoke ................ Proton
  3D .......................................................... Three.js (+ three/webgpu)
```

## Decision matrix

| | Native/CSS | Motion | GSAP | Anime.js v4 | Lottie | Rive | D3 | Flubber | Konva | Two.js | Proton | Three.js |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Framework | none | React or vanilla | none | none | none | none | none | none | React or vanilla | none | none | none (R3F for React) |
| Scroll-driven | ✅ `view()` | ✅ `scroll` | ✅ best (pin, scrub) | ✅ `onScroll` | 🟡 manual | 🟡 manual | ❌ | ❌ | ❌ | ❌ | ❌ | 🟡 manual |
| Enter/exit (React) | 🟡 | ✅ best | 🟡 | 🟡 | — | — | — | — | — | — | — | — |
| Layout / shared element | ✅ View Transitions | ✅ `layout`, `layoutId` | ✅ Flip | ❌ | — | — | — | — | — | — | — | — |
| Springs w/ velocity | 🟡 `linear()` | ✅ best | 🟡 | ✅ `createSpring` | — | ✅ | ❌ | — | 🟡 | ❌ | — | 🟡 |
| SVG morph / draw | ❌ | ❌ | ✅ MorphSVG, DrawSVG | ✅ `svg` module | ✅ | ✅ | 🟡 | ✅ morph | — | ✅ | — | — |
| Text splitting | ❌ | ❌ | ✅ SplitText | 🟡 | — | — | — | — | — | — | — | — |
| Design-tool export | — | — | — | — | ✅ AE | ✅ Rive | — | — | — | — | — | ✅ glTF |
| State machine | ❌ | 🟡 variants | ❌ | ❌ | ❌ | ✅ | — | — | — | — | — | — |
| Canvas / WebGL | — | — | 🟡 tween any object | 🟡 tween any object | ✅ canvas | ✅ | 🟡 | — | ✅ 2D | ✅ 2D | ✅ 2D | ✅ 3D |
| Particles | ❌ | ❌ | ❌ | ❌ | — | — | — | — | 🟡 | 🟡 | ✅ best | ✅ points |
| Learning curve | Low | Easy | Medium | Easy | Easy | Medium | Steep | Easy | Medium | Easy | Easy | Steep |

✅ built in · 🟡 possible with work · ❌ no · — not applicable.

## Tie-breakers

- **Already in the project?** Use it. Two animation libraries doing the same job is worse than either one.
- **React + GSAP?** Fine: use `useGSAP`. Pick Motion if you mostly need enter/exit and layout. Pick GSAP if you mostly need scroll choreography.
- **GSAP vs Anime.js:** both are free and full-featured. GSAP has ScrollTrigger pinning, the bigger community, and more plugins. Anime.js is smaller, ES-module-first, and has a nicer stagger-grid API.
- **Lottie vs Rive:** Lottie plays back an AE timeline. Rive is interactive (state machines, inputs) and edited in Rive. If the animation must react to the user, use Rive.
- **Konva vs Two.js:** Konva is for apps where users manipulate shapes. Two.js is for scenes you program.
- **Heavy libraries** (Three.js, Lottie, Rive, D3): lazy-load them with dynamic `import()` so they don't block first paint.

## Loading from a CDN (no build step)

Demos, prototypes, and single-file pages often load libraries straight from jsDelivr. Always pin an exact version. These URLs were checked working together on one page in November 2026; check npm for newer versions, but don't guess a version number from memory.

| Library | Load it as | URL (jsDelivr) | Gotcha |
|---|---|---|---|
| GSAP + plugins | classic `<script>`s, core first | `gsap@3.15.1/dist/gsap.min.js`, then `dist/ScrollTrigger.min.js`, `dist/SplitText.min.js`, … | Call `gsap.registerPlugin(...)` once. ESM: `gsap@3.15.1/index.js` + `gsap@3.15.1/ScrollTrigger.js` |
| Motion (vanilla) | ESM | `motion@14.9.0/+esm` | Named exports: `animate`, `spring`, `stagger`, `inView`, `hover`, `press` |
| Anime.js v4 | ESM | `animejs@4.5.0/+esm` | Named exports only, no default (`import { animate } ...`) |
| Three.js | ESM via import map | `three@0.187.0/build/three.module.js`, addons at `three@0.187.0/examples/jsm/` | Map `"three"` and `"three/addons/"` in `<script type="importmap">` before any module script |
| D3 | `<script>` or ESM | `d3@7.9.2/dist/d3.min.js` or `d3@7.9.2/+esm` | |
| Flubber | `<script>` or ESM | `flubber@0.4.2/build/flubber.min.js` or `flubber@0.4.2/+esm` | Global is `flubber` |
| Konva | `<script>` or ESM | `konva@10.9.1/konva.min.js` or `konva@10.9.1/+esm` | |
| Two.js | `<script>` or ESM | `two.js@0.8.24/build/two.min.js` or `build/two.module.js` | |
| Proton | `<script>` | `proton-engine@7.1.5/build/proton.min.js` | Class is `Proton.default`, see [proton.md](proton.md) |
| Lottie | classic `<script>` only | `lottie-web@5.13.0/build/player/lottie_light.min.js` | UMD only; `lottie_light` is SVG-only and has no expressions |
| gifenc | ESM | `gifenc@1.0.3/dist/gifenc.esm.js` | |

- Prefix each path with `https://cdn.jsdelivr.net/npm/`.
- `+esm` is jsDelivr's auto-converted ES module. For CommonJS packages it can nest the real export one level down (`mod.default.default`). If `new X()` says "not a constructor", log the module object and look.
- Load only what is above the fold up front. Pull in the rest with dynamic `import()` (or by injecting a `<script>`) when its section comes within about one screen of the viewport.
- In a real project with a bundler, install from npm instead and use the imports shown in each rule.

## Bundle size priority

When bytes matter, prefer this order. Measure your own build: sizes depend heavily on which modules you import.
1. CSS / native APIs (0 KB)
2. `motion/mini` (a few KB, WAAPI only)
3. Anime.js v4 (import only the modules you use)
4. Motion vanilla `animate`
5. GSAP core + only the plugins you use
6. Motion for React (shrink the initial load with `LazyMotion`)
