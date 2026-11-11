# Anime.js (v4)

## When to use

Lightweight standalone library. Excellent for SVG animations (line drawing, morphing), CSS transforms, and multi-property keyframe sequences. No framework dependency.

> v4 replaced the v3 `anime({ targets, ... })` API with named exports. Don't write `import anime from "animejs"`, `anime.timeline()` or `anime.stagger()` — those are v3 and won't work on v4.

## Basic

```js
import { animate } from "animejs";

// targets are the first argument, parameters the second
animate(".box", {
  x: 250,
  rotate: "1turn",
  backgroundColor: "#FF6B6B",
  duration: 2000,
  loop: true,
  alternate: true,    // v3: direction: "alternate"
  ease: "inOutQuad",  // v3: easing: "easeInOutQuad"
});
```

## Keyframes (property-level)

```js
animate(".box", {
  x: [
    { to: 250, duration: 1000 },
    { to: 0, duration: 1000 },
  ],
  rotate: "1turn",
  loop: true,
});
```

## SVG morphing

```js
import { animate, svg } from "animejs";

// Morph one path into the shape of another
animate("#path-a", {
  d: svg.morphTo("#path-b"),
  ease: "inOutQuad",
  duration: 1000,
  loop: true,
  alternate: true,
});
```

`svg.morphTo(target, precision)` accepts a selector, `<path>`, `<polyline>`, or `<polygon>`. For polygons, animate `points` instead of `d`.

## SVG line drawing

```js
import { animate, svg, stagger } from "animejs";

// v3: strokeDashoffset: [anime.setDashoffset, 0]
animate(svg.createDrawable("path"), {
  draw: ["0 0", "0 1"],   // "start end" of the visible stroke, 0..1
  ease: "inOutSine",
  duration: 1500,
  delay: stagger(200),
});
```

## Staggering

```js
import { animate, stagger } from "animejs";

animate(".card", {
  y: [-20, 0],
  opacity: [0, 1],
  delay: stagger(100),    // 100ms between each
  ease: "outExpo",
});

// Grid stagger from the center
animate(".dot", {
  scale: [0, 1],
  delay: stagger(50, { grid: [10, 10], from: "center" }),
});
```

## Timeline

```js
import { createTimeline } from "animejs";

const tl = createTimeline({ defaults: { ease: "outExpo", duration: 600 } });

tl.add(".el-1", { x: 200 })
  .add(".el-2", { x: 200 }, "-=400")   // starts 400ms before previous ends
  .add(".el-3", { x: 200 }, "+=200")   // 200ms after previous ends
  .add(".el-4", { x: 200 }, "<<");     // same start as previous
```

Position values: a number (absolute ms), `"+=n"`, `"-=n"`, `"<"` (previous end), `"<<"` (previous start), `"<<+=n"`, a label created with `.label("name")`, or `stagger(n)`.

## Callbacks

```js
animate(".box", {
  x: 200,
  onBegin: () => console.log("start"),   // fires after the delay ends
  onUpdate: (self) => console.log(self.progress),
  onLoop: () => {},                      // v3: loopBegin / loopComplete
  onComplete: () => console.log("done"),
});
```

All v4 callbacks use the `on` prefix (v3 used `begin`, `update`, `complete`).

## React usage

```tsx
import { useEffect, useRef } from "react";
import { animate, createScope } from "animejs";

function Animation() {
  const root = useRef(null);
  const scope = useRef(null);

  useEffect(() => {
    // Selectors inside the scope only match descendants of root
    scope.current = createScope({ root }).add(() => {
      animate(".box", { x: 200 });
    });
    return () => scope.current.revert(); // cleans up every animation in the scope
  }, []);

  return (
    <div ref={root}>
      <div className="box" />
    </div>
  );
}
```

## Easing presets

```
"linear"
"inQuad"   "outQuad"   "inOutQuad"
"inCubic"  "outCubic"  "inOutCubic"
"inExpo"   "outExpo"   "inOutExpo"
"inOut(3)"            // parameterised power easing
```

v4 drops the `ease` prefix from names: v3 `"easeOutExpo"` → v4 `"outExpo"`.
