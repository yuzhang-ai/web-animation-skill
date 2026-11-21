# Particle fireworks

**Effect:** a dark night sky. A glittering lime-and-cyan trail follows the pointer (or wanders on its own), and every second a firework bursts: 70–110 sparks fly out in a circle, fall with gravity, shrink and fade, leaving streaks because each frame only partly erases the last.

**Use it for:** celebrations (signup done, payment complete), hero backgrounds, cursor trails.

## Prompt

```
Build pointer trails and fireworks with Proton 7.1.5 (classic <script> build/proton.min.js; the class is window.Proton.default, the named classes are on window.Proton).
- Canvas sized to the container × DPR. new P.default(); a CanvasRenderer whose onProtonUpdate paints rgba(8,9,12,0.24) over the canvas (source-over) and then sets globalCompositeOperation "lighter", so particles leave trails and glow where they overlap.
- Trail emitter: Rate(Span(2, 4), 0.02), Radius, Life(0.6, 1.4), Velocity(Span(0.3, 1.2), Span(0, 360), "polar"), Alpha(1, 0), Scale(1, 0.2), Color([lime, cyan, white]); ease its position toward the pointer every frame.
- burst(x, y): a new Emitter with Rate(Span(70, 110), 0), Velocity(Span(1.6, 4.2), Span(0, 360), "polar"), Gravity(1.6), Alpha, Scale, Color(from, [to…]); emit("once", true) so it destroys itself. Burst on pointerdown and every 1.1s.
- Call proton.update() in your rAF loop (Proton has no loop of its own); stop it off-screen. Reduced motion: one frozen burst.
Start from templates/particle-fireworks/index.html.
```

## Knobs

| Knob | Effect |
|---|---|
| fade alpha `0.24` | Lower = longer trails (keep ≥ 0.06) |
| `Gravity(1.6)` | How fast sparks fall |
| `Rate(Span(70, 110), 0)` | Sparks per burst |

## Pitfalls

- `new Proton()` fails with the UMD build: the class is `Proton.default`.
- Plain `emit("once")` leaves the emitter alive forever; use `emit("once", true)` or remove it.
- Positions are in canvas pixels: multiply pointer coordinates by DPR.
