# Iridescent blob

**Effect:** a glossy sphere whose surface slowly boils into soft lumps, shimmering through violet, cyan and lime depending on the viewing angle (iridescence), with a lime rim light. Two thin coloured rings orbit it and a sparse star field drifts behind. Moving the pointer tilts and spins it and makes the surface boil harder.

**Use it for:** hero visuals, AI and tech brand moments, loading screens. One per page; it's GPU work.

## Prompt

```
Render an iridescent noise blob with Three.js 0.187.0 (import map "three" → jsDelivr build/three.module.js).
- IcosahedronGeometry(1, 64) with a ShaderMaterial. Vertex shader: 3D simplex noise (Ashima snoise) displaces each vertex along its normal, disp = snoise(n·uFreq + uTime·0.35)·uAmp; recompute the normal from two nearby displaced points so lighting follows the lumps.
- Fragment shader: fresnel = pow(1 − dot(n, v), 2); colour = 0.5 + 0.5·cos(2π(vec3(0, .33, .67) + fresnel·0.85 + disp·1.8 + uTime·0.05)) (cosine palette), plus diffuse, a sharp specular and a lime rim pow(fresnel, 5).
- Add two thin TorusGeometry rings (violet, cyan, opacity .55) and 900 additive Points as stars.
- Pointer sets a target; ease toward it (×0.05/frame) and use it for rotation and uAmp (0.22 + 0.1·distance).
- renderer.setAnimationLoop(frame) while visible, setAnimationLoop(null) off-screen. DPR ≤ 2. Reduced motion: render one frame.
Start from templates/iridescent-blob/index.html.
```

## Knobs

| Knob | Effect |
|---|---|
| `uAmp`, `uFreq` | Lump height and size |
| `vec3(0.0, 0.33, 0.67)` | Cosine-palette phase: shifts the colour cycle |
| `IcosahedronGeometry(1, 64)` | Detail; 32 is enough on phones |

## Pitfalls

- Displacing vertices without recomputing normals leaves the lighting of a smooth sphere on a lumpy shape.
- Use `renderer.setAnimationLoop`, and stop it off-screen; a hidden WebGL loop still burns GPU.
