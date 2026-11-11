# Choosing an animation library

## Decision flow

Work top to bottom and stop at the first match.

```
1. Is an animation library already in package.json?
     └─ Yes → use it, unless it truly can't do the job.

2. Can the platform do it?
     ├─ Hover / focus / press / loops ................ CSS transitions, @keyframes
     ├─ Dialog, popover, dropdown enter + exit ....... CSS @starting-style + allow-discrete
     ├─ Page/route change, shared-element morph ...... View Transitions API
     └─ Simple scroll reveal, progress, parallax ..... CSS animation-timeline: view() / scroll()

3. Is it scroll-driven with pinning, scrubbed multi-step timelines,
   horizontal scroll or split-text?
     └─ Yes → GSAP + ScrollTrigger (+ SplitText)

4. Is it a React app?
     ├─ Enter/exit, layout or shared-layout animation, gestures, drag → Motion for React
     └─ A one-off imperative sequence → Motion for React `useAnimate` (or GSAP via useGSAP)

5. What are you animating?
     ├─ SVG line drawing / simple morph ......... Anime.js v4 or GSAP (DrawSVG, MorphSVG)
     ├─ Morph between unrelated shapes .......... Flubber or GSAP MorphSVG
     ├─ Designer-made After Effects animation ... Lottie (dotLottie)
     ├─ Interactive illustrated character/UI .... Rive
     ├─ Animated charts ......................... D3 transitions
     ├─ Many interactive 2D shapes .............. Konva
     ├─ 3D, particles, shaders .................. Three.js / React Three Fiber
     └─ General UI, no framework ................ Motion (vanilla) or GSAP
```

## Capability matrix

✅ built in and a strength · 🟡 possible with extra work or a plugin · — not its job

| | CSS | View Transitions | GSAP | Motion for React | Motion (vanilla) | Anime.js v4 |
|---|---|---|---|---|---|---|
| Framework | none | none | none (`@gsap/react` for React) | React | none | none |
| Hover / micro-interactions | ✅ | — | ✅ | ✅ `whileHover` | ✅ `hover()` | ✅ |
| Enter / exit | ✅ `@starting-style` | ✅ | ✅ | ✅ `AnimatePresence` | 🟡 manual | 🟡 manual |
| Layout / shared element | — | ✅ | ✅ Flip | ✅ `layout`, `layoutId` | — | ✅ `createLayout` |
| Scroll-linked (scrub) | ✅ scroll timelines | — | ✅ ScrollTrigger | ✅ `useScroll` | ✅ `scroll()` | ✅ `onScroll` |
| Pinning, horizontal scroll | — | — | ✅ best | 🟡 manual (sticky) | 🟡 manual | 🟡 manual |
| Sequencing / timelines | 🟡 delays only | — | ✅ best | 🟡 variants, `useAnimate` | ✅ `animate([...])` | ✅ `createTimeline` |
| Split text | — | — | ✅ SplitText | — | — | ✅ `splitText` |
| SVG drawing / morph | 🟡 dashoffset | — | ✅ DrawSVG, MorphSVG | 🟡 `pathLength` | 🟡 | ✅ `svg.*` |
| Springs / physics | 🟡 `linear()` | — | 🟡 CustomEase, Inertia | ✅ | ✅ | ✅ `createSpring` |
| Drag | — | — | ✅ Draggable | ✅ `drag` | — | ✅ `createDraggable` |

| | Lottie | Rive | D3 | Flubber | Konva | Three.js |
|---|---|---|---|---|---|---|
| Framework | none (React wrapper) | none (React wrapper) | none | none | none (`react-konva` optional) | none (R3F for React) |
| Made in a design tool | ✅ After Effects | ✅ Rive editor | — | — | — | 🟡 Blender (glTF) |
| Runtime interactivity | 🟡 segments, markers | ✅ state machines, inputs | ✅ | — | ✅ events, drag | ✅ |
| Scroll-driven | 🟡 drive frame from scroll | 🟡 drive input from scroll | 🟡 | 🟡 | 🟡 | 🟡 |
| Renders to | canvas (dotLottie) / SVG (lottie-web) | canvas / WebGL | SVG or canvas | SVG path data | canvas | WebGL / WebGPU |

"Scroll-driven 🟡" means you wire scroll progress in yourself, for example from a ScrollTrigger `onUpdate`. Only CSS, GSAP, Motion and Anime.js have scroll timelines built in.

## Bundle size

Min+gzip from bundlephobia (whole package, or a single named export where noted) and Motion's own docs, checked 2026-11-11. Tree-shaking changes the real cost, so measure your own build when it matters.

| Package | Version | Size |
|---|---|---|
| CSS, View Transitions | — | 0 KB |
| `motion/mini` `animate` | 14.12 | ~3 KB (Web Animations API only, no sequences) |
| `motion/react` with `m` + `LazyMotion` | 14.12 | ~5 KB initial, + 24 KB `domAnimation` or 38 KB `domMax` |
| `animejs` `animate` only | 4.5 | ~11 KB (~40 KB with every module) |
| `flubber` | 0.4 | ~18 KB |
| `motion` hybrid `animate` | 14.12 | ~25 KB |
| `gsap` core | 3.15 | ~27 KB (plugins extra) |
| `@lottiefiles/dotlottie-react` | 0.22 | ~32 KB JS, plus a WASM renderer loaded at runtime |
| `motion/react` `motion` component | 14.12 | ~43 KB |
| `konva` | 10.9 | ~56 KB |
| `lottie-web` | 5.13 | ~75 KB |
| `@rive-app/canvas` | 2.50 | ~85 KB JS, plus a WASM runtime |
| `d3` (full bundle) | 7.9 | ~91 KB; import only the `d3-*` modules you use |
| `three` | 0.187 | ~181 KB before tree-shaking |

Lazy-load anything over ~50 KB that isn't needed for the first paint (`import()` on interaction, or when the section scrolls near the viewport).

## Learning curve

| Easy | Medium | Steep |
|---|---|---|
| CSS, Motion, Lottie, Flubber, Anime.js | GSAP (ScrollTrigger pinning), View Transitions, Rive, Konva | D3 (data joins), Three.js (3D maths, shaders) |
