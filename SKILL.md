---
name: web-animation
description: Design and build interactive web animation that feels crafted, not templated. Use when the user asks for motion on a website or web app - page-load or hero sequences, scroll-driven or scroll-triggered effects, parallax, pinned or horizontal scroll sections, smooth scroll, text reveals and split-text, hover and press micro-interactions, page or route transitions (View Transitions API), modal/popover/dropdown enter-exit, layout and shared-element animation, SVG line drawing and morphing, animated charts, Lottie or Rive playback, canvas or WebGL/Three.js scenes, or "make it feel smoother / more premium / award-winning". Covers GSAP (ScrollTrigger, SplitText, Flip), Motion (formerly Framer Motion and Motion One), Anime.js v4, CSS transitions/@keyframes/@starting-style/scroll-driven animations, View Transitions, Lottie, Rive, D3, Flubber, Konva and Three.js/React Three Fiber. Not for video rendering (use Remotion).
metadata:
  tags: animation, motion design, web, gsap, scrolltrigger, splittext, motion, framer-motion, animejs, view-transitions, scroll-driven, css, lottie, rive, d3, three-js, canvas
  verified: 2026-11-11 against gsap 3.15, motion 14.12, animejs 4.5, MDN browser-compat-data
---

# Web animation

Good web motion is a design decision first and a library call second. Follow the workflow below in order; load rule files only when a step needs them.

## Workflow

### 1. Read the project before choosing anything

- Check `package.json`. **If an animation library is already installed, use it.** Don't add a second one for a single effect.
- Note the framework (React / Next.js App Router / Vue / Svelte / plain HTML) and whether components render on the server (`"use client"` needed for client-side motion in Next.js).
- Check for existing motion tokens (durations, easings) in CSS variables or a theme file, and reuse them.

### 2. Decide what the motion is for

Every animation needs a job. Pick one per element:

| Job | Example | Typical budget |
|---|---|---|
| **Feedback** — confirm an action | button press, toggle, copy-to-clipboard | 100–200ms |
| **Orientation** — show where something came from or went | modal opens from its trigger, list item reorders, route change | 200–400ms |
| **Attention** — point at one thing | a single hero sequence, a new notification | 400–1200ms, once |
| **Narrative** — tell a story tied to scroll | pinned product walkthrough, scrubbed timeline | tied to scroll distance |

If an element has no job, don't animate it. One orchestrated moment beats a fade-up on every section. Read [rules/motion-design.md](rules/motion-design.md) for durations, easing, choreography and the "premium feel" checklist.

### 3. Pick the lightest tool that does the job

Platform first, then libraries:

| Need | Reach for | Rule file |
|---|---|---|
| Hover, focus, press, simple loops | CSS transitions / `@keyframes` | [css-keyframes.md](rules/css-keyframes.md) |
| Dialog, popover, dropdown enter **and exit** | CSS `@starting-style` + `transition-behavior: allow-discrete` | [css-keyframes.md](rules/css-keyframes.md) |
| Page / route transitions, shared-element morph between states | View Transitions API | [view-transitions.md](rules/view-transitions.md) |
| Simple scroll-linked reveal, progress bar, parallax | CSS `animation-timeline: view()` / `scroll()` | [scroll-animations.md](rules/scroll-animations.md) |
| Pinned sections, scrubbed multi-step timelines, horizontal scroll | GSAP + ScrollTrigger | [gsap.md](rules/gsap.md) |
| Split-text / line-mask headline reveals | GSAP SplitText | [gsap.md](rules/gsap.md) |
| React enter/exit, layout and shared-layout animation, gestures | Motion for React (`motion/react`) | [framer-motion.md](rules/framer-motion.md) |
| Framework-free imperative animation, springs | Motion (`motion`) | [motion-one.md](rules/motion-one.md) |
| SVG line drawing and morphing without GSAP | Anime.js v4 (`svg.createDrawable`, `svg.morphTo`) | [animejs.md](rules/animejs.md) |
| Complex path morphing between unrelated shapes | Flubber (or GSAP MorphSVG) | [flubber.md](rules/flubber.md) |
| After Effects animation playback | Lottie (dotLottie) | [lottie.md](rules/lottie.md) |
| Interactive, state-driven illustrated animation | Rive | [rive.md](rules/rive.md) |
| Animated charts | D3 transitions | [d3.md](rules/d3.md) |
| Many interactive 2D shapes (editors, diagrams) | Konva | [konva.md](rules/konva.md) |
| 3D, particles, shaders | Three.js / React Three Fiber | [three-js.md](rules/three-js.md) |

When the choice isn't obvious, read [rules/choosing-library.md](rules/choosing-library.md).

### 4. Build it with the non-negotiables

These apply to every animation, in every library:

1. **Animate `transform` and `opacity`.** Avoid animating `width`, `height`, `top`, `left`, `margin`; use `scale`/`translate`, FLIP (GSAP Flip, Motion `layout`) or View Transitions for layout changes. See [rules/performance.md](rules/performance.md).
2. **Respect `prefers-reduced-motion`.** Replace movement with an opacity fade or an instant change; never just delete the content's entrance so it stays invisible. Scroll-scrubbed effects should become static.
3. **Never hide content until JS runs.** Set the initial hidden state in JS (or behind a `.js` class), so content is visible if the script fails. With SSR, avoid a flash of visible-then-hidden content by applying initial styles before first paint.
4. **Clean up.** Revert or kill animations on unmount (`useGSAP`, `createScope().revert()`, `gsap.context`), and kill ScrollTriggers on route change.
5. **Keep interaction responsive.** Interruptible animations for anything user-triggered: a second click must not queue behind the first. Never block input waiting for an animation to finish.
6. **Don't animate focus away.** Elements that move must keep a visible `:focus-visible` state, and animated dialogs must still move focus correctly.

### 5. Verify in a real browser

Don't report an animation as done from reading the code. Run it and check:

- [ ] It plays, and the end state matches the design (screenshot mid-animation and at rest).
- [ ] No console errors, no layout shift when it starts.
- [ ] Emulate `prefers-reduced-motion: reduce` and confirm the reduced version works and content is visible.
- [ ] Resize to a mobile width: pinned sections and split text still work (re-split on resize).
- [ ] Scroll-driven effects work when scrolling up as well as down, and after a reload mid-page.
- [ ] Performance panel: no long frames during the animation, no layout/paint spikes from animated properties.

## Minimal starting points

```js
// GSAP + ScrollTrigger (npm i gsap)
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

gsap.from(".card", {
  y: 40, opacity: 0, duration: 0.8, ease: "expo.out", stagger: 0.08,
  scrollTrigger: { trigger: ".cards", start: "top 80%" },
});
```

```tsx
// Motion for React (npm i motion)
import { motion, AnimatePresence } from "motion/react";

<AnimatePresence>
  {open && (
    <motion.div
      key="panel"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ type: "spring", duration: 0.35, bounce: 0 }}
    />
  )}
</AnimatePresence>
```

```css
/* Platform-only scroll reveal: Chrome 115+, Safari 26+, Firefox 159+ */
@media (prefers-reduced-motion: no-preference) {
  @supports (animation-timeline: view()) {
    .reveal {
      animation: reveal linear both;
      animation-timeline: view();
      animation-range: entry 10% cover 30%;
    }
  }
}
@keyframes reveal { from { opacity: 0; translate: 0 2rem; } }
```

## Rule files

- [rules/motion-design.md](rules/motion-design.md) — durations, easing, choreography, what makes motion feel premium
- [rules/choosing-library.md](rules/choosing-library.md) — decision flow, capability matrix, measured bundle sizes
- [rules/performance.md](rules/performance.md) — compositor-only properties, profiling, `will-change`, reduced motion
- [rules/scroll-animations.md](rules/scroll-animations.md) — CSS scroll timelines, ScrollTrigger patterns, smooth scroll
- [rules/view-transitions.md](rules/view-transitions.md) — same-document and cross-document page transitions
- [rules/css-keyframes.md](rules/css-keyframes.md) — transitions, `@keyframes`, `@starting-style`, `linear()` easing
- [rules/gsap.md](rules/gsap.md) — timelines, ScrollTrigger, SplitText, Flip, `useGSAP`
- [rules/framer-motion.md](rules/framer-motion.md) — Motion for React: variants, `AnimatePresence`, layout, gestures
- [rules/motion-one.md](rules/motion-one.md) — Motion vanilla JS: `animate`, sequences, `scroll`, `inView`
- [rules/animejs.md](rules/animejs.md) — Anime.js v4: timelines, stagger, SVG drawing and morphing
- [rules/lottie.md](rules/lottie.md) — dotLottie player, controls, events
- [rules/rive.md](rules/rive.md) — state machines and inputs
- [rules/d3.md](rules/d3.md) — data-join transitions
- [rules/flubber.md](rules/flubber.md) — path morphing
- [rules/konva.md](rules/konva.md) — canvas 2D shapes and tweens
- [rules/three-js.md](rules/three-js.md) — scenes, R3F, performance

Working examples of these techniques live in [`demos/`](demos/).
