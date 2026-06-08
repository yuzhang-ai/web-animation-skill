# Flubber — SVG path morphing

## When to use

Morphing between SVG shapes — circle to square, one icon to another, smooth path deformation. Flubber interpolates between SVG path strings producing smooth in-between shapes.

## Basic morph

```js
import { interpolate } from "flubber";

const circle = "M100,100 m-75,0 a75,75 0 1,0 150,0 a75,75 0 1,0 -150,0";
const square = "M25,25 L175,25 L175,175 L25,175 Z";

// Create interpolator
const morph = interpolate(circle, square);

// Get midpoint shape
morph(0);   // circle
morph(0.5); // halfway
morph(1);   // square
```

## Animate with requestAnimationFrame

```js
import { interpolate } from "flubber";

const pathEl = document.querySelector("path");
const morph = interpolate(shapeA, shapeB, { maxSegmentLength: 10 });

let progress = 0;
const speed = 0.02;

function animate() {
  progress += speed;
  if (progress > 1) progress = 0; // loop
  pathEl.setAttribute("d", morph(progress));
  requestAnimationFrame(animate);
}

animate();
```

## Multi-shape sequence

```js
import { interpolate } from "flubber";

const shapes = [shapeA, shapeB, shapeC, shapeD];

// Interpolate through multiple shapes
let step = 0;
let morph = interpolate(shapes[0], shapes[1]);

const pathEl = document.querySelector("path");
let progress = 0;

function animate() {
  progress += 0.01;
  if (progress >= 1) {
    progress = 0;
    step = (step + 1) % (shapes.length - 1);
    morph = interpolate(shapes[step], shapes[step + 1]);
  }
  pathEl.setAttribute("d", morph(progress));
  requestAnimationFrame(animate);
}

animate();
```

## With GSAP (easier)

```js
import { interpolate } from "flubber";
import gsap from "gsap";

const morph = interpolate(shapeA, shapeB);
const pathEl = document.querySelector("path");

gsap.to({ progress: 0 }, {
  progress: 1,
  duration: 2,
  ease: "power2.inOut",
  onUpdate: function () {
    pathEl.setAttribute("d", morph(this.targets()[0].progress));
  },
});
```

## Options

```js
interpolate(pathA, pathB, {
  maxSegmentLength: 10,  // lower = smoother, higher = faster (default 10)
  string: true,          // return string (true) or array (false)
});
```

## Key points

- Only works with SVG `<path>` elements
- Paths must have compatible structure — wildly different paths may warp in unexpected ways
- `maxSegmentLength` trade-off: smaller = smoother but slower
- Combine with GSAP for built-in easing and control
