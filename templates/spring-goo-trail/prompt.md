# Spring goo trail

**Effect:** a lime-to-cyan chain of seven shrinking blobs chases the pointer (or a figure-eight when idle). Each blob springs toward where the head was a moment ago, so the chain lags, stretches and swings; an SVG goo filter merges overlapping blobs into one liquid creature.

**Use it for:** playful cursors, hero mascots, interactive empty states.

## Prompt

```
Build a gooey spring trail with Motion 14.9.0 (const { animate } = await import("https://cdn.jsdelivr.net/npm/motion@14.9.0/+esm")).
- Seven absolutely positioned circles (54px down to 14px, lime → cyan) in a container with filter: url(#goo), where #goo is feGaussianBlur stdDeviation 9 → feColorMatrix alpha row "0 0 0 22 -10" → feComposite atop SourceGraphic.
- Keep a history of head positions (pointer, or a Lissajous path when idle). 20 times a second, push the head into history and call animate(blob, { x, y }, { type: "spring", stiffness: 260, damping: 18, mass: 0.9 + i·0.08 }) with blob i chasing history[i·2].
- Retargeting a running Motion spring preserves its velocity; that's what makes the chain swing instead of snapping.
- Pause the loop off-screen. Reduced motion: blobs rest in the centre.
Start from templates/spring-goo-trail/index.html.
```

## Knobs

| Knob | Effect |
|---|---|
| `stiffness`, `damping` | Snappy (400/30) vs. floppy (150/10) |
| `mass` per blob | Heavier tail lags more |
| `22 -10` in the colour matrix | Goo threshold: higher = sharper merge edge |

## Pitfalls

- Retarget at a fixed rate (here 20×/s), not every pointermove: hundreds of new springs per second waste work.
- The goo filter works on alpha, so blobs need solid fills; text inside the filtered layer gets melted too.
