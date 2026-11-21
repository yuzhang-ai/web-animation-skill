# Ink seam transition

**Effect:** the straight edge between a dark hero and the light section below it comes alive as you scroll: hero colour bleeds down into the paper in ragged lobes and thin fibre runs, the paper eats back up into the hero between them, and the ink pools darker at its rim. Scrolling fast feathers it wider; scrolling back draws it in.

**Use it for:** the hero → content boundary of studio, editorial or brand sites. One per page.

## Prompt

```
Add an "ink bleed" seam between a dark hero and a light section, with a WebGL 2 fragment shader on a strip that straddles the hero's bottom edge (no library).
- The strip is an empty, pointer-events:none, absolutely positioned box from (hero bottom − 28vh) to (hero bottom + 30vh), with a canvas filling it (DPR capped at 1.5). One full-screen triangle, the shader gets px coordinates with y down.
- Uniforms: uSize, uEdge (= the 28vh above), uTravel (innerHeight − hero.bottom), uProgress (travel / innerHeight, clamped 0–1), uVelocity (scroll speed px/s, smoothed ×0.3 per frame, 0 under 2), uPaper and uHero (the page and the hero's bottom colour, read from CSS variables).
- Ink field g = (fbm-warped lobes − 0.42)·2.8 + (fine fray − 0.5)·0.35 + pow(fbm runs, 3)·0.9, drifting with uTravel. Reach = down·tanh(g·spread·0.9) below, −up·tanh(−g·spread·0.5) above, spread = smoothstep(0, 0.35, progress) + min(|v|/3000, 0.35). Feather the edge by 0.8 + |v|·0.004 px.
- Paint only the difference from the page under it: paper colour where it cuts up into the hero, hero colour (×(1 − 0.45·rim) for the darker rim) where it runs into the paper, transparent elsewhere. Premultiplied alpha.
- The hero background must be exactly uHero at its bottom (solid for the last ~45%) or a line shows at the edge.
- Draw in a rAF loop only when the strip is on screen and travel/velocity changed. Reduced motion or no WebGL 2: skip it, the plain edge remains.
Start from templates/seam-transition/index.html.
```

## Knobs

| Knob | Effect |
|---|---|
| `ROOM.up / down` | How far the ink may reach; keep it clear of text on both sides |
| `/ 300.0` in `q` | Lobe size; smaller number = bigger blobs |
| `runs` weight `0.9` | How much the thin vertical fibres show |
| `0.45 * rim` | Darkness of the pooled rim |

## Pitfalls

- If the hero's colour at the edge doesn't match `uHero` exactly, a 1px seam line shows. Make the hero solid near its bottom, or sample a texture like the Codrops original does.
- Don't redraw every frame when nothing moved: compare travel and velocity first.
- Smooth-scroll libraries move content with transforms: read the position from the library, not `scrollY`.
