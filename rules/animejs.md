# Anime.js (v4)

> **v4 is a full API rewrite (2025).** v3 code such as `anime({ targets })`, `easing: "easeOutQuad"`, `anime.timeline()`, and `anime.stagger()` **will not run**. Always use the named imports below. Migration guide: https://github.com/juliangarnier/anime/wiki/Migrating-from-v3-to-v4

## When to use

A modular, tree-shakeable library with no framework dependency. It's excellent for SVG (line drawing, morphing, motion paths), staggered grids, keyframe sequences, timelines, scroll-synced animation, and animating plain JS objects (e.g. Three.js uniforms).

## Basic

```js
import { animate, stagger } from "animejs";

animate(".square", {
  x: 320,                       // shorthand for translateX
  rotate: { from: -180 },       // animate *from* a value to the current one
  duration: 1250,
  delay: stagger(65, { from: "center" }),
  ease: "inOutQuint",           // v3: easing: "easeInOutQuint"
  loop: true,                   // true = infinite; a number = extra repeats
  alternate: true,              // v3: direction: "alternate"
});
```

## Property keyframes & per-property params

```js
animate(".box", {
  x: [{ to: 250, duration: 600 }, { to: 0, duration: 600, ease: "inOutSine" }], // v3 used `value`
  opacity: { from: 0, to: 1, duration: 300 },
  scale: [0.9, 1],              // [from, to]
});
```

## Stagger (incl. grids)

```js
animate(".dot", {
  scale: [{ to: [0, 1.25] }, { to: 0 }],
  delay: stagger(80, { grid: [10, 10], from: "center" }),  // ripple outward from the center cell
  ease: "inOutQuad",
});

animate(".card", { y: [16, 0], opacity: [0, 1], delay: stagger(50, { start: 200 }) });
```

## Timeline

```js
import { createTimeline } from "animejs";

const tl = createTimeline({ defaults: { ease: "outExpo", duration: 600 } });

tl.add(".el-1", { x: 200 })
  .add(".el-2", { x: 200 }, "-=400")   // overlap previous by 400ms
  .add(".el-3", { x: 200 }, "<")       // start with previous
  .label("end")
  .add(".el-4", { opacity: 0 }, "end+=200");
```

## SVG — `svg` module

```js
import { animate, svg, stagger } from "animejs";

// Line drawing (v3: strokeDashoffset: [anime.setDashoffset, 0])
animate(svg.createDrawable("path"), {
  draw: ["0 0", "0 1"],         // start/end of the visible segment, 0..1
  ease: "inOutSine",
  duration: 1500,
  delay: stagger(200),
});

// Shape morph — point counts are matched automatically
animate("#blob", { d: svg.morphTo("#star"), duration: 900, ease: "inOutQuad" });

// Follow a path (v3: anime.path)
animate(".car", { ...svg.createMotionPath("#track"), duration: 4000, loop: true, ease: "linear" });
```

## Scroll-synced

```js
import { animate, onScroll } from "animejs";

animate(".panel", {
  x: [-200, 0],
  autoplay: onScroll({ target: ".panel", sync: true }), // progress tied to scroll position
});
```

## Springs

```js
import { animate, createSpring } from "animejs";
animate(".chip", { scale: 1.1, ease: createSpring({ stiffness: 200, damping: 12 }) });
```

## Callbacks & controls

```js
const anim = animate(".box", {
  x: 200,
  autoplay: false,
  onBegin: () => {},            // all callbacks are on-prefixed in v4
  onUpdate: (a) => console.log(a.progress), // 0..1
  onLoop: () => {},
  onComplete: () => {},
});

anim.play(); anim.pause(); anim.resume(); anim.reverse(); anim.seek(500);
await anim;                     // animations are thenable (v3: .finished)
anim.revert();                  // remove inline styles & stop
```

## React — `createScope`

```tsx
import { useEffect, useRef } from "react";
import { animate, createScope, stagger } from "animejs";

function List() {
  const root = useRef(null);
  useEffect(() => {
    const scope = createScope({ root }).add(() => {
      animate(".item", { y: [12, 0], opacity: [0, 1], delay: stagger(40) }); // scoped to root
    });
    return () => scope.revert();  // cleans up every animation created in the scope
  }, []);
  return <ul ref={root}>{/* .item */}</ul>;
}
```

`createScope({ mediaQueries: { reduce: "(prefers-reduced-motion: reduce)" } })` exposes `scope.matches.reduce` inside `.add()` so you can branch for reduced motion.

## Driving Anime.js from another loop (Three.js, tests, frame capture)

```js
import { engine } from "animejs";
engine.useDefaultMainLoop = false;          // stop Anime.js's own rAF
renderer.setAnimationLoop(() => { engine.update(); renderer.render(scene, camera); });
```

## Utilities

```js
import { utils } from "animejs";
utils.set(".box", { x: 0, opacity: 0 });   // v3: anime.set
utils.get(".box", "x");
utils.random(50, 100);
utils.remove(".box");                       // stop animations on targets
```

## Ease names (v4)

```
"linear"   "in(3)" "out(3)" "inOut(3)"    ← power eases, default ease is "out(2)"
"inQuad"   "outQuad"   "inOutQuad"   (also Cubic, Quart, Quint, Sine, Expo, Circ)
"outBack"  "outElastic(1, .5)"  "outBounce"  "steps(5)"  "cubicBezier(.16,1,.3,1)"
```
