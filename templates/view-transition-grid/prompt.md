# View transition grid

**Effect:** five coloured tiles in a grid shuffle positions twice, then one tile grows to fill the whole panel (showing its description) and shrinks back; every tile glides smoothly to its new place. No animation library: the browser morphs DOM snapshots.

**Use it for:** sorting and filtering results, card → detail expansion, dashboard rearranging. Any DOM change you can describe as before/after.

## Prompt

```
Animate DOM reordering and expansion with the View Transitions API (no library).
- Give every tile a unique view-transition-name (el.style.viewTransitionName = `tile-${i}`).
- Wrap each DOM change in document.startViewTransition(update): shuffle = re-append children in a new order; expand = add .expanded (grid-column/row 1 / -1) to one tile and hide the others; collapse = remove it.
- CSS: ::view-transition-group(*) { animation-duration: .7s; animation-timing-function: cubic-bezier(0.16,1,0.3,1) }, ::view-transition-old/new(*) { height: 100% } so text doesn't stretch, ::view-transition-old/new(root) { animation: none }, ::view-transition { pointer-events: none }.
- Catch vt.ready and vt.finished (skipped transitions reject). Skip transitions while the page is scrolling.
- No support or reduced motion: call update() directly; the layout still changes instantly.
Start from templates/view-transition-grid/index.html.
```

## Knobs

| Knob | Effect |
|---|---|
| `::view-transition-group(*)` | Duration and easing for every morph |
| names | Only named elements morph; unnamed ones cross-fade with the root |

## Pitfalls

- Two elements with the same view-transition-name at capture time abort the transition.
- `hidden` loses to your own `display` rule; a hidden copy can still duplicate a name.
- Snapshots are images: text inside a growing tile stretches unless you set `height: 100%` on old/new.
