# CSS Keyframes

## When to use

Hover and focus states, loading spinners, subtle loops, page-enter effects, dialog/popover enter **and exit**, and simple scroll-linked effects. Zero JavaScript, zero bundle. Modern CSS now covers much of what used to need a library; reach for JS when you need sequencing across elements, scrubbed multi-step timelines, physics or interruption handling.

## Basic keyframe

```css
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

.element {
  animation: fadeIn 0.5s ease-out both;
}
```

`both` = applies initial state before start AND keeps final state after end.

## Multi-step keyframes

```css
@keyframes pulse {
  0%   { transform: scale(1); }
  50%  { transform: scale(1.1); }
  100% { transform: scale(1); }
}

.button {
  animation: pulse 2s ease-in-out infinite;
}
```

## Animation shorthand

```css
/* name duration easing delay count direction fill-mode */
animation: slideIn 0.6s ease-out 0.2s 1 normal both;
```

## Individual properties

```css
animation-name: bounce;
animation-duration: 1s;
animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
animation-delay: 0.5s;
animation-iteration-count: infinite;  /* or 3 */
animation-direction: alternate;
animation-fill-mode: forwards;
animation-play-state: paused;         /* JS can toggle to "running" */
```

## Scroll-triggered (CSS-only via animation-timeline)

```css
/* Modern browsers — scroll-driven animation */
@keyframes reveal {
  from { opacity: 0; }
  to   { opacity: 1; }
}

.card {
  animation: reveal linear;
  animation-timeline: view();
  animation-range: entry 0% entry 80%;
}
```

Support: Chrome/Edge 115+, Safari 26+, Firefox 159+ (MDN browser-compat-data, 2026-11-11). Wrap in `@supports (animation-timeline: view())` so older browsers show the final state. More patterns in [scroll-animations.md](scroll-animations.md).

## Enter and exit for dialogs, popovers and `display: none`

`@starting-style` defines the "before" state for an element's first frame, and `transition-behavior: allow-discrete` lets `display` and `overlay` wait for the exit transition. Together they animate elements that appear from `display: none`, which used to require JS. Support: Chrome 117+, Safari 17.5+, Firefox 129+.

```css
dialog,
[popover] {
  opacity: 0;
  translate: 0 0.5rem;
  transition:
    opacity 180ms ease-in,
    translate 180ms ease-in,
    overlay 180ms allow-discrete,
    display 180ms allow-discrete;
}

dialog[open],
[popover]:popover-open {
  opacity: 1;
  translate: 0 0;
  transition-duration: 280ms;
  transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
}

/* Must come after the open-state rule (same specificity) */
@starting-style {
  dialog[open],
  [popover]:popover-open {
    opacity: 0;
    translate: 0 0.5rem;
  }
}

dialog::backdrop {
  background: rgb(0 0 0 / 0);
  transition: background 280ms, overlay 280ms allow-discrete, display 280ms allow-discrete;
}
dialog[open]::backdrop { background: rgb(0 0 0 / 0.4); }
@starting-style { dialog[open]::backdrop { background: rgb(0 0 0 / 0); } }
```

## Springs and custom curves with `linear()`

`linear()` takes a list of points and interpolates between them, so it can approximate springs and bounces that `cubic-bezier()` can't. Support: Chrome 113+, Safari 17.2+, Firefox 112+.

```css
:root {
  /* gentle spring, small overshoot */
  --ease-spring: linear(
    0, 0.009, 0.035 2.1%, 0.141, 0.281 6.7%, 0.723 12.9%, 0.938 16.7%,
    1.017, 1.077, 1.121, 1.149 24.3%, 1.159, 1.163, 1.161, 1.154 29.9%,
    1.129 32.8%, 1.051 39.6%, 1.017 43.1%, 0.991, 0.977 51%, 0.974 53.8%,
    0.975 57.1%, 0.997 69.8%, 1.003 76.9%, 1
  );
}
.toggle-thumb { transition: translate 500ms var(--ease-spring); }
```

Generate curves with a tool such as the Linear() Easing Generator rather than writing them by hand.

## Staggering with custom properties

```css
.card:nth-child(1) { animation-delay: 0s; }
.card:nth-child(2) { animation-delay: 0.1s; }
.card:nth-child(3) { animation-delay: 0.2s; }
/* Or with JS: el.style.setProperty('--i', index) */
```

```css
/* Inline style: --i: 0; --i: 1; etc */
.card {
  animation: fadeIn 0.5s ease-out both;
  animation-delay: calc(var(--i) * 0.1s);
}
```

## Reduced motion (accessibility)

Put movement inside a `no-preference` query so it's opt-in, and give reduced-motion users a simple fade instead:

```css
.element { animation: fadeIn 0.3s ease-out both; }

@media (prefers-reduced-motion: no-preference) {
  .element { animation-name: slideUpFadeIn; animation-duration: 0.6s; }
}
```

Avoid the blanket `* { animation-duration: 0.01ms !important }` reset: it also breaks scroll-driven animations and anything waiting on `animationend`. See [performance.md](performance.md#reduced-motion).

## Animating to `height: auto`

`interpolate-size: allow-keywords` enables transitions to and from `auto`, but it's Chromium-only (Chrome 129+). Use it as an enhancement, or animate `grid-template-rows: 0fr → 1fr`, which works everywhere:

```css
.accordion-panel { display: grid; grid-template-rows: 0fr; transition: grid-template-rows 300ms var(--ease-out); }
.accordion-panel[data-open] { grid-template-rows: 1fr; }
.accordion-panel > div { overflow: hidden; }
```

## Performance rules

- Only animate `transform` and `opacity` — they run on compositor thread
- Never animate `width`, `height`, `top`, `left`, `margin`, `padding`
- Use `will-change` sparingly (and remove after animation):
  ```css
  .animating { will-change: transform; }
  .done { will-change: auto; }
  ```

## Common patterns

```css
/* Loading spinner */
@keyframes spin {
  to { transform: rotate(360deg); }
}
.spinner { animation: spin 0.8s linear infinite; }

/* Skeleton shimmer */
@keyframes shimmer {
  100% { transform: translateX(100%); }
}
.skeleton {
  overflow: hidden;
}
.skeleton::after {
  content: "";
  animation: shimmer 1.5s infinite;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
}

/* Hover lift — only on devices that can hover */
.card {
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}
@media (hover: hover) and (pointer: fine) {
  .card:hover { transform: translateY(-4px); }
}
```
