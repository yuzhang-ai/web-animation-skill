# Two.js — 2D vector scenes

## When to use

Use Two.js for generative or illustrative 2D vector animation: shapes, paths, groups, and gradients in a scene graph that you animate every frame. The **same code renders to SVG, Canvas, or WebGL**, so you can start with SVG (crisp, inspectable) and switch to WebGL when the shape count grows.

| vs. | Choose Two.js when… |
|---|---|
| Konva | You want generative / scene-graph drawing more than editor-style interaction (drag handles, transformers) |
| Raw SVG + GSAP/Anime.js | Shapes are created procedurally and change every frame |
| Three.js | It's flat 2D: Two.js is much lighter and simpler |
| p5.js | You want a retained scene graph (objects you mutate), not immediate-mode redraws |

## Setup

```js
import Two from "two.js";

const two = new Two({
  type: Two.Types.svg,     // svg | canvas | webgl
  width: 480,
  height: 320,
  autostart: true,         // starts the internal rAF loop
}).appendTo(document.querySelector("#stage"));
// fitted: true → size to parent element; fullscreen: true → size to window
```

## Shapes, styling, groups

```js
const circle = two.makeCircle(-60, 0, 36);
const rect = two.makeRoundedRectangle(60, 0, 80, 80, 12);
const star = two.makeStar(0, 0, 40, 18, 5);
const path = two.makePath(-100, 50, 0, -50, 100, 50); // closed by default
const curve = two.makeCurve(-120, 0, -40, -60, 40, 60, 120, 0, true); // open smooth curve

circle.fill = "#a3c9a8"; circle.noStroke();
rect.fill = "#c9a3d6";   rect.stroke = "#2d2d2d"; rect.linewidth = 2;
curve.noFill();          curve.stroke = "#2d2d2d"; curve.linewidth = 3; curve.cap = "round";

const group = two.makeGroup(circle, rect, star);
group.position.set(two.width / 2, two.height / 2); // children positioned relative to group
```

Every shape has `position`, `rotation` (radians), `scale` (number or `Two.Vector`), and `opacity`. Paths expose `vertices` (each a `Two.Anchor` with `x`, `y` and bezier controls) so you can mutate them per frame.

## Animate in the update loop

```js
two.bind("update", (frameCount, timeDelta) => {
  group.rotation += 0.6 * (timeDelta / 1000);         // frame-rate independent
  star.scale = 1 + Math.sin(frameCount * 0.05) * 0.1;
  circle.position.y = Math.sin(frameCount * 0.04) * 30;
});
```

Use `timeDelta` (ms since the last frame) for speed so the motion doesn't change on 120Hz displays.

## Line drawing & path trimming

```js
curve.beginning = 0;
curve.ending = 0;           // 0..1 — portion of the path that is drawn
two.bind("update", () => { curve.ending = Math.min(1, curve.ending + 0.01); });
```

## Morphing vertices

```js
// Wobble a blob: offset each vertex from its rest position
const blob = two.makeCircle(0, 0, 60, 32);  // 32 vertices
const rest = blob.vertices.map((v) => v.clone());
two.bind("update", (f) => {
  blob.vertices.forEach((v, i) => {
    const k = 1 + Math.sin(f * 0.05 + i * 0.6) * 0.08;
    v.x = rest[i].x * k; v.y = rest[i].y * k;
  });
});
```

## Tweening with another library

Two.js has no tween engine. Drive its properties from GSAP / Anime.js / Motion:

```js
import gsap from "gsap";
gsap.to(rect.position, { x: 200, duration: 1, ease: "power3.inOut" });
gsap.to(rect, { rotation: Math.PI, opacity: 0.5, duration: 1 });
// Two.js picks up the changes on its next render (autostart) — or call two.update()
```

## Interaction (SVG renderer)

```js
two.update();                           // ensure DOM nodes exist
circle.renderer.elem.addEventListener("pointerenter", () => gsap.to(circle, { scale: 1.2, duration: 0.2 }));
```

With canvas or WebGL there are no per-shape DOM nodes. Do your own hit testing, or use Konva if you need lots of interaction.

## React

```tsx
useEffect(() => {
  const two = new Two({ fitted: true, autostart: true }).appendTo(ref.current);
  /* build scene… */
  return () => { two.unbind("update"); two.pause(); two.renderer.domElement.remove(); };
}, []);
```

## Performance

- SVG renderer: fine up to a few hundred shapes. Beyond that, switch to `canvas` or `webgl` with the same code.
- Two.js doesn't tree-shake yet (the whole library is imported).
- Call `two.pause()` when off-screen; under reduced motion use `two.update()` once for a static frame.
- Two.js runs headless in Node with `node-canvas`, which is handy for rendering frames to PNG for export.
