# Scroll-driven animation patterns

## Quick pick

| Pattern | Best tool |
|---------|-----------|
| Parallax sections | GSAP ScrollTrigger (scrub) |
| Reveal on scroll | GSAP ScrollTrigger / Motion One inView |
| Horizontal scroll section | GSAP ScrollTrigger (pin + scrub) |
| Progress bar (reading) | Motion One scroll |
| Sticky cards stacking | GSAP ScrollTrigger (pin) |
| Simple CSS reveal | CSS animation-timeline: view() |
| React component reveal | Framer Motion useInView |

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

## Motion One — Progress bar

```js
import { scroll } from "motion";

scroll(
  animate(".progress-bar", { scaleX: [0, 1] })
);
```

## Framer Motion — useInView

```tsx
const ref = useRef(null);
const inView = useInView(ref, { once: true, margin: "-50px" });

<motion.div
  ref={ref}
  initial={{ opacity: 0, y: 40 }}
  animate={inView ? { opacity: 1, y: 0 } : {}}
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

## Performance tip

Always use `scrub` (GSAP) or scroll-linked transforms (not position polling). Avoid `scroll` event listeners — use Intersection Observer or the library's built-in scroll detection (which uses Intersection Observer internally).
