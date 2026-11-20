# Accessible motion

Motion can trigger nausea, dizziness, and migraines for people with vestibular disorders. It also distracts people with attention or cognitive disabilities. Accessibility is part of every animation you write, not something to add at the end.

## The rules

1. **Respect `prefers-reduced-motion`.** Replace motion with a fade or an instant change. Don't just remove it: state changes must stay visible.
2. **Anything that loops or auto-plays for more than 5 seconds needs a pause control** (WCAG 2.2.2).
3. **Never flash more than 3 times per second** (WCAG 2.3.1).
4. **Large-scale movement is the main trigger.** Parallax, zoom, full-screen slides, and scroll-jacking are the problem. A small hover lift is fine.
5. **Never hide content behind an animation.** If JS fails or reduced motion is on, the final state must still render.
6. **Keep focus where it belongs.** Animated modals and drawers must move focus in, trap it, and return it on close.

## What to reduce vs. keep

| Animation | Under reduced motion |
|---|---|
| Parallax, scroll-scrubbed transforms, zoom | **Remove** (static layout) |
| Slide / fly-in reveals | Opacity fade only, ≤ 200ms |
| Page / route transitions | Crossfade, or none |
| Auto-playing loops, background video | Paused on first frame, with a play button |
| Spinners, progress bars | **Keep** (they convey state); slow them down if large |
| Hover / press feedback (color, small scale) | Keep |

## CSS

Design the reduced-motion version on purpose instead of disabling everything globally:

```css
.card {
  /* No `opacity: 0` here — `both` fill-mode handles the start state,
     and if the animation never runs the card is still visible. */
  animation: fade-up var(--dur-slow) var(--ease-out) both;
}
@keyframes fade-up { from { opacity: 0; translate: 0 24px; } to { opacity: 1; translate: 0 0; } }
@keyframes fade    { from { opacity: 0; } to { opacity: 1; } }

@media (prefers-reduced-motion: reduce) {
  .card { animation-name: fade; animation-duration: 160ms; }
}
```

Motion-first alternative: write the reduced version as the default and add motion only when the user allows it.

```css
@media (prefers-reduced-motion: no-preference) {
  .hero { animation: drift 20s linear infinite; }
}
```

A global safety net (keep it as a fallback, not the strategy):

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

## JavaScript (any library)

```js
const reduceQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
let reduceMotion = reduceQuery.matches;
reduceQuery.addEventListener("change", (e) => { reduceMotion = e.matches; });
```

## Per library

```js
// GSAP — matchMedia reverts animations automatically when the setting changes
const mm = gsap.matchMedia();
mm.add(
  { motion: "(prefers-reduced-motion: no-preference)", reduce: "(prefers-reduced-motion: reduce)" },
  (ctx) => {
    const { reduce } = ctx.conditions;
    gsap.from(".card", { autoAlpha: 0, y: reduce ? 0 : 24, duration: reduce ? 0.16 : 0.48, stagger: reduce ? 0 : 0.04 });
  }
);
```

```tsx
// Motion for React — one switch for the whole tree
import { MotionConfig, useReducedMotion } from "motion/react";

<MotionConfig reducedMotion="user">{/* transform & layout animations disabled, opacity kept */}</MotionConfig>

const reduce = useReducedMotion(); // for custom choices, e.g. skip parallax
```

```js
// Three.js / canvas / Proton loops — render one still frame instead of looping
if (reduceMotion) renderer.render(scene, camera);
else renderer.setAnimationLoop(tick);
```

```js
// Lottie
if (reduceMotion) anim.goToAndStop(anim.totalFrames - 1, true);
```

## Pause control for loops

```html
<button class="motion-toggle" aria-pressed="false">Pause animation</button>
```

```js
const btn = document.querySelector(".motion-toggle");
btn.addEventListener("click", () => {
  const paused = btn.getAttribute("aria-pressed") !== "true";
  btn.setAttribute("aria-pressed", String(paused));
  btn.textContent = paused ? "Play animation" : "Pause animation";
  document.getAnimations().forEach((a) => (paused ? a.pause() : a.play()));
  // gsap.globalTimeline.paused(paused); lottieAnim[paused ? "pause" : "play"]();
});
```

## Also pause when nobody is watching

```js
const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()));
io.observe(canvas);
document.addEventListener("visibilitychange", () => (document.hidden ? stop() : start()));
```

## Verify

In Chrome DevTools, open Rendering and set **Emulate CSS media feature prefers-reduced-motion** to `reduce`. In Playwright, call `page.emulateMedia({ reducedMotion: "reduce" })`. Check that every state change is still perceivable and that no content is stuck at `opacity: 0`.
