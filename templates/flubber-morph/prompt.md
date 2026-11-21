# Flubber morph

**Effect:** a single gradient shape keeps transforming: circle → five-point star → splits into six dots → the dots merge into a heart → squircle → circle, each morph about 1s with a short hold, the gradient colours shifting with each shape.

**Use it for:** icon state changes, logo reveals, playful illustrations, anything where one shape becomes another.

## Prompt

```
Morph between unrelated SVG shapes with Flubber 0.4.2 (global flubber).
- Describe shapes as point rings ([[x, y], …]); multi-part shapes as arrays of rings.
- Build interpolators once: flubber.interpolate(a, b, { maxSegmentLength: 2 }) for one → one, flubber.separate(one, many, { single: true }) to split, flubber.combine(many, one, { single: true }) to merge (single: true returns one path string with several subpaths).
- In a rAF loop, set path d = interpolator(ease(t)) with an ease-in-out quint, 1s per morph + 0.55s hold; switch gradient stop colours (CSS transition on stop-color) at each step.
- Stop the loop off-screen. Reduced motion: show one shape.
Start from templates/flubber-morph/index.html.
```

## Knobs

| Knob | Effect |
|---|---|
| `maxSegmentLength` | Smaller = smoother morph, more points |
| `D`, `HOLD` | Morph and pause durations |

## Pitfalls

- Create interpolators once, outside the loop: they're expensive to build and cheap to call.
- For one → many without `single: true` you get an array of paths and need one <path> per piece.
