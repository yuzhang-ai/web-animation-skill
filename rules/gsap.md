# GSAP — GreenSock Animation Platform

## Core concepts

GSAP operates on numeric properties of any object. Its core strength: **ScrollTrigger** for scroll-driven animations, **timeline** for sequencing, and **stagger** for staggered reveals.

GSAP is now 100% free (backed by Webflow), including the formerly paid plugins: SplitText, MorphSVG, DrawSVG, ScrollSmoother, Inertia and others. They ship in the public `gsap` npm package; no Club GSAP token or private registry is needed.

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

## React usage

Use the `useGSAP` hook from `@gsap/react` (`npm install @gsap/react`). It replaces the older `useEffect` + `gsap.context()` pattern and reverts animations automatically on unmount.

```tsx
"use client"; // Next.js App Router only
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

function Box({ endX }) {
  const container = useRef(null);

  // scope: selector strings only match descendants of container
  useGSAP(() => {
    gsap.to(".box", { x: endX, duration: 1 });
  }, { scope: container, dependencies: [endX] });

  return (
    <div ref={container}>
      <div className="box" />
    </div>
  );
}
```

Animations created later (click handlers, timeouts) are not tracked unless wrapped in `contextSafe`:

```tsx
const { contextSafe } = useGSAP({ scope: container });

const onClick = contextSafe(() => {
  gsap.to(".box", { rotate: "+=180" });
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

// Custom bezier
"cubic-bezier(0.16, 1, 0.3, 1)"  // ease-out-quint
```

## Performance notes

- Only animate `transform` and `opacity` when possible
- Use `will-change` CSS sparingly (browser hint)
- `gsap.ticker.fps(60)` to cap (not needed normally)
- Use `ScrollTrigger.refresh()` after DOM changes
