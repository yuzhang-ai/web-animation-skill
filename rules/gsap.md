# GSAP — GreenSock Animation Platform

## Core concepts

GSAP is **100% free, including every plugin** (SplitText, MorphSVG, DrawSVG, Flip, ScrollSmoother, Inertia, etc.) since the Webflow acquisition in 2025. They all ship in the public `gsap` npm package, so there's no private registry or Club membership anymore.

GSAP operates on numeric properties of any object. Its core strength: **ScrollTrigger** for scroll-driven animations, **timeline** for sequencing, and **stagger** for staggered reveals.

## Basic tween

```js
import gsap from "gsap";

// target can be CSS selector, element, ref, or plain object
gsap.to(".box", {
  x: 100,           // transform: translateX(100px)
  y: 50,
  opacity: 0.5,
  scale: 1.2,
  rotate: 45,
  duration: 1.5,
  ease: "power3.out",
  delay: 0.2,
  onComplete: () => console.log("done"),
});
```

## From / FromTo

```js
gsap.from(".box", { opacity: 0, y: 50, duration: 1 });
gsap.fromTo(".box", { x: -100 }, { x: 100, duration: 1 });
```

## Timeline (sequencing)

```js
const tl = gsap.timeline({ defaults: { duration: 0.5 } });

tl.from(".header", { y: -50, opacity: 0 })
  .from(".card-1", { x: -100, opacity: 0 }, "-=0.2")  // 0.2s overlap
  .from(".card-2", { x: 100, opacity: 0 }, "<")        // same time as previous
  .from(".card-3", { scale: 0, opacity: 0 }, ">+0.3"); // 0.3s after previous
```

## Stagger

```js
// All items animate with staggered delay
gsap.from(".card", {
  y: 100,
  opacity: 0,
  duration: 0.8,
  stagger: 0.1,        // 0.1s between each
  ease: "power2.out",
});

// Stagger from center
gsap.from(".item", {
  scale: 0,
  stagger: { each: 0.05, from: "center" },
});
```

## ScrollTrigger

```js
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

// Parallax
gsap.to(".parallax-bg", {
  y: -200,
  scrollTrigger: {
    trigger: ".section",
    start: "top bottom",
    end: "bottom top",
    scrub: true,  // ties animation to scroll position
  },
});

// Reveal on scroll
gsap.from(".reveal", {
  opacity: 0,
  y: 80,
  duration: 1,
  scrollTrigger: {
    trigger: ".reveal",
    start: "top 80%",     // when top of element hits 80% of viewport
    toggleActions: "play none none reverse",
  },
});

// Pin section
ScrollTrigger.create({
  trigger: ".pinned-section",
  start: "top top",
  end: "+=2000",  // scroll distance to pin for
  pin: true,
});
```

## React usage — `useGSAP`

Use the official hook instead of `useEffect` + `gsap.context`. It scopes selectors to the container and reverts everything on unmount, which is safe under React 18/19 Strict Mode double-invocation.

```tsx
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
gsap.registerPlugin(useGSAP);

function Cards() {
  const container = useRef(null);

  const { contextSafe } = useGSAP(() => {
    gsap.from(".card", { y: 24, autoAlpha: 0, stagger: 0.05, duration: 0.5, ease: "power3.out" });
  }, { scope: container });            // ".card" only matches inside container

  // Event handlers created later must be wrapped so they're cleaned up too
  const onEnter = contextSafe((e) => gsap.to(e.currentTarget, { scale: 1.03, duration: 0.2 }));

  return <div ref={container}>{/* .card elements with onMouseEnter={onEnter} */}</div>;
}
```

Use `dependencies: [value]` + `revertOnUpdate: true` to rebuild animations when props change.

## Popular plugins (all free)

```js
import { SplitText } from "gsap/SplitText";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { Flip } from "gsap/Flip";
gsap.registerPlugin(SplitText, MorphSVGPlugin, DrawSVGPlugin, Flip);

// Text reveal by line/word/char — autoSplit re-splits on resize/font load
SplitText.create(".headline", {
  type: "lines,words",
  mask: "lines",                         // each line clips its own words
  autoSplit: true,
  onSplit: (self) => gsap.from(self.words, { yPercent: 100, stagger: 0.04, duration: 0.6, ease: "power3.out" }),
});

// SVG shape morph (replaces Flubber for most cases)
gsap.to("#circle", { morphSVG: "#star", duration: 1, ease: "power2.inOut" });

// Line drawing
gsap.from("path", { drawSVG: 0, duration: 1.5, stagger: 0.2 });

// FLIP layout animation: record → change DOM → animate from old positions
const state = Flip.getState(".grid-item");
grid.classList.toggle("list-view");
Flip.from(state, { duration: 0.6, ease: "power2.inOut", stagger: 0.02, absolute: true });
```

## Reduced motion & responsive — `gsap.matchMedia`

```js
const mm = gsap.matchMedia();
mm.add({
  isDesktop: "(min-width: 800px)",
  reduce: "(prefers-reduced-motion: reduce)",
}, (ctx) => {
  const { isDesktop, reduce } = ctx.conditions;
  gsap.to(".hero", { y: reduce ? 0 : isDesktop ? -200 : -80, scrollTrigger: { trigger: ".hero", scrub: true } });
  // everything created here is auto-reverted when a condition changes
});
```

## Easing cheat sheet

```js
// Smooth deceleration (most common)
"power2.out"   // gentle
"power3.out"   // medium
"power4.out"   // snappy

// Elastic / bounce
"elastic.out(1, 0.5)"
"bounce.out"

// Custom bezier (needs CustomEase plugin — GSAP eases don't accept "cubic-bezier()" strings)
CustomEase.create("outQuint", "0.16, 1, 0.3, 1");
gsap.to(".box", { x: 100, ease: "outQuint" });
```

## Performance notes

- Only animate `transform` and `opacity` when possible
- Use `will-change` CSS sparingly (browser hint)
- `gsap.ticker.fps(60)` to cap (not needed normally)
- Use `ScrollTrigger.refresh()` after DOM changes
- Use `autoAlpha` instead of `opacity` — it also toggles `visibility: hidden` at 0 so invisible elements stop catching clicks
- `gsap.quickTo()` for values that update every pointer move (cursor followers) — far cheaper than a new tween per event
