# Scroll-driven animation patterns

## Quick pick

| Pattern | Best tool |
|---------|-----------|
| Parallax sections | GSAP ScrollTrigger (scrub) |
| Reveal on scroll | CSS `view()` timeline / Motion `inView` / GSAP ScrollTrigger |
| Horizontal scroll section | GSAP ScrollTrigger (pin + scrub) |
| Progress bar (reading) | CSS `scroll()` timeline / Motion `scroll` |
| Sticky cards stacking | GSAP ScrollTrigger (pin) |
| Simple CSS reveal | CSS animation-timeline: view() |
| React component reveal | Motion `whileInView` |
| Scroll-synced timeline (no pinning) | Anime.js `onScroll({ sync: true })` |

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
  animate(".progress-bar", { scaleX: [0, 1] })
);
```

## Motion (React) — whileInView

```tsx
import { motion } from "motion/react";

<motion.div
  initial={{ opacity: 0, y: 40 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-50px" }}
/>
```

## CSS — view() timeline (new)

```css
@keyframes fade-up {
  from { opacity: 0; translate: 0 40px; }
  to   { opacity: 1; translate: 0 0; }
}

.reveal {
  animation: fade-up linear both;
  animation-timeline: view();
  animation-range: entry 0% entry 80%;
}
```

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

## Accessibility

Scroll-scrubbed parallax and pinned "scroll-jacking" sections are the most common vestibular triggers. Disable them under `prefers-reduced-motion` (GSAP: `gsap.matchMedia`; see [accessibility.md](accessibility.md)), and never hijack native scroll speed.

## Performance tip

Always use `scrub` (GSAP) or scroll-linked transforms (not position polling). Avoid `scroll` event listeners — use Intersection Observer or the library's built-in scroll detection (which uses Intersection Observer internally).
