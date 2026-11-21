# Flow field hero

**Effect:** thousands of thin coloured strokes (lime, violet, cyan, coral) stream across a dark hero like wind over a map, curling through a slowly changing field. Trails glow where they overlap. The pointer, or an invisible wandering cursor when idle, stirs a vortex that swirls nearby particles around it.

**Use it for:** hero backgrounds, landing pages, generative brand art behind big type.

## Prompt

```
Build a flow-field particle hero on a 2D canvas (no library).
- Canvas sized to the hero × DPR (≤ 2). Particle count = min(2600, area / 420); each has x, y, life, colour index and speed.
- field(x, y) = sum of three sines/cosines of x, y and time → an angle; velocity = (cos a, sin a)·speed·1.5.
- Vortex: within radius R = 0.32·min(W, H) of the (eased) pointer, add a tangential push (−dy, dx)/d·f·5 plus a little outward push, f = (1 − d/R)². When idle, the pointer target follows a slow Lissajous path.
- Each frame: fill rgba(bg, 0.085) with source-over (fades old trails), switch to "lighter", build one Path2D per colour with moveTo/lineTo for every particle's step, stroke each path once. Respawn particles that age out or leave.
- Pause the loop off-screen. Reduced motion: run 90 steps once for a still frame.
Start from templates/flow-field-hero/index.html.
```

## Knobs

| Knob | Effect |
|---|---|
| fade alpha `0.085` | Trail length (keep ≥ 0.06 or 8-bit ghosts remain) |
| `field()` constants | Scale and drift of the currents |
| `R`, `5`, `1.2` | Vortex size, swirl and push |

## Pitfalls

- One `stroke()` per particle is ~2,600 draw calls; batch into one Path2D per colour.
- Setting canvas width/height clears it; repaint the background on resize.
- Alpha fades below ~0.06 never fully clear in 8-bit and leave grey ghosts.
