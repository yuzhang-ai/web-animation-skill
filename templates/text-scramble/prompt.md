# Text scramble

**Effect:** a word "decrypts": every letter flickers through random glyphs (highlighted in the accent color), then the letters lock into place, roughly left to right, over about 0.9s.

**Use it for:** hero titles, nav links, labels in tech, security or developer brands. Short words (≤ 20 letters) read best.

## Prompt

```
Add a text scramble effect in vanilla JS (no library) to every element with [data-scramble].
- Store the real text in data-text and set aria-label to it.
- On trigger (load and/or pointerenter + focus), give each letter a lock time: (i / (n-1)) * SPREAD * DURATION + (1 - SPREAD) * DURATION * random(). DURATION 900ms, SPREAD 0.6.
- In a rAF loop, but only swap glyphs every ~45ms, render letters that have not locked as <span class="glyph">random char</span> from "A–Z 0–9 #%&*+=<>/", spaces stay spaces. When time passes DURATION, set textContent back to the real text.
- Cancel the previous rAF on re-trigger so hovering repeatedly restarts cleanly.
- Use a monospace font so the width does not jump.
- Reduced motion: do nothing.
Start from templates/text-scramble/index.html.
```

## Knobs

| Knob | Effect |
|---|---|
| `DURATION` | Total time to the last lock |
| `SPREAD` | 1 = strict left-to-right wave, 0 = all letters lock at random times |
| `GLYPHS` | Character set: katakana, binary `01`, or box-drawing characters change the mood |
| swap interval `45ms` | Lower = more frantic flicker |

## Pitfalls

- Proportional fonts make the line width jitter every swap. Use monospace, or fix each letter's width with `display:inline-block; width:1ch`.
- Swapping glyphs every frame at 120Hz is noise, not motion. Throttle to 20–25 swaps per second.
- `innerHTML` with user text is an injection risk: escape it if the text isn't yours.
