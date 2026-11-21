# Split-flap words

**Effect:** a big italic word assembles letter by letter, each letter flipping down from behind like a split-flap departure board. It holds, flips away upward, and the next word flips in. A caption and a progress scrubber track the loop.

**Use it for:** rotating hero keywords ("Build. Ship. Scale."), feature taglines, status boards.

## Prompt

```
Make rotating split-flap words with GSAP 3.15.1 SplitText (registerPlugin; wait for document.fonts.ready).
- Stack the words absolutely in one line box; each word wrapper gets perspective: 420px, its chars transform-style preserve-3d and backface-visibility hidden.
- SplitText.create(word, { type: "chars" }); set chars to rotationX -100, yPercent 30, opacity 0, transformOrigin "50% 50% -24px" (pivot behind the letter = flap).
- One timeline (repeat -1): per word, chars to rotationX 0 / yPercent 0 / opacity 1 (1s expo.out, stagger 0.04), hold 1s, then to rotationX 100 / yPercent -30 / opacity 0 (0.5s power2.in, stagger 0.025). Overlap words by 0.15s.
- Optional: drive a progress bar from tl.progress() in onUpdate.
- Reduced motion: show the first word, no loop.
Start from templates/split-flap-words/index.html.
```

## Knobs

| Knob | Effect |
|---|---|
| `transformOrigin` z `-24px` | Deeper pivot = bigger flap swing |
| `stagger 0.04` | Letter-to-letter delay |
| `+=1.0` | How long each word holds |

## Pitfalls

- Without a z offset in transformOrigin, rotateX just squashes the letter flat; the pivot behind it is what makes it a flap.
- Split after fonts load, or letter widths are measured with the fallback font.
