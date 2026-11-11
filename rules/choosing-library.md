# Choosing an animation library

## Decision matrix

| Criteria | GSAP | Motion for React | Motion (vanilla) | Anime.js | Rive | Lottie | D3.js | Flubber | Konva | Three.js | CSS |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Framework required | None | React | None | None | None | None | None | None | None (React optional) | None | None |
| Scroll-driven | ✅ Best | 🟡 Manual | ✅ | 🟡 Manual | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | 🟡 Limited |
| Enter/exit (React) | 🟡 | ✅ Best | 🟡 | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| SVG morphing | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Data viz | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ Best | ❌ | ❌ | ❌ | ❌ |
| Design-tool export | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| State machine | ❌ | 🟡 Variants | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| 3D scenes | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | 🟡 | ❌ | ❌ | ✅ | 🟡 |
| Canvas 2D | 🟡 | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |
| Bundle size (gzip) | ~27KB core | ~43KB (~5KB with LazyMotion) | ~25KB (~3KB mini) | ~11KB `animate` (~40KB all) | ~85KB | ~32KB dotLottie / ~75KB lottie-web | ~91KB full (modular) | ~18KB | ~56KB | ~181KB | 0 |
| Learning curve | Medium | Easy | Easy | Easy | Medium | Easy | Steep | Easy | Medium | Steep | Low |

## Decision flow

```
Scroll-driven?
  ├─ Yes → GSAP + ScrollTrigger
  └─ No → React project?
             ├─ Yes → Component transitions?
             │         ├─ Yes → Motion for React
             │         └─ No → Need animate presence / layout animations?
             │                   ├─ Yes → Motion for React
             │                   └─ No → Motion for React (useAnimate, or LazyMotion to cut size)
             └─ No → What are you animating?
                       ├─ SVG shapes → Anime.js / Flubber
                       ├─ Design file → Rive / Lottie
                       ├─ Data charts → D3.js
                       ├─ Canvas drawing → Konva
                       ├─ 3D scene → Three.js
                       └─ Simple UI → CSS Keyframes / Motion (vanilla)
```

## Bundle size priority

When bundle size matters, prefer in this order (min+gzip):
1. CSS Keyframes (0 KB)
2. Motion `motion/mini` (~3 KB, Web Animations API only, no sequences)
3. Anime.js `animate` only (~11 KB; ~40 KB with every module)
4. Motion hybrid `animate` (~25 KB)
5. GSAP core (~27 KB; ScrollTrigger and other plugins add to this)
6. Motion for React `motion` component (~43 KB; ~5 KB initial with `m` + `LazyMotion`)

Sizes are min+gzip from bundlephobia (whole package, or a single named export where noted) and Motion's own docs, checked 2026-11-11: gsap 3.15, motion 14.12, animejs 4.5, @lottiefiles/dotlottie-react 0.22, lottie-web 5.13, d3 7.9, flubber 0.4, konva 10.9, three 0.187, @rive-app/canvas 2.50. Tree-shaking changes the real cost, so measure your own build when it matters.
