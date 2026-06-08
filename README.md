# Web Animation Skill

A comprehensive skill for AI coding assistants (Claude Code, Codex, Cursor, GitHub Copilot, etc.) covering best practices for interactive web animations across 12+ libraries.

## What's covered

| Library | Rule File | Use Case |
|---------|-----------|----------|
| **GSAP** | [gsap.md](rules/gsap.md) | ScrollTrigger, timelines, stagger |
| **Framer Motion** | [framer-motion.md](rules/framer-motion.md) | React enter/exit, layout, gestures |
| **Motion One** | [motion-one.md](rules/motion-one.md) | Lightweight scroll/inView (~3KB) |
| **Anime.js** | [animejs.md](rules/animejs.md) | SVG/CSS micro-animations |
| **Rive** | [rive.md](rules/rive.md) | State machine animations |
| **Lottie** | [lottie.md](rules/lottie.md) | AE-exported JSON playback |
| **D3.js** | [d3.md](rules/d3.md) | Data visualization transitions |
| **Flubber** | [flubber.md](rules/flubber.md) | SVG path morphing |
| **Konva** | [konva.md](rules/konva.md) | Canvas 2D rendering (React) |
| **Three.js** | [three-js.md](rules/three-js.md) | 3D scenes, R3F, post-processing |
| **CSS Keyframes** | [css-keyframes.md](rules/css-keyframes.md) | Pure CSS animations |
| **Choosing** | [choosing-library.md](rules/choosing-library.md) | Decision matrix & flowchart |
| **Scroll** | [scroll-animations.md](rules/scroll-animations.md) | Scroll-driven patterns |
| **Performance** | [performance.md](rules/performance.md) | 60fps, will-change, profiling |

## Install

```bash
npx skills add yuzhang-ai/web-animation-skill
```

## Structure

```
SKILL.md              ← Main entry: quick starts, library picker, golden rules
rules/
├── choosing-library.md   ← When to use which library
├── gsap.md
├── framer-motion.md
├── motion-one.md
├── animejs.md
├── rive.md
├── lottie.md
├── d3.md
├── flubber.md
├── konva.md
├── three-js.md
├── css-keyframes.md
├── scroll-animations.md
└── performance.md
```

## Golden rule

> Prefer `transform` and `opacity` for animation performance. Avoid animating `width`, `height`, `top`, `left` — they trigger layout reflow.

## Related

- [Remotion Best Practices](https://github.com/remotion-dev/skills) — video rendering in React
- This skill focuses on **real-time web interactivity**, not video rendering.

## License

MIT
