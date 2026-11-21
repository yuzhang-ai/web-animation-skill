# Shape morph UI

**Effect:** a single rounded shape stays on screen and springs from one UI component into the next: Generate button → loader → check → dynamic island → music player → toggle → ⌘K command bar → toast → back to the button. Each change lands on a 120 BPM beat; the shape moves first and the content fades in 180ms later.

**Use it for:** a product hero loop, or any real state chain such as submit → loading → done → toast.

## Prompt

```
Build a "one shape" UI morph with CSS transitions and a linear() spring (no library).
- One element (.shape) with overflow hidden whose width, height, border-radius and background come from CSS variables --w --h --r --c. Transition width/height/border-radius over 620ms with
  --spring: linear(0, 0.13 3%, 0.5 9%, 0.86 16%, 1.04 23%, 1.08 28%, 1.06 34%, 1 44%, 0.99 53%, 1); color over 240ms ease.
- Inside, one .face per state, absolutely centred and laid out at its final size so text never reflows. Inactive faces: opacity 0, scale .92, blur 4px. The active face (matched by data-state on the shape) fades in with a 180ms delay so the shape leads.
- A STATES array holds { id, w, h, r, c, beats }. A timer advances at 120 BPM (500ms per beat). Click / Enter advances manually. Provide a Pause button and stop the timer when the tab is hidden.
- Reduced motion: no autoplay, transitions 0ms, stop inner loops.
Start from templates/shape-morph-ui/index.html.
```

## Knobs

| Knob | Effect |
|---|---|
| `STATES` | The story. Keep each state's size different enough that the morph reads |
| `--spring`, `--morph` | Bounce and speed of the morph; see spec/motion.md for other spring curves |
| `BPM`, `beats` | Rhythm. Hold states with more content (player, command bar) for 3 beats |
| face `transition-delay` | Gap between shape and content; 120–220ms reads as "shape leads" |

## Pitfalls

- This animates `width`/`height` (layout), which is acceptable for **one** isolated element. For many, morph with `clip-path: inset(... round r)` or FLIP scale instead.
- Faces must not size with the shape, or text wraps and jumps during the morph. Give them fixed widths.
- A loop longer than 5s needs a pause control (WCAG 2.2.2).
