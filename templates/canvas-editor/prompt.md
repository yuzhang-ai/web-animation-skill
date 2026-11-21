# Canvas editor

**Effect:** a dark canvas with a dot grid and four objects (a lime rounded card, a violet circle, a coral star, an italic text). Clicking one selects it with a dashed frame and handles to rotate and resize; dragging shows cyan centre guides that snap; on release the object springs onto the grid. While idle, it demos itself: objects get selected and glide, turn and resize.

**Use it for:** editors, whiteboards, product configurators, sticker and collage tools, seat or floor planners.

## Prompt

```
Build an interactive canvas editor with Konva 10.9.1 (global Konva).
- Stage sized to the container (ResizeObserver → stage.size()), a non-listening background layer with a dot grid (24px), and a main layer with draggable shapes (Rect with offset at its centre, Circle, Star, Text).
- Selection: one Konva.Transformer (keepRatio, rotationSnaps every 45°, styled anchors). stage.on("pointerdown"): select e.target, or clear when the stage itself is clicked. Move the selected node and the transformer to the top.
- dragmove: if within 10px of the stage centre, snap to it and show a dashed guide line. dragend: hide guides and new Konva.Tween({ node, x: snap(x), y: snap(y), duration: 0.45, easing: Konva.Easings.ElasticEaseOut }).play().
- Hover: scale ×1.04 with node.to({ duration: 0.15 }).
- Optional idle demo: every 1.6s select a shape and tween its position / rotation / scale with onUpdate: () => tr.forceUpdate(). Stop it on the first user input and when off-screen.
Start from templates/canvas-editor/index.html.
```

## Knobs

| Knob | Effect |
|---|---|
| `GRID` | Snap step |
| `rotationSnaps` | Angles the rotate handle sticks to |
| `ElasticEaseOut` | Settle feel; `StrongEaseOut` for no bounce |

## Pitfalls

- When a tween changes a selected node, call `transformer.forceUpdate()` or the handles lag behind.
- Transformer resizes by changing scale, not width: read `scaleX()` when saving sizes.
- Put the grid on a `listening: false` layer so it never steals clicks.
