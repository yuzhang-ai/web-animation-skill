# Lottie like button

**Effect:** a heart icon: pressing it squashes the grey outline, then a coral heart pops out past full size and settles, eight rays shoot out and erase themselves (trim paths) and small dots fly outward and fade. Unliking shrinks the heart back to the outline. A frame scrubber shows you can stop on any frame of the timeline.

**Use it for:** like, favourite and bookmark buttons, success states, and any icon animation a designer made in After Effects.

## Prompt

```
Play an After Effects (Lottie) icon animation with lottie-web 5.13.0 (lottie_light.min.js, SVG renderer) and control it from code.
- lottie.loadAnimation({ container, renderer: "svg", loop: false, autoplay: false, animationData }) (or path: "like.json" for a designer's file).
- One file holds both transitions: frames 0–40 = like, 40–60 = unlike. On click toggle aria-pressed and call anim.playSegments(liked ? [0, 40] : [40, 60], true).
- Scrubbing: a range input 0–59 calls anim.goToAndStop(frame, true); keep it in sync on "enterFrame" with anim.currentFrame.
- Wrap the player in a real <button aria-pressed> so it's keyboard- and screen-reader-accessible.
- Reduced motion: goToAndStop on the final liked frame instead of playing.
Start from templates/lottie-like-button/index.html (its buildHeart() shows the JSON structure: shape layers, trim paths, keyframed scale/opacity).
```

## Knobs

| Knob | Effect |
|---|---|
| segments `[0, 40]` / `[40, 60]` | Must match the designer's marker frames |
| `renderer` | "svg" for icons, "canvas" for big or busy scenes |
| `setSpeed()` | Speed up without re-exporting |

## Pitfalls

- `lottie_light` has no expressions; if the designer used expressions, load the full `lottie.min.js`.
- `playSegments(seg, true)` jumps immediately; with `false` it queues after the current segment.
- Lottie draws the last layer at the back: layer order in JSON is top-first.
- After `playSegments`, `goToAndStop(frame)` counts from the segment's start. Call `setSegment(0, totalFrames)` before scrubbing the full timeline.
- lottie-web rewrites path data in place when it loads; never share one path object between layers or animations.
