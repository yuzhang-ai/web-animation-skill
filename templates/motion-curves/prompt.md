# Motion curves

**Effect:** nine lanes, one ball each, all launched at once over the same distance: linear, ease out, ease in, ease in-out, hard stop (with an impact squash), overshoot, anticipation, spring and bounce. Watching them together makes the difference between curves obvious. Click a lane to replay it alone.

**Use it for:** picking an easing, showing a designer the options, and copying spring or bounce curves into plain CSS. The table of when to use which is in [spec/motion.md](../../spec/motion.md).

## Prompt

```
Pick the motion curve from spec/motion.md section 1 by what the object is doing (entering, leaving, moving A→B, hitting a wall, popping in, winding up, following a gesture, landing).
To use a spring or bounce in CSS or WAAPI without a library, copy springToLinear(k, c, m) / bounceToLinear() from templates/motion-curves/index.html:
- springToLinear simulates a damped spring from 0 to 1 (dt 1/120) until it settles, samples ~60 points and returns { easing: "linear(...)", duration }. Use that duration with the easing.
- bounceToLinear samples the classic three-bounce ease-out into linear().
For a "hard stop", use cubic-bezier(0.55, 0, 1, 0.45) and then a 160ms squash (scale 0.8 1.15 with transform-origin on the impact side) so the stop reads as an impact.
```

## Knobs

| Knob | Effect |
|---|---|
| `springToLinear(k, c, m)` | See the spring presets table in spec/motion.md §3 |
| `D` | Shared duration for the non-physics lanes |
| `CURVES` | Add your product's own curves to compare them |

## Pitfalls

- A spring's duration comes from its physics. Squeezing a slow spring into 300ms with `linear()` cuts off the settle and it snaps at the end.
- `cubic-bezier` with y outside 0–1 (overshoot, anticipation) moves past the start or end: leave room, or it gets clipped by `overflow: hidden`.
- `linear()` needs Chrome 113+, Safari 17.2+, Firefox 112+. Older browsers fall back to `linear`, so motion still finishes in place.
