# Motion One

## When to use

Framework-agnostic animations with tiny bundle (~3KB). Uses native Web Animations API under the hood. Best when you want Framer-Motion-like ergonomics but without React or the bundle cost.

## Basic animate

```js
import { animate } from "motion";

// Returns a controls object
const controls = animate(
  ".box",
  { x: 100, rotate: 45 },
  { duration: 1, easing: "ease-out" }
);

// Control playback
controls.pause();
controls.play();
controls.finish();
```

## Keyframes

```js
animate(".box", [0, 100, 50], { duration: 2 }); // single property

animate(".box", {
  x: [0, 100, 50],
  y: [0, 50, 100],
}, { duration: 2 });
```

## Timeline (sequencing)

```js
import { animate, timeline } from "motion";

const seq = timeline([
  [".header", { y: [-50, 0], opacity: [0, 1] }, { duration: 0.5 }],
  [".card", { x: [-100, 0], opacity: [0, 1] }, { at: "-0.2" }],
  [".cta", { scale: [0.5, 1] }, { at: 0.3 }],
]);
```

## Scroll-linked

```js
import { scroll } from "motion";

// Drive animation with scroll position
scroll(animate(".progress", { scaleX: [0, 1] }));

// Scroll-driven parallax
scroll(animate(".parallax", { y: [0, -200] }), {
  target: ".section",
});
```

## InView (scroll reveal)

```js
import { inView } from "motion";

inView(".reveal", (element) => {
  animate(element, { opacity: [0, 1], y: [30, 0] }, { duration: 0.6 });

  return () => animate(element, { opacity: 0, y: 30 }); // cleanup (leave)
});
```

## Spring physics

```js
import { spring } from "motion";

animate(".box", { x: 200 }, { type: "spring", stiffness: 100, damping: 15 });
```

## React usage

```tsx
import { useEffect, useRef } from "react";
import { animate } from "motion";

function Box() {
  const ref = useRef(null);
  useEffect(() => {
    animate(ref.current, { opacity: [0, 1] }, { duration: 0.5 });
  }, []);
  return <div ref={ref} />;
}
```

## Comparison with Framer Motion

| | Motion One | Framer Motion |
|---|---|---|
| Size | ~3KB | ~30KB |
| Framework | None | React |
| API style | imperative | declarative |
| Gestures | No | Yes (hover, tap, drag) |
| AnimatePresence | No | Yes |
