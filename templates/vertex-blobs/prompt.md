# Vertex blobs

**Effect:** three soft blobs (lime, violet, cyan) drift in loose orbits, their outlines wobbling organically, and where they overlap the colours add up (screen blend). Small satellites circle a slowly turning dashed ring. The pointer pulls the blobs off-centre by different amounts.

**Use it for:** generative hero art, ambient brand backgrounds, voice or audio visualisers.

## Prompt

```
Draw wobbling vertex blobs with Two.js 0.8.24 (global Two).
- new Two({ type: Two.Types.svg, fitted: true, autostart: false }).appendTo(host). Put everything in a group centred and scaled to the stage on each update.
- Three makeCircle(0, 0, 52, 30) blobs (30 vertices each); keep a clone of the rest vertices. Every update, scale each vertex: rest × (1 + 0.09·sin(t·2.2 + i·0.7 + phase) + 0.06·sin(t·1.3 + i·0.25 + 2·phase)), and move the blob on a small orbit plus an eased pointer offset.
- Set mix-blend-mode: screen on each blob's renderer element (b.renderer.elem) after the first two.update().
- Add a dashed orbit circle and four satellites. two.play() while visible, two.pause() off-screen. Reduced motion: one still update.
Start from templates/vertex-blobs/index.html.
```

## Knobs

| Knob | Effect |
|---|---|
| vertex count `30` | More = smoother outline |
| `0.09` / `0.06` | Wobble strength |
| `Two.Types.svg` | Switch to canvas or webgl for many blobs |

## Pitfalls

- `renderer.elem` only exists after the first render: call `two.update()` before styling it.
- Mutating vertices every frame on the SVG renderer rewrites path strings; above ~50 blobs use `Two.Types.webgl`.
