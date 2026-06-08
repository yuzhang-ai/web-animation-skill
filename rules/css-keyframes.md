# CSS Keyframes

## When to use

Simple animations that don't need JS — hover states, loading spinners, subtle looped motions, page enter effects. Zero JavaScript, zero bundle. For anything interactive or scroll-driven, use JS libraries.

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

`animation-timeline: view()` is the new CSS scroll-driven animation spec (Chrome 115+, Edge 115+).

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

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
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

/* Hover scale */
.card {
  transition: transform 0.3s ease;
}
.card:hover {
  transform: scale(1.05);
}
```
