# Stagger ripple grid

**Effect:** a square grid of small rounded tiles. A ripple spreads from one tile outward: each tile jumps up, grows, spins and flashes an accent colour, then settles back with an elastic wobble. Tiles near the source move most. Hovering starts a ripple under the pointer; when idle it ripples from random tiles.

**Use it for:** interactive hero backgrounds, empty states, playful loading or "thinking" states.

## Prompt

```
Build a ripple grid with Anime.js v4.5.0 (const { animate, stagger, utils } = await import("https://cdn.jsdelivr.net/npm/animejs@4.5.0/+esm")).
- An N×N CSS grid (N = 11) of <i> tiles.
- ripple(from): one animate(dots, {...}) call with keyframe arrays: translateY to -26·amp², scale to 0.55 + 1.1·amp², rotate to 90·amp (220ms outQuad), then back to 0 / 1 / 0 (950ms "outElastic(1, .4)"); backgroundColor to an accent then back. amp = 1 − distance-from-source / diagonal, as a function value (el, i) => ….
- delay: stagger(60, { grid: [N, N], from }) makes it a wave from that tile.
- pointerover on the grid: ripple from the hovered tile (throttle to 180ms). Idle: ripple from utils.random() every 1.7s while on screen.
- Reduced motion: no ripples.
Start from templates/stagger-ripple-grid/index.html.
```

## Knobs

| Knob | Effect |
|---|---|
| `stagger(60, …)` | Wave speed: ms per grid step |
| `outElastic(1, .4)` | Settle wobble (amplitude, period) |
| `N` | Grid size; above ~20×20 use canvas instead |

## Pitfalls

- Anime.js v4 has no default export and no `targets` key: it's `animate(targets, params)`; easings are `outElastic`, not `easeOutElastic`.
- Throttle pointer ripples: retriggering every pointerover on 121 tiles floods the main thread.
