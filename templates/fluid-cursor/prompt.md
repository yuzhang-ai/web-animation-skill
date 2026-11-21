# Fluid cursor

**Effect:** moving the pointer pushes coloured ink through a real fluid: it swirls into curls, folds over itself and slowly fades. Clicking drops a burst. The canvas is transparent where there's no ink, so the page shows through.

**Use it for:** hero backgrounds of creative and agency sites, 404 pages, interactive splash screens. It is GPU-heavy: one per page, never behind long-form reading.

## Prompt

```
Add a pointer-driven fluid simulation over the page with WebGL 2, based on Pavel Dobryakov's WebGL Fluid Simulation (MIT, keep the notice).
- Fixed full-screen canvas, pointer-events none, alpha true. Requires EXT_color_buffer_float (render to RGBA16F/RG16F/R16F); if missing, or under reduced motion, don't start.
- Double-buffered half-float framebuffers: velocity (RG, 128 short side), dye (RGBA, 1024), pressure (R), plus divergence and curl (R).
- Each frame (dt ≤ 1/60): curl → vorticity confinement (CURL 28) → divergence → pressure ×0.8 → 20 Jacobi pressure iterations → subtract pressure gradient → advect velocity (dissipation 0.25) → advect dye (dissipation 1.2).
- pointermove: one splat at the pointer with velocity = pointer delta × 6000 (aspect-corrected) and a colour from a slow hue cycle at low brightness (~0.16). pointerdown: six random splats.
- Display pass: normal-based shading (×0.7–1.0), linear → gamma, alpha = max(r, g, b), blend ONE / ONE_MINUS_SRC_ALPHA, so empty areas are see-through.
- Seed 5 splats at start so the first frame isn't empty.
Start from templates/fluid-cursor/index.html.
```

## Knobs

| Knob | Effect |
|---|---|
| `CURL` | Swirliness. 0 = smooth smoke, 40+ = turbulent |
| `DENSITY_DISSIPATION` | How long trails last. 0.5 long, 3 short |
| `SPLAT_RADIUS`, `SPLAT_FORCE` | Brush size and push |
| `palette()` | Hue band; keep brightness ≤ 0.2 or overlapping ink clips to white |
| `SIM_RES` / `DYE_RES` | Quality vs. GPU cost. Drop to 64 / 512 on phones |

## Pitfalls

- WebGL 2 can only render into float textures with `EXT_color_buffer_float`. Without it, framebuffers are incomplete and the screen stays black.
- Swap read/write buffers after every pass that writes a double buffer, or a pass reads its own output.
- Recreating framebuffers on resize clears the ink; that's acceptable, but debounce it.
- It runs every frame. Pause it when off-screen; rAF already pauses in hidden tabs.
