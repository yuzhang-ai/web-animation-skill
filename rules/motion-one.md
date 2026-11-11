# Motion (vanilla JS, formerly Motion One)

## When to use

Framework-agnostic animations with a small bundle. Best when you want declarative-feeling animation without React, or for scroll-linked effects that can run on the browser's native `ScrollTimeline`.

> Motion One was merged into the `motion` package (the same package that now contains the former Framer Motion). Install `motion`, import vanilla APIs from `"motion"`, and React APIs from `"motion/react"` (see [framer-motion.md](framer-motion.md)). The old `timeline()` function and the `easing` option are gone.

Two builds:
- `import { animate } from "motion"` — hybrid `animate`: sequences, independent transforms (`x`, `rotate`), springs. Use this by default.
- `import { animate } from "motion/mini"` — ~2.5KB, Web Animations API only, no sequences.

## Basic animate

```js
import { animate } from "motion";

// Returns a controls object
const controls = animate(
  ".box",
  { x: 100, rotate: 45 },
  { duration: 1, ease: "easeOut" }   // old Motion One: easing: "ease-out"
);

// Control playback
controls.pause();
controls.play();
controls.complete();   // old: finish()
controls.speed = 2;    // old: playbackRate
controls.time = 0.5;   // old: currentTime
await controls;        // old: controls.finished
```

## Keyframes

```js
animate(".box", {
  x: [0, 100, 50],
  y: [0, 50, 100],
}, { duration: 2 });
```

## Sequences (replaces `timeline()`)

```js
import { animate } from "motion";

animate([
  [".header", { y: [-50, 0], opacity: [0, 1] }, { duration: 0.5 }],
  [".card", { x: [-100, 0], opacity: [0, 1] }, { at: "-0.2" }], // overlap previous by 0.2s
  [".cta", { scale: [0.5, 1] }, { at: 0.3 }],                    // absolute time in seconds
]);
```

Sequences need the hybrid `animate` from `"motion"`; `motion/mini` doesn't support them.

## Scroll-linked

```js
import { animate, scroll } from "motion";

// Drive an animation with page scroll
scroll(animate(".progress", { scaleX: [0, 1] }, { ease: "linear" }));

// Track a specific element instead of the page
scroll(animate(".parallax", { y: [0, -200] }, { ease: "linear" }), {
  target: document.querySelector(".section"),
});

// Callback form: progress is 0..1
scroll((progress, info) => {
  console.log(progress, info.y.current);
});
```

The callback signature changed: old Motion One passed `(info)`, current Motion passes `(progress, info)`.

## InView (scroll reveal)

```js
import { animate, inView } from "motion";

inView(".reveal", (element) => {
  animate(element, { opacity: [0, 1], y: [30, 0] }, { duration: 0.6 });

  return () => animate(element, { opacity: 0, y: 30 }); // runs when it leaves
}, { amount: "some" }); // old: amount: "any"
```

## Spring physics

```js
import { animate } from "motion";

animate(".box", { x: 200 }, { type: "spring", stiffness: 100, damping: 15 });

// Duration-based spring
animate(".box", { x: 200 }, { type: "spring", duration: 0.8, bounce: 0.3 });
```

With `motion/mini`, import `spring` and pass the function: `{ type: spring, stiffness: 300 }`.

## Stagger

```js
import { animate, stagger } from "motion";

animate("li", { opacity: [0, 1] }, { delay: stagger(0.1, { startDelay: 0.2 }) });
// old option name: start → now startDelay
```

## React usage

In React, prefer the `motion/react` components and hooks (see [framer-motion.md](framer-motion.md)). For imperative control inside a component, use `useAnimate`:

```tsx
import { useAnimate } from "motion/react";
import { useEffect } from "react";

function Box() {
  const [scope, animate] = useAnimate();
  useEffect(() => {
    animate(scope.current, { opacity: [0, 1] }, { duration: 0.5 });
  }, []);
  return <div ref={scope} />;
}
```

## Vanilla vs React API

| | `motion` (vanilla) | `motion/react` |
|---|---|---|
| Framework | None | React |
| API style | Imperative (`animate`, `scroll`, `inView`) | Declarative components + hooks |
| Gestures | `hover()`, `press()` helpers | `whileHover`, `whileTap`, `drag` |
| Exit animations | Manual | `AnimatePresence` |
| Layout animations | No | `layout`, `layoutId` |
