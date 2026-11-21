# Scroll drum picker

**Effect:** a vertical list scrolls inside a panel, and it looks like a 3D drum: the item in the centre band is large and lime, items above and below tilt away (rotateX ±68°), shrink and fade. A progress bar on top tracks the scroll. No scroll listeners: it's CSS scroll-driven animation.

**Use it for:** date/time or option pickers, feature lists, scroll-linked menus.

## Prompt

```
Turn a scrolling list into a 3D drum with CSS scroll-driven animations.
- The scroller: overflow-y auto, perspective 420px, scroll-snap-type y proximity, items scroll-snap-align center, padding-block = half the scroller height so the ends can reach the centre.
- Inside @supports (animation-timeline: view()): .item { animation: drum linear both; animation-timeline: view(); animation-range: cover 0% cover 100% } with keyframes 0% rotateX(68deg) scale(.8) opacity 0 → 44–56% rotateX(0) scale(1.06) opacity 1 lime → 100% rotateX(-68deg) scale(.8) opacity 0.
- Progress bar: scroll-timeline: --drum block on the scroller, timeline-scope: --drum on a common ancestor, bar animation: grow linear both; animation-timeline: --drum.
- Draw a fixed centre band over it (pointer-events none). Without support the list just scrolls. Reduced motion: animation none.
Start from templates/scroll-drum-picker/index.html.
```

## Knobs

| Knob | Effect |
|---|---|
| `68deg` | How far items tilt away |
| `44%, 56%` | Width of the "in focus" plateau |
| `perspective: 420px` | Lower = stronger 3D |

## Pitfalls

- `animation-timeline` must come after the `animation` shorthand, which resets it.
- A named timeline used outside its scroller's subtree needs `timeline-scope` on a shared ancestor.
- `view()` tracks the nearest scroll container: an `overflow: hidden` wrapper in between freezes it.
