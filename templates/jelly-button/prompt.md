# Jelly button

**Effect:** pressing a button squashes it (wider and shorter) in about 110ms. Releasing lets it wobble back to rest like jelly. The wobble is a real damped spring, so a long press wobbles more than a quick tap, and three tunings show soft, balanced and firm.

**Use it for:** primary CTAs, like/favourite buttons, playful consumer UI. Use the firm tuning for professional tools.

## Prompt

```
Make press-and-release "jelly" buttons with the Web Animations API and a tiny spring solver (no library).
- pointerdown / Space / Enter: animate scale to `${1+s} ${1-s}` (s = 0.10–0.16) in 110ms, ease-out, fill forwards.
- pointerup / pointerleave / keyup: read the current scale from getComputedStyle (it reflects the running animation; "none" means 1), cancel the press animation, then simulate a damped spring from that deformation d0 to 0 (x'' = -k·x - c·v, dt 1/60, stop when |x| and |v| are tiny). Play the samples as keyframes { scale: `${1+d} ${1-d}` } with easing linear and duration = samples × 16.7ms.
- Tunings: soft k 180 c 9, balanced k 320 c 16, firm k 520 c 26.
- Reduced motion: skip both animations; the button still works.
Start from templates/jelly-button/index.html.
```

## Knobs

| Knob | Effect |
|---|---|
| `data-stiffness` (k) | Higher = faster wobble |
| `data-damping` (c) | Higher = fewer wobbles. Critical damping is 2√k: at or above it there's no overshoot |
| `data-squash` | Press deformation. Above 0.2 looks broken |

## Pitfalls

- Animate `scale` with two values (x y), opposite directions, so the button keeps its "volume". Scaling both axes down reads as a shrink, not a squash.
- Start the release spring from the **current** scale, not the full squash, or a quick tap snaps to full squash before wobbling.
- `pointerleave` must release too, or dragging off the button leaves it squashed.
- See spec/motion.md for when to use springs vs. fixed durations.
