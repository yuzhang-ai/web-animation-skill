---
name: web-animation
description: Build real-time web animations and motion design from a library of runnable effect templates (glow cards, text reveals, scroll layout morphs, fluid cursor, WebGL globe, ink transitions, spinners, springs) and a motion spec (easing by situation, durations, spring presets, control states) — UI micro-interactions, enter/exit and page transitions, scroll-driven effects, SVG morphing, canvas/vector scenes, particles, 3D, and GIF/MP4 export of web animations. Covers native CSS/WAAPI/View Transitions plus GSAP, Motion (Framer Motion), Anime.js v4, Lottie, Rive, D3, Flubber, Konva, Two.js, Proton, and Three.js, with a brief→build→animate→refine→render workflow, motion tokens, art direction for showcase-grade pages, accessibility, and frame-by-frame verification.
metadata:
  tags: animation, motion-design, web, css, waapi, view-transitions, gsap, motion, framer-motion, animejs, lottie, rive, d3, flubber, konva, two-js, proton, three-js, particles, gif, accessibility
---

## When to use

Use this skill for any **real-time animation in the browser**: hover and press feedback, enter/exit, page and route transitions, scroll reveals and scroll storytelling, SVG drawing and morphing, data-viz transitions, canvas and vector scenes, particles, 3D, and exporting any of these as GIF/MP4/WebM.

This skill is **not** for rendering a video as the final product (explainers, promos). For that, use [Remotion](https://github.com/remotion-dev/skills) or [Motion Canvas](https://github.com/motion-canvas/motion-canvas).

## Start from a template

Effects built from a working example come out far better than effects invented from scratch. Before writing an effect:

1. Read [templates/CATALOG.md](templates/CATALOG.md) and pick the closest template. It lists each one's effect, stack and use.
2. Read that template's `prompt.md` (what it does, knobs, pitfalls), then its `index.html`. Each is one self-contained page that runs from pinned CDN URLs and has been checked in Chromium (no console errors, no sideways scroll at 390px, a working reduced-motion path).
3. Copy the code into the project and adapt it: content, colours, timing, framework. Keep the reduced-motion branch and the cleanup.
4. For timing and easing decisions (enter vs. leave, hard stop vs. overshoot, which spring, how each control state moves), follow [spec/motion.md](spec/motion.md).

No template close enough? Build it with the workflow below, using the rule for the chosen library.

## Workflow (always)

You can't watch the animation, so follow the loop in [rules/workflow.md](rules/workflow.md):

1. **Brief**: write a one-line spec for each moving element (trigger, property, from→to, duration, easing, stagger), plus its reduced-motion version. For a showcase, landing page, or hero that should impress, also set the mood, palette, type, and one signature effect first: see [rules/art-direction.md](rules/art-direction.md).
2. **Build**: pick the lightest tool (table below). Put durations and easings in motion tokens.
3. **Animate**: use `transform`/`opacity`, ease-out to enter and ease-in to leave, ≤ 200ms for UI feedback, and make it interruptible.
4. **Refine**: capture frames at key timestamps (Playwright `page.clock` or `document.getAnimations()`) and look at them. For pages longer than one screen, also do the whole-page scroll pass (covered headers, dead screens, clipping, blank canvases). Check the reduced-motion path and the cost in DevTools Performance.
5. **Render**: lazy-load heavy libraries and pause loops when off-screen. Export GIF/MP4 when asked ([rules/export.md](rules/export.md)).

## Quick picker

| Need | Use | Rule |
|------|-----|------|
| Hover/press, spinners, simple enter | CSS transitions / `@keyframes` | [css-keyframes](rules/css-keyframes.md) |
| Page/state transition, shared-element morph | View Transitions API | [native-apis](rules/native-apis.md) |
| Scroll reveal / progress (no pinning) | CSS `animation-timeline` | [native-apis](rules/native-apis.md) |
| Enter from `display:none`, dialogs, popovers | `@starting-style` | [native-apis](rules/native-apis.md) |
| React enter/exit, layout, gestures, drag | Motion (`motion/react`) | [motion](rules/motion.md) |
| Lightweight vanilla tweens + springs | Motion (`motion`) or WAAPI | [motion](rules/motion.md) |
| Scroll pinning, scrubbed timelines | GSAP + ScrollTrigger | [gsap](rules/gsap.md), [scroll](rules/scroll-animations.md) |
| Complex timelines, SplitText, Flip, SVG morph/draw | GSAP (all plugins free) | [gsap](rules/gsap.md) |
| SVG drawing/morph, stagger grids, modular | Anime.js v4 | [animejs](rules/animejs.md) |
| After Effects export | Lottie | [lottie](rules/lottie.md) |
| Interactive designer-made animation, state machines | Rive | [rive](rules/rive.md) |
| Data-driven transitions | D3 | [d3](rules/d3.md) |
| Standalone path morphing | Flubber | [flubber](rules/flubber.md) |
| Interactive canvas editor (drag, select, transform) | Konva | [konva](rules/konva.md) |
| Generative 2D vector scene (SVG/canvas/WebGL) | Two.js | [two-js](rules/two-js.md) |
| Particles: sparks, confetti, snow, smoke | Proton | [proton](rules/proton.md) |
| 3D scenes | Three.js / R3F | [three-js](rules/three-js.md) |
| GIF / MP4 / WebM of a web animation | Playwright + ffmpeg, MediaRecorder, gifenc | [export](rules/export.md) |
| "Make it impressive": hero, showcase, landing page | Art direction + one signature effect | [art-direction](rules/art-direction.md) |
| Single-file page, no bundler (libraries from a CDN) | Pinned jsDelivr URLs | [choosing-library](rules/choosing-library.md#loading-from-a-cdn-no-build-step) |

Not sure? Use [rules/choosing-library.md](rules/choosing-library.md). If the project already has an animation library that can do the job, use that one.

## Non-negotiables

1. **Animate `transform` and `opacity`.** Never animate `width`, `height`, `top`, `left`, or `margin`, because they trigger layout on every frame. See [performance](rules/performance.md).
2. **Respect `prefers-reduced-motion`.** Design the reduced version on purpose (a fade instead of a slide, a still frame instead of a loop). Anything that loops longer than 5s needs a pause control. See [accessibility](rules/accessibility.md).
3. **Never hide content behind an animation.** If JS fails or motion is reduced, the final state must still render. Don't leave elements stuck at `opacity: 0`.
4. **Clean up.** Revert or kill animations on unmount (`useGSAP`, `createScope().revert()`, `controls.stop()`, `setAnimationLoop(null)`), and pause rAF loops when off-screen or the tab is hidden.
5. **Use current APIs.** These changed recently and old snippets will break:
   - `framer-motion` → `motion` (`import { motion } from "motion/react"`). Motion One was merged in, and `timeline()` was replaced by `animate([...])`.
   - Anime.js v4: `import { animate, stagger, createTimeline } from "animejs"`. There's no `anime({ targets })`, `easing` is now `ease`, and `"easeOutQuad"` is now `"outQuad"`.
   - GSAP: every plugin (SplitText, MorphSVG, DrawSVG, Flip, …) is free and in the `gsap` package. In React use `useGSAP` from `@gsap/react`.
   - Lottie in React: use `@lottiefiles/dotlottie-react` (`react-lottie-player` is unmaintained).
   - Three.js: use `renderer.setAnimationLoop(fn)`. `three/webgpu` is available for WebGPU.

## Motion tokens (default rhythm)

```css
:root {
  --dur-instant: 100ms; --dur-fast: 180ms; --dur-base: 280ms; --dur-slow: 480ms;
  --dur-story: 900ms;                            /* hero / storytelling only */
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);     /* entering */
  --ease-in: cubic-bezier(0.7, 0, 0.84, 0);      /* leaving */
  --ease-inout: cubic-bezier(0.65, 0, 0.35, 1);  /* moving on screen */
}
```

Make exits about 70% as long as entrances. Stagger 30–60ms per item, capped at ~400ms total. Reveals travel 8–24px.

## Minimal starters

```css
/* CSS — enter + reduced motion */
.card { animation: fade-up var(--dur-slow) var(--ease-out) both; }
@keyframes fade-up { from { opacity: 0; translate: 0 16px; } }
@media (prefers-reduced-motion: reduce) { .card { animation-name: fade-in; animation-duration: 160ms; } }
@keyframes fade-in { from { opacity: 0; } }
```

```js
// Native — View Transition with fallback
document.startViewTransition ? document.startViewTransition(update) : update();
```

```tsx
// Motion (React)
import { motion, AnimatePresence } from "motion/react";
<AnimatePresence>{open && <motion.div key="m" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} />}</AnimatePresence>
```

```js
// GSAP
import gsap from "gsap";
gsap.from(".card", { y: 16, autoAlpha: 0, duration: 0.48, ease: "power3.out", stagger: 0.04 });
```

```js
// Anime.js v4
import { animate, stagger } from "animejs";
animate(".dot", { scale: [0, 1], delay: stagger(40, { grid: [8, 8], from: "center" }), ease: "outBack" });
```

## All rules

- **Templates & spec:** [templates/CATALOG.md](templates/CATALOG.md) (runnable effects) · [spec/motion.md](spec/motion.md) (curves, durations, springs, control states)
- **Process:** [workflow](rules/workflow.md) · [art-direction](rules/art-direction.md) · [choosing-library](rules/choosing-library.md) (incl. CDN loading) · [accessibility](rules/accessibility.md) · [performance](rules/performance.md) · [export](rules/export.md)
- **Native:** [native-apis](rules/native-apis.md) (WAAPI, View Transitions, scroll-driven, `@property`, `@starting-style`, `linear()`) · [css-keyframes](rules/css-keyframes.md) · [scroll-animations](rules/scroll-animations.md)
- **DOM / SVG libraries:** [motion](rules/motion.md) · [gsap](rules/gsap.md) · [animejs](rules/animejs.md) · [flubber](rules/flubber.md) · [d3](rules/d3.md)
- **Asset playback:** [lottie](rules/lottie.md) · [rive](rules/rive.md)
- **Canvas / WebGL:** [konva](rules/konva.md) · [two-js](rules/two-js.md) · [proton](rules/proton.md) · [three-js](rules/three-js.md)
