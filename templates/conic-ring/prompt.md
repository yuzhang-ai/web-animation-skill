# Conic ring

**Effect:** a thin rainbow ring (lime → cyan → violet → coral) spins around a soft glow, and inside it a gradient blob slowly morphs between organic shapes while counter-rotating. Pure CSS.

**Use it for:** AI assistant avatars, loading and "thinking" states, status orbs, animated borders on a featured card.

## Prompt

```
Make a spinning conic ring around a morphing blob in pure CSS.
- Register @property --a { syntax: "<angle>"; inherits: false; initial-value: 0deg } so the angle interpolates; @keyframes spin-a { to { --a: 360deg } }.
- Ring: a circle with background conic-gradient(from var(--a), lime, cyan, violet, coral, lime), masked to a 5px band with mask: radial-gradient(farthest-side, transparent calc(100% - 6px), #000 calc(100% - 5px)). Animate spin-a 2.6s linear infinite.
- Glow: the same gradient, blur(22px), opacity .55, masked to the outer band.
- Blob: 62% size, its own conic gradient with spin-a reversed (9s), plus a 7s morph keyframe over border-radius (e.g. 42% 58% 70% 30% / 45% 45% 55% 55% → 70% 30% 46% 54% / …) with small rotate/scale.
- Reduced motion: animation none (it still looks finished).
Start from templates/conic-ring/index.html.
```

## Knobs

| Knob | Effect |
|---|---|
| gradient stops | The palette |
| `calc(100% - 6px)` | Ring thickness |
| `2.6s`, `7s`, `9s` | Spin, morph and counter-spin speeds |

## Pitfalls

- Without `@property`, `--a` is a string and the gradient jumps instead of rotating.
- Animating a gradient repaints every frame; fine for one orb, don't cover large areas with it.
