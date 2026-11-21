# SVG spinners

**Effect:** sixteen loading indicators: rotating rings, bouncing and scaling dots, gooey merging balls, pulsing rings, wave bars, shuffling blocks. Each one is a single `<svg>` under 4KB that animates itself with SMIL, with no CSS or JS.

**Use it for:** buttons in a loading state, inline "loading…" text, empty states, AI "thinking" indicators.

## Prompt

```
Use one spinner from templates/svg-spinners/index.html (MIT, Shubham Jain's SVG Spinners): copy the <svg> markup inline.
- Size it with width/height (they use viewBox 0 0 24 24); color it with the CSS color property, since fills are currentColor.
- Inside a button, put it before the label at 1em, set aria-busy="true" on the button and keep the label text for screen readers.
- SMIL ignores prefers-reduced-motion: call svg.pauseAnimations() when reduced motion is on.
- If you inline several on one page, check that their id attributes (used by SMIL begin="x.end") stay unique.
```

## Knobs

| Knob | Effect |
|---|---|
| CSS `color` | Spinner color |
| `width` / `height` | Size; they stay sharp at any size |
| `dur` on `<animate>` | Speed of that spinner |

## Pitfalls

- Some spinners chain animations by id (`begin="spinner_X.end"`). Two copies of the same spinner on one page share ids, and the second copy may freeze. Rename ids per copy, or use `<img src="spinner.svg">` (an image keeps its ids private but can't take `currentColor`).
- SMIL keeps running under reduced motion and in background tabs unless you pause it.
- Show a spinner only after ~300ms of waiting. A flash of spinner on a fast response feels slower than none.
