# Motion path timeline

**Effect:** a dashed curve links five labelled steps. A glowing comet travels the curve from step to step; behind it a gradient trail is painted on, and each node pops (grows, turns lime, sends out a ring) as the comet arrives. Then the trail wipes away and the loop restarts.

**Use it for:** how-it-works and process sections, onboarding steps, roadmaps.

## Prompt

```
Animate a step-by-step process diagram with GSAP 3.15.1 MotionPathPlugin + DrawSVGPlugin (both free; registerPlugin).
- Build one smooth SVG path through the step positions (Catmull-Rom → cubic Bézier). Draw it twice: a dashed base and a gradient "glow" copy starting at drawSVG "0% 0%".
- Measure each node's fraction along the path (sample getPointAtLength) so the comet stops exactly on it.
- One timeline, repeat -1: for each segment, tween the comet with motionPath { path, align, alignOrigin [0.5,0.5], start: frac[i-1], end: frac[i] } (0.85s power2.inOut) and the glow to drawSVG "0% frac[i]%" at the same time; then pop the node: r 7→9 back.out(3), fill lime, plus a ring r 8→34 fading out.
- At the end: comet scales up and fades, glow wipes to "100% 100%", nodes reset with a 0.06 stagger.
- Pause the timeline off-screen. Reduced motion: no timeline, show the full trail and all nodes lit.
Start from templates/motion-path-timeline/index.html.
```

## Knobs

| Knob | Effect |
|---|---|
| `P`, `names` | Step positions and labels (viewBox units) |
| segment duration `0.85` | Travel speed between steps |
| `back.out(3)` | How hard each node pops |

## Pitfalls

- `start`/`end` in motionPath are fractions of the whole path, not segment indices. Measure them, or the comet stops between nodes.
- DrawSVG on a path with a dash array draws the dashes; keep the dashed base and the drawn glow as separate paths.
