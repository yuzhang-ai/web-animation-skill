# Choosing an animation library

## Decision matrix

| Criteria | GSAP | Framer Motion | Motion One | Anime.js | Rive | Lottie | D3.js | Flubber | Konva | Three.js | CSS |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Framework required | None | React | None | None | None | None | None | None | React | None | None |
| Scroll-driven | ✅ Best | 🟡 Manual | ✅ | 🟡 Manual | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | 🟡 Limited |
| Enter/exit (React) | 🟡 | ✅ Best | 🟡 | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| SVG morphing | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Data viz | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ Best | ❌ | ❌ | ❌ | ❌ |
| Design-tool export | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| State machine | ❌ | 🟡 Variants | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| 3D scenes | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | 🟡 | ❌ | ❌ | ✅ | 🟡 |
| Canvas 2D | 🟡 | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |
| Bundle size | ~60KB | ~30KB | ~3KB | ~17KB | ~250KB | ~50KB | ~250KB | ~10KB | ~50KB | ~600KB | 0 |
| Learning curve | Medium | Easy | Easy | Easy | Medium | Easy | Steep | Easy | Medium | Steep | Low |

## Decision flow

```
Scroll-driven?
  ├─ Yes → GSAP + ScrollTrigger
  └─ No → React project?
             ├─ Yes → Component transitions?
             │         ├─ Yes → Framer Motion
             │         └─ No → Need animate presence / layout animations?
             │                   ├─ Yes → Framer Motion
             │                   └─ No → Motion One (lighter)
             └─ No → What are you animating?
                       ├─ SVG shapes → Anime.js / Flubber
                       ├─ Design file → Rive / Lottie
                       ├─ Data charts → D3.js
                       ├─ Canvas drawing → Konva
                       ├─ 3D scene → Three.js
                       └─ Simple UI → CSS Keyframes / Motion One
```

## Bundle size priority

When bundle size matters, prefer in this order:
1. CSS Keyframes (0 KB)
2. Motion One (~3 KB)
3. Anime.js (~17 KB)
4. Framer Motion (~30 KB)
5. GSAP (~60 KB)
