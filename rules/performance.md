# Web animation performance

## The golden rules

1. **Only animate `transform` and `opacity`** — they skip layout and paint, run on compositor thread
2. **Avoid animating layout properties** — `width`, `height`, `top`, `left`, `margin`, `padding` trigger full reflow
3. **Avoid animating paint properties** — `color`, `background`, `box-shadow` trigger repaint (ok for small elements)

## What happens on each frame (16ms budget)

```
JavaScript → Style → Layout → Paint → Composite
   (2ms)     (1ms)   (4ms)   (5ms)    (4ms)
```

- `transform` / `opacity`: only Composite → cheapest
- `color` / `background`: triggers Paint → medium
- `width` / `height` / `top` / `left`: triggers Layout → most expensive

## DevTools profiling

1. Open Performance tab in Chrome DevTools
2. Check "Rendering → Paint flashing" to see repaint regions
3. Record a performance profile during animation
4. Look for long frames (>16ms) and layout/paint spikes

## will-change

```css
/* Tell browser "this will animate" — creates a GPU layer */
.animating {
  will-change: transform;
}

/* REMOVE after animation ends */
.done-animating {
  will-change: auto;
}
```

Don't overuse — each GPU layer consumes memory. Apply just before animation, remove after.

## RequestAnimationFrame timing

```js
// BAD: setInterval drifts and runs when tab is hidden
setInterval(animate, 16);

// GOOD: synced to display refresh
requestAnimationFrame(animate);
```

## Debounce scroll handlers

```js
// BAD: fires 60+ times/second
window.addEventListener("scroll", onScroll);

// GOOD: let GSAP/Motion handle it internally
// Or use Intersection Observer which is async

// OK if manual
let ticking = false;
window.addEventListener("scroll", () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      onScroll();
      ticking = false;
    });
    ticking = true;
  }
});
```

## Reduced motion

Always respect the OS setting. Reduced motion means **less movement**, not **no feedback** and never **missing content**.

Opt motion in, rather than stripping it out afterwards:

```css
/* Movement only when the user hasn't asked for less */
@media (prefers-reduced-motion: no-preference) {
  .card { transition: translate 300ms var(--ease-out); }
  .card:hover { translate: 0 -4px; }
}
```

```js
const reduce = matchMedia("(prefers-reduced-motion: reduce)");

function intro() {
  if (reduce.matches) {
    // Keep the state change, drop the travel
    gsap.from(".hero > *", { opacity: 0, duration: 0.3 });
    return;
  }
  gsap.from(".hero > *", { y: 40, opacity: 0, duration: 0.9, ease: "expo.out", stagger: 0.08 });
}
reduce.addEventListener("change", intro); // users can toggle it at any time
```

Avoid the blanket `* { animation-duration: 0.01ms !important }` reset. It breaks CSS scroll timelines and JS code waiting on `animationend`, and an element whose entrance starts at `opacity: 0` can end up stuck invisible. More patterns in [motion-design.md](motion-design.md#reduced-motion).

## Library-specific performance

| Library | Overhead | Notes |
|---------|----------|-------|
| CSS Keyframes | None | Best possible perf |
| Motion (vanilla) | Minimal | Uses native Web Animations API where it can |
| GSAP | ~0.1ms/tween | Optimized C-like JS |
| Motion for React | Small | Does extra work for layout animations |
| Anime.js | Light | Pure JS, no DOM abstraction |
| D3.js | Depends | Many elements = many transitions |
| Three.js | GPU | Offloaded to WebGL |
| Konva | Canvas | Single canvas, good for many elements |
| Lottie | Varies | SVG = more DOM nodes; Canvas = better for complex |

## Batch DOM reads/writes

```js
// BAD: interleaved reads and writes
for (const el of elements) {
  const h = el.offsetHeight;  // READ  → forces layout
  el.style.height = h + 10;   // WRITE → invalidates layout
}

// GOOD: batch reads, then batch writes
const heights = elements.map(el => el.offsetHeight); // all reads
heights.forEach((h, i) => elements[i].style.height = h + 10); // all writes
```

GSAP and Motion (vanilla and React) handle this batching automatically.
