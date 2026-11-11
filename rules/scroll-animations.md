# Scroll-driven animation patterns

## Quick pick

| Pattern | Best tool |
|---------|-----------|
| Parallax sections | GSAP ScrollTrigger (scrub) |
| Reveal on scroll | GSAP ScrollTrigger / Motion `inView` |
| Horizontal scroll section | GSAP ScrollTrigger (pin + scrub) |
| Progress bar (reading) | Motion `scroll` |
| Sticky cards stacking | GSAP ScrollTrigger (pin) |
| Simple CSS reveal / parallax / progress | CSS `animation-timeline: view()` / `scroll()` |
| Smooth momentum scrolling | Lenis + ScrollTrigger |
| React component reveal | Motion for React `whileInView` |

## GSAP — Horizontal scroll section

```js
gsap.to(".horizontal-track", {
  x: () => -(track.scrollWidth - window.innerWidth),
  ease: "none",
  scrollTrigger: {
    trigger: ".horizontal-section",
    start: "top top",
    end: () => `+=${track.scrollWidth}`,
    pin: true,
    scrub: 1,
  },
});
```

## GSAP — Staggered reveal

```js
gsap.from(".card", {
  y: 80,
  opacity: 0,
  duration: 0.8,
  stagger: 0.15,
  scrollTrigger: {
    trigger: ".cards-section",
    start: "top 75%",
  },
});
```

## Motion — Progress bar

```js
import { animate, scroll } from "motion";

scroll(
  animate(".progress-bar", { scaleX: [0, 1] }, { ease: "linear" })
);
```

## Motion for React — whileInView

```tsx
import { motion } from "motion/react";

<motion.div
  initial={{ opacity: 0, y: 40 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-50px" }}
/>
```

## CSS scroll-driven animations

Runs off the main thread and needs no JS. Support: Chrome/Edge 115+, Safari 26+, Firefox 159+ (MDN browser-compat-data, 2026-11-11). Prefer it for simple reveals, parallax and progress indicators; use ScrollTrigger when you need pinning, callbacks or multi-element timelines.

```css
@keyframes fade-up {
  from { opacity: 0; translate: 0 40px; }
  to   { opacity: 1; translate: 0 0; }
}

@media (prefers-reduced-motion: no-preference) {
  @supports (animation-timeline: view()) {
    /* Reveal as each element enters the viewport */
    .reveal {
      animation: fade-up linear both;
      animation-timeline: view();
      animation-range: entry 0% cover 30%;
    }

    /* Reading progress bar driven by page scroll */
    .progress {
      transform-origin: left;
      animation: grow linear both;
      animation-timeline: scroll(root);
    }

    /* Parallax layer: moves slower than its section */
    .parallax-layer {
      animation: drift linear both;
      animation-timeline: view();
      animation-range: cover;
    }
  }
}
@keyframes grow { from { scale: 0 1; } }
@keyframes drift { from { translate: 0 -15%; } to { translate: 0 15%; } }
```

`animation-range` keywords: `entry` (element entering), `exit` (leaving), `cover` (from first pixel visible to last pixel gone), `contain` (fully visible). Keep the `linear` timing function; the scroll position supplies the easing.

Named timelines let one element drive another: `scroll-timeline: --gallery x` on the scroller, then `animation-timeline: --gallery` on the child (use `timeline-scope` when they aren't ancestor/descendant).

## Pattern: sticky sections stacking

```js
// Cards pin in place, one on top of another
document.querySelectorAll(".card").forEach((card, i) => {
  ScrollTrigger.create({
    trigger: card,
    start: `top+=${i * 100} top`,
    endTrigger: "body",
    end: "bottom bottom",
    pin: true,
    pinSpacing: false,
  });
});
```

## Smooth scrolling with Lenis

Lenis adds momentum to native scrolling (it still uses the real scrollbar, so find-in-page, anchors and accessibility keep working). Sync it with ScrollTrigger on GSAP's ticker:

```js
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const lenis = new Lenis();
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}
```

Also import `lenis/dist/lenis.css`. Don't add smooth scrolling to pages that are mostly text or forms, and never hijack scroll speed so content moves faster or slower than the wheel.

## Performance tip

Always use `scrub` (GSAP) or scroll-linked transforms (not position polling). Avoid `scroll` event listeners — use Intersection Observer or the library's built-in scroll detection (which uses Intersection Observer internally).
