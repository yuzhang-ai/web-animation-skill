# View Transitions API

## When to use

Animating between two states of a page, or between two pages, without managing both DOM states yourself. The browser snapshots the old view, you update the DOM, and it animates to the new view. Best for route changes, list ↔ detail morphs, theme switches, filtering and re-ordering.

Support (MDN browser-compat-data, checked 2026-11-11):

| Feature | Chrome / Edge | Safari | Firefox |
|---|---|---|---|
| Same-document `document.startViewTransition()` | 111 | 18 | 144 |
| Cross-document `@view-transition { navigation: auto }` | 126 | 18.2 | not shipped (preview only) |

Treat it as progressive enhancement: always feature-detect, and the update must work without the animation.

## Same-document (SPA)

```js
function navigate(updateDOM) {
  if (!document.startViewTransition ||
      matchMedia("(prefers-reduced-motion: reduce)").matches) {
    updateDOM();
    return;
  }
  document.startViewTransition(() => updateDOM());
}
```

`updateDOM` may return a promise (e.g. a framework render). The returned `ViewTransition` exposes `ready`, `finished` and `skipTransition()`.

By default the whole page cross-fades. Customise it with the pseudo-elements:

```css
::view-transition-old(root) {
  animation: 200ms var(--ease-in, ease-in) both fade-out;
}
::view-transition-new(root) {
  animation: 350ms var(--ease-out, ease-out) both fade-in;
}
@keyframes fade-out { to { opacity: 0; } }
@keyframes fade-in { from { opacity: 0; } }
```

## Shared-element morph

Give the same `view-transition-name` to the element in the old and new state. The browser morphs position and size between them.

```css
.card.is-active .card-image,
.detail .hero-image {
  view-transition-name: hero;
}

::view-transition-group(hero) {
  animation-duration: 450ms;
  animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
}
```

Rules:
- A `view-transition-name` must be **unique on the page** at the moment of the snapshot. Set it only on the active item (class toggle or inline style), or use `view-transition-name: match-element` for lists.
- `view-transition-class` styles many named elements with one rule: `.card { view-transition-class: card; }` then `::view-transition-group(*.card) { ... }`.

## Directional transitions with types

```js
document.startViewTransition({
  update: () => updateDOM(),
  types: [isForward ? "forwards" : "backwards"],
});
```

```css
html:active-view-transition-type(forwards) {
  &::view-transition-old(root) { animation-name: slide-out-left; }
  &::view-transition-new(root) { animation-name: slide-in-right; }
}
html:active-view-transition-type(backwards) {
  &::view-transition-old(root) { animation-name: slide-out-right; }
  &::view-transition-new(root) { animation-name: slide-in-left; }
}
```

## Cross-document (MPA)

Add this to **both** pages. No JavaScript needed.

```css
@media (prefers-reduced-motion: no-preference) {
  @view-transition {
    navigation: auto;
  }
}
```

Named elements on both pages morph across the navigation. Use the `pageswap` (old page) and `pagereveal` (new page) events to set names or types dynamically.

## Frameworks

- **React**: wrap the state update: `document.startViewTransition(() => flushSync(() => setState(next)))`. React's own `<ViewTransition>` component exists in canary/experimental builds; check the installed React version before using it.
- **Next.js / Astro / SvelteKit / Nuxt**: each has built-in or official view-transition support for route changes. Prefer the framework's integration over hand-wiring.

## Key points

- Snapshots are images: text inside a morphing group scales like a picture. For very different aspect ratios, set `::view-transition-old(name), ::view-transition-new(name) { height: 100%; object-fit: cover; }`.
- The page is non-interactive while a transition runs, so keep transitions under ~500ms.
- Debug with DevTools → Animations panel, which can pause and slow view transitions.
