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

## SplitText (line, word and character reveals)

Rewritten in GSAP 3.13: half the size, built-in masking, automatic re-splitting on resize and font load, and screen-reader labels by default.

```js
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
gsap.registerPlugin(SplitText);

document.fonts.ready.then(() => {
  SplitText.create(".headline", {
    type: "lines,words",
    mask: "lines",          // wraps each line in an overflow-clipping element
    autoSplit: true,        // re-split when width or fonts change
    onSplit(self) {
      // Return the animation so SplitText can revert and resync it on re-split
      return gsap.from(self.lines, {
        yPercent: 110,
        duration: 1,
        ease: "expo.out",
        stagger: 0.08,
      });
    },
  });
});
```

Split only what you animate (`type: "lines"` is far cheaper than `"chars"`). `aria: "auto"` (default) keeps the text readable by screen readers.

## Flip (layout animation)

Animate between two layouts, such as a grid reflow, filtering, or moving an element to a new parent.

```js
import { Flip } from "gsap/Flip";
gsap.registerPlugin(Flip);

const state = Flip.getState(".item");     // 1. record current positions
container.classList.toggle("is-list");    // 2. change the layout
Flip.from(state, {                        // 3. animate from old to new
  duration: 0.6,
  ease: "power3.inOut",
  stagger: 0.03,
  absolute: true,
  onEnter: (els) => gsap.fromTo(els, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1 }),
  onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0.8 }),
});
```

## Responsive and reduced-motion setups (`gsap.matchMedia`)

```js
const mm = gsap.matchMedia();

mm.add({
  isDesktop: "(min-width: 800px)",
  reduceMotion: "(prefers-reduced-motion: reduce)",
}, (ctx) => {
  const { isDesktop, reduceMotion } = ctx.conditions;
  if (reduceMotion) return; // leave everything static
  gsap.to(".panel", {
    xPercent: isDesktop ? -100 : 0,
    scrollTrigger: { trigger: ".panels", pin: isDesktop, scrub: true },
  });
  // Everything created here is reverted automatically when the query stops matching
});
```

## Other plugins worth knowing

All free in the public `gsap` package: `DrawSVGPlugin` (stroke drawing), `MorphSVGPlugin` (shape morphing), `ScrollSmoother` (smooth scroll built on ScrollTrigger), `CustomEase`, `Observer` (wheel/touch/pointer gestures), `Draggable` + `InertiaPlugin`, `MotionPathPlugin`, `ScrambleTextPlugin`.

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
- Use `ScrollTrigger.refresh()` after DOM changes that affect layout (images loading, content injected)
- Create ScrollTriggers in page order (top to bottom), or set `refreshPriority`, so pin spacing is calculated correctly
- `markers: true` while developing; remove before shipping
