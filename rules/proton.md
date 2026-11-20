# Proton — particle systems

## When to use

Particle effects such as sparks, confetti, fireworks, snow, smoke, trails, explosions, and ambient dust. Proton gives you **emitters** (where and how fast particles spawn), **initializers** (each particle's starting mass, radius, life, and velocity), and **behaviours** (what happens over its life: alpha, scale, color, gravity, attraction, collision). It renders to Canvas, DOM, WebGL, or your own renderer.

- 2D canvas / DOM → `proton-engine` (this file)
- Three.js scenes → [`three.proton`](https://github.com/drawcall/three.proton)
- React drop-in backgrounds → [`particles-bg`](https://github.com/lindelof/particles-bg)
- For < 50 simple particles, a hand-written rAF loop (see bottom) avoids the dependency.

## Basic emitter

```js
import Proton, {
  Emitter, Rate, Span, Mass, Radius, Life, Velocity,
  Alpha, Scale, Color, Gravity, CanvasRenderer,
} from "proton-engine";

const canvas = document.querySelector("canvas");
const proton = new Proton();
const emitter = new Emitter();

emitter.rate = new Rate(new Span(4, 8), 0.05);           // 4–8 particles every 0.05s
emitter.addInitialize(new Mass(1));
emitter.addInitialize(new Radius(2, 6));
emitter.addInitialize(new Life(0.8, 1.6));                // seconds
emitter.addInitialize(new Velocity(new Span(2, 4), new Span(-20, 20), "polar")); // speed, angle (0 = up)

emitter.addBehaviour(new Alpha(1, 0));                    // fade out over life
emitter.addBehaviour(new Scale(1, 0.2));
emitter.addBehaviour(new Color("#f97316", ["#fde047", "#ef4444"])); // from → random of list
emitter.addBehaviour(new Gravity(2));

emitter.p.x = canvas.width / 2;
emitter.p.y = canvas.height - 20;
emitter.emit();                                            // continuous; emit(1.5) = for 1.5s; emit("once")

proton.addEmitter(emitter);
proton.addRenderer(new CanvasRenderer(canvas));

// Proton doesn't run its own loop — call update() every frame
(function tick() {
  proton.update();
  requestAnimationFrame(tick);
})();
```

### Loading without a bundler (CDN)

The package is CommonJS-shaped, so the `Proton` class is **not** where the bundler import above puts it:

```html
<!-- UMD: the global is a namespace, the class is on .default -->
<script src="https://cdn.jsdelivr.net/npm/proton-engine@7.1.5/build/proton.min.js"></script>
<script>
  const Proton = window.Proton.default;            // new window.Proton() → "not a constructor"
  const { Emitter, Rate, Span } = window.Proton;   // named classes are fine
</script>
```

```js
// ESM via jsDelivr's +esm wrapper: the class is one level deeper
const mod = await import("https://cdn.jsdelivr.net/npm/proton-engine@7.1.5/+esm");
const Proton = mod.default?.default ?? mod.default;
const { Emitter, Rate, Span } = mod;
```

## Span — randomness everywhere

`new Span(a, b)` means "random between a and b". `new Span([x, y, z])` picks randomly from the list. Most initializers and behaviours accept a Span anywhere they take a number, and that randomness is how you get organic effects.

## Common recipes

```js
// Burst / confetti / fireworks on click: one short-lived emitter per click.
// emit("once", true) fires a single burst and destroys the emitter after 1s.
// Plain emit("once") leaves the emitter in proton forever, so clicks leak emitters.
canvas.addEventListener("pointerdown", (e) => {
  const burst = new Emitter();
  burst.rate = new Rate(new Span(30, 50), 0);
  burst.addInitialize(new Life(0.6, 1.2));
  burst.addInitialize(new Velocity(new Span(2, 5), new Span(0, 360), "polar"));
  burst.addBehaviour(new Alpha(1, 0));
  burst.p.x = e.offsetX; burst.p.y = e.offsetY;
  proton.addEmitter(burst);
  burst.emit("once", true);
});

// Follow the pointer (trail)
canvas.addEventListener("pointermove", (e) => { emitter.p.x = e.offsetX; emitter.p.y = e.offsetY; });

// Snow / rain covering the screen — spawn inside a rect, pre-fill so it doesn't start empty
import { Position, RectZone, RandomDrift } from "proton-engine";
emitter.addInitialize(new Position(new RectZone(0, 0, canvas.width, 1)));
emitter.addBehaviour(new RandomDrift(10, 0, 0.05));
emitter.preEmit(5);                                // simulate 5s up front

// Attract toward / repel from a point
import { Attraction, Repulsion } from "proton-engine";
const target = { x: 200, y: 200 };
emitter.addBehaviour(new Attraction(target, 10, 200));   // target can be updated each frame

// Vortex
import { Cyclone } from "proton-engine";
emitter.addBehaviour(new Cyclone(30, 1.5));

// Draw images / sprites instead of circles
import { Body } from "proton-engine";
emitter.addInitialize(new Body(["/spark.png", "/star.png"]));  // prefer WebGLRenderer with Body + Color
```

### Trails and glow with the canvas renderer

`CanvasRenderer` clears the whole canvas every frame. For light streaks, take over the clear and paint a translucent fill instead, then draw particles additively:

```js
const renderer = new CanvasRenderer(canvas);
renderer.onProtonUpdate = function () {
  const ctx = this.context;
  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = "rgba(10, 11, 13, 0.18)";   // page background, low alpha = longer trails
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.globalCompositeOperation = "lighter";   // overlapping particles glow
};
proton.addRenderer(renderer);
```

## Renderers

| Renderer | Use when |
|---|---|
| `CanvasRenderer(canvas)` | Default; hundreds to a few thousand particles |
| `WebGLRenderer(canvas)` | Thousands+, sprites with tinting |
| `DomRenderer(el)` | Few particles that need CSS or a11y hooks |
| `PixelRenderer(canvas)` | Pixel-art / dust effects |
| `CustomRenderer` | Draw into Pixi, Phaser, or your own scene: implement `onParticleCreated/Updated/Dead` |

## Performance & hygiene

- Set `proton.fps = 60` on high-refresh displays if the simulation runs too fast.
- Cap the particle count: lower the `Rate` or shorten `Life`. Each particle costs CPU on the main thread.
- Size the canvas for devicePixelRatio, and pause `tick` when off-screen (`IntersectionObserver`) or hidden.
- Clean up with `emitter.stop()`, `emitter.removeAllParticles()`, and `proton.destroy()` when the component unmounts.
- Reduced motion: emit nothing (or a static scatter), see [accessibility.md](accessibility.md).

## No-dependency fallback (tiny effects)

```js
const ps = [];
function spawn(x, y) {
  for (let i = 0; i < 24; i++) {
    const a = Math.random() * Math.PI * 2, s = 1 + Math.random() * 3;
    ps.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 1 });
  }
}
function tick(dt = 1 / 60) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = ps.length - 1; i >= 0; i--) {
    const p = ps[i];
    p.vy += 0.08; p.x += p.vx; p.y += p.vy; p.life -= dt * 1.2;
    if (p.life <= 0) { ps.splice(i, 1); continue; }
    ctx.globalAlpha = p.life;
    ctx.beginPath(); ctx.arc(p.x, p.y, 3 * p.life, 0, Math.PI * 2); ctx.fill();
  }
  requestAnimationFrame(() => tick());
}
```
