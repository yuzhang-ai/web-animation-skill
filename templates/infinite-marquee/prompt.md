# Infinite marquee

**Effect:** one or more rows of pills (logos, tags, quotes) glide sideways forever, rows alternating direction. The edges fade out with a mask, and hovering a row pauses it.

**Use it for:** "trusted by" logo walls, tech-stack strips, testimonial tickers.

## Prompt

```
Build an infinite horizontal marquee with CSS animation, as a progressive enhancement.
- Base markup is a normal <ul> that wraps (flex-wrap) and is readable with no JS and under reduced motion.
- JS (skipped under prefers-reduced-motion) sets data-animated, copies the items (aria-hidden="true") until one set is at least as wide as the row, then duplicates the whole list once more so it is two identical halves.
- Animated state: overflow hidden; mask-image: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent); ul is nowrap, width: max-content, animation: marquee var(--speed) linear infinite; @keyframes marquee { to { translate: calc(-50% - var(--gap) / 2) } }.
- data-direction="right" uses animation-direction: reverse. :hover pauses with animation-play-state.
Start from templates/infinite-marquee/index.html.
```

## Knobs

| Knob | Effect |
|---|---|
| `data-speed` | Seconds per loop. Keep it slow: 30–60s for logos |
| `--gap` | Space between items; the keyframe uses it, so change it in one place |
| mask stops `12% / 88%` | Width of the edge fade |

## Pitfalls

- Moving by exactly `-50%` jumps by half a gap at the loop point. Subtract `var(--gap) / 2`.
- If one set is narrower than the row, a gap appears before it wraps. Repeat the set until it fills the row.
- Hide the copies from screen readers (`aria-hidden`) or every logo is announced twice.
- Put `overflow-x: clip` on the body as a safety net against sideways scroll on mobile.
