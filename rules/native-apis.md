# Native browser animation APIs (no library)

By late 2025, browsers natively cover much of what used to need a library. Reach for these first: they cost 0 KB, run off the main thread where possible, and survive framework changes.

| Need | Native API | Support (late 2025) |
|---|---|---|
| Imperative tweens with promises | Web Animations API (`el.animate`) | All browsers |
| Page / state transitions, shared-element morph | View Transitions API | Same-document: all major browsers; cross-document: Chromium + Safari |
| Scroll-linked / scroll-reveal | CSS `animation-timeline: scroll()` / `view()` | Chromium, Safari 26+; Firefox behind a flag → feature-detect |
| Animate on insert (from `display: none`) | `@starting-style` + `transition-behavior: allow-discrete` | All major browsers |
| Spring / bounce curves in CSS | `linear()` easing | All browsers |
| Animate to `height: auto` | `interpolate-size: allow-keywords` / `calc-size()` | Chromium only → progressive enhancement |

## Web Animations API (WAAPI)

```js
const anim = el.animate(
  [
    { opacity: 0, transform: "translateY(16px)" },
    { opacity: 1, transform: "none" },
  ],
  { duration: 280, easing: "cubic-bezier(0.16, 1, 0.3, 1)", fill: "both", delay: 40 }
);

await anim.finished;  // promise
anim.pause(); anim.reverse(); anim.playbackRate = 2;
anim.currentTime = 140; // scrub (ms)

// Keep the end state and drop the animation (frees memory for fill: "forwards")
anim.commitStyles(); anim.cancel();
```

Stagger without a library:

```js
items.forEach((el, i) =>
  el.animate([{ opacity: 0, translate: "0 12px" }, { opacity: 1, translate: "0 0" }],
    { duration: 320, delay: Math.min(i * 40, 400), easing: "ease-out", fill: "both" })
);
```

`document.getAnimations()` returns every running CSS and WAAPI animation, which is useful for pausing them all or for testing (see [workflow.md](workflow.md)).

## View Transitions API

### Same-document (SPA state change)

```js
function update() { /* mutate DOM: swap list order, open detail view, change theme… */ }

if (!document.startViewTransition) update();
else document.startViewTransition(update);
```

```css
/* Give elements that should morph between states a unique name */
.thumb.active   { view-transition-name: hero; }
.detail .image  { view-transition-name: hero; }

/* Customize the default root crossfade */
::view-transition-old(root),
::view-transition-new(root) { animation-duration: 240ms; }

/* Customize one element's morph */
::view-transition-group(hero) { animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1); }

@media (prefers-reduced-motion: reduce) {
  ::view-transition-group(*), ::view-transition-old(*), ::view-transition-new(*) { animation: none !important; }
}
```

Rules:
- Each `view-transition-name` must be **unique on the page** at capture time. Otherwise the transition is skipped and an error is thrown.
- For lists, set names dynamically: `el.style.viewTransitionName = \`item-${id}\``. Newer browsers also accept `view-transition-name: match-element`.
- In React, update state inside the callback with `flushSync`, or use React's `<ViewTransition>` where available.

### Cross-document (MPA, multi-page sites)

```css
/* On both pages */
@view-transition { navigation: auto; }
```

That's all you need for a crossfade between same-origin page loads. Add matching `view-transition-name`s on both pages to get shared-element morphs.

## Scroll-driven animations (CSS)

```css
@keyframes reveal { from { opacity: 0; translate: 0 32px; } to { opacity: 1; translate: 0 0; } }
@keyframes grow   { from { scale: 0 1; } to { scale: 1 1; } }

@supports (animation-timeline: view()) {
  /* Element reveal as it enters the viewport */
  .reveal {
    animation: reveal linear both;
    animation-timeline: view();
    animation-range: entry 0% entry 60%;
  }

  /* Reading progress bar driven by page scroll */
  .progress {
    transform-origin: 0 50%;
    animation: grow linear both;
    animation-timeline: scroll(root block);
  }
}
```

- Always wrap in `@supports` and make sure content is visible without it.
- Progress comes from scroll, so leave out a time duration. Use `linear` easing so scroll maps 1:1 to progress, and `both` so the start and end states hold outside the range.
- Put `animation-timeline` **after** the `animation` shorthand. The shorthand resets it.
- Use a named timeline to drive one element from another's scroll: `scroll-timeline: --gallery x;` on the scroller, `animation-timeline: --gallery;` on the target.
- These run off the main thread when animating transform/opacity, which is smoother than JS scroll listeners.

## Enter animations with `@starting-style`

```css
.toast {
  transition: opacity 200ms ease-out, translate 200ms ease-out, display 200ms allow-discrete;
  opacity: 1; translate: 0 0;
}
@starting-style {
  .toast { opacity: 0; translate: 0 8px; }
}
.toast[hidden] { display: none; opacity: 0; translate: 0 8px; }
```

This works great for `<dialog>`, `[popover]`, and elements newly inserted into the DOM: no JS "mount then add class" double-rAF hack.

```css
dialog[open] { opacity: 1; scale: 1; }
dialog { opacity: 0; scale: 0.96; transition: opacity .2s, scale .2s, overlay .2s allow-discrete, display .2s allow-discrete; }
@starting-style { dialog[open] { opacity: 0; scale: 0.96; } }
```

## Springs in pure CSS with `linear()`

`linear()` takes a list of points, which lets you approximate any curve: spring, bounce, or elastic.

```css
:root {
  /* Generated spring curve (stiffness ~170, damping ~20) */
  --ease-spring: linear(0, 0.13 3%, 0.5 9%, 0.86 16%, 1.04 23%, 1.08 28%, 1.06 34%, 1 44%, 0.99 53%, 1);
}
.chip:hover { scale: 1.06; transition: scale 500ms var(--ease-spring); }
```

Generate curves with a `linear()` easing generator tool, or export them from Motion's `spring()`. Keep the duration long enough (≥ 400ms) for the overshoot to read.

## Animating to `height: auto`

```css
:root { interpolate-size: allow-keywords; }   /* Chromium; others snap — acceptable */
.accordion-panel { height: 0; overflow: clip; transition: height 280ms var(--ease-out); }
.accordion[open] .accordion-panel { height: auto; }
```

Fallback for all browsers: animate `grid-template-rows: 0fr → 1fr` on a grid wrapper.

## When native isn't enough

Use a library when you need:
- Timelines with labels, nesting, and scrubbing → GSAP, Anime.js
- Physics springs that keep velocity when interrupted, gestures, and drag → Motion
- React layout / shared-layout animation → Motion (`layout`, `layoutId`)
- Scroll pinning and complex scrub choreography → GSAP ScrollTrigger
- Canvas / WebGL scenes → Konva, Two.js, Three.js, Proton
