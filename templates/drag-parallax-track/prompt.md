# Drag parallax track

**Effect:** a row of tall images sits across the middle of the screen. Dragging (or scrolling, or arrow keys) slides the row with a long ease-out glide, and each image's content pans the opposite way inside its frame, so the pictures look deeper than the page.

**Use it for:** portfolios, galleries, case-study strips. Works best full-screen with 6–12 images.

## Prompt

```
Build a full-screen draggable image track with inner parallax using the Web Animations API (no library).
- A fixed, overflow-hidden stage. The track is absolutely positioned at left: 50%, top: 50%, display: flex, gap 4vmin.
- Track position is a percent from 0 (first image at centre) to -100 (last image at centre): transform translate(P%, -50%).
- Images are 40vmin × 56vmin, object-fit: cover; object-position runs from 100% to 0% as P goes 0 → -100 (object-position: `${100 + P}% center`). That opposite pan is the parallax.
- Every input calls render(P): el.animate({ transform }, { duration: 1200, fill: "forwards", easing: cubic-bezier(0.16, 1, 0.3, 1) }) on the track and the same for objectPosition on each image. Retargeting a new animation each move gives the glide for free.
- Pointer drag: dragging half the window width = 100%. Use setPointerCapture. Also wheel (preventDefault, non-passive) and ArrowLeft/Right that step one image.
- Reduced motion: duration 0.
Start from templates/drag-parallax-track/index.html.
```

## Knobs

| Knob | Effect |
|---|---|
| `duration: 1200` + easing | Weight of the glide. 600ms feels light, 1800ms feels heavy |
| `innerWidth / 2` | Drag sensitivity |
| image `40vmin × 56vmin` | Portrait frames show the pan best; landscape frames weaken it |

## Pitfalls

- Clip the stage (`position: fixed; overflow: hidden`) or the track widens the page and mobile scrolls sideways.
- Add `-webkit-user-drag: none` and `draggable=false` on images, or the browser starts a native image drag.
- `touch-action: pan-y` keeps vertical page scroll working on phones while horizontal drags go to the track.
