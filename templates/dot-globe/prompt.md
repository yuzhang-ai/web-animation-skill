# Dot globe

**Effect:** a dark, dotted globe turns slowly. City markers glow in the accent color, arcs connect them, and each city's label fades and blurs out as it rotates behind the globe. Dragging flings it with inertia.

**Use it for:** hero sections for global products (CDN, payments, logistics), "customers in 90 countries" sections.

## Prompt

```
Add a rotating dotted globe with COBE 2.0.1 (import createGlobe from "https://cdn.jsdelivr.net/npm/cobe@2.0.1/+esm").
- Square canvas sized by CSS; pass width/height = CSS size × devicePixelRatio (capped at 2).
- Options: dark 1, diffuse 1.2, mapSamples 16000, mapBrightness 5, theta 0.28, colors as 0–1 RGB arrays, markers [{ id, location: [lat, lng], size }], arcs [{ from, to }], arcColor, arcWidth 0.6, arcHeight 0.28.
- COBE 2 has NO onRender option. Run your own requestAnimationFrame loop and call globe.update({ phi, width, height }). Auto-rotate phi by 0.0035/frame; pointer drag adds to phi and leaves a decaying velocity (×0.95 per frame).
- Labels: for a marker with id "sf", position a label with position-anchor: --cobe-sf; bottom: anchor(top); left: anchor(center); and opacity: var(--cobe-visible-sf, 0) so it hides behind the globe. Hide labels where anchor positioning is unsupported.
- Fade the canvas in after the first frame. Pause the loop off-screen (IntersectionObserver) and when the tab is hidden. Reduced motion: no auto-rotation, drag still works.
Start from templates/dot-globe/index.html.
```

## Knobs

| Knob | Effect |
|---|---|
| `baseColor`, `markerColor`, `glowColor`, `arcColor` | Palette, as `[r, g, b]` from 0 to 1 |
| `mapBrightness`, `mapSamples` | Land dot brightness and density |
| `theta` | Tilt toward the viewer; 0.2–0.35 shows the northern hemisphere |
| `0.0035` | Idle rotation speed |

## Pitfalls

- The COBE README and many tutorials still show `onRender(state)`. In 2.x it is silently ignored and the globe never moves. Use `globe.update()`.
- Forgetting the DPR multiplier gives a blurry globe; uncapped DPR on 3× phones costs a lot of fill rate.
- Call `globe.destroy()` when the component unmounts.
