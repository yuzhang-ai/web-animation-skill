# Split text reveal

**Effect:** three reveals. (1) A big headline arrives line by line, each line sliding up out of its own mask. (2) A heading's letters fade up from a blur in random order when it enters the screen. (3) A paragraph starts dim and lights up word by word, scrubbed by the scrollbar.

**Use it for:** hero headlines (1), section titles (2), manifesto or "about" paragraphs (3). Use one style per element and no more than two styles per page.

## Prompt

```
Add text reveals with GSAP 3.15.1 SplitText + ScrollTrigger (CDN dist/*.min.js, registerPlugin).
- Always split with SplitText.create(el, { ..., autoSplit: true, onSplit(self) { return tween } }) so lines re-split on resize and the tween is rebuilt. Wait for document.fonts.ready first.
- Lines: type "lines", mask "lines"; gsap.from(self.lines, { yPercent: 110, duration: 1.1, ease: "power4.out", stagger: 0.12 }).
- Letters: type "words, chars" (words keep letters from breaking mid-word); from { opacity 0, filter blur(12px), yPercent 30 }, 0.9s power3.out, stagger { each: 0.03, from: "random" }, scrollTrigger { start: "top 80%", once: true }.
- Read-along: type "words"; fromTo opacity 0.18 → 1, ease none, stagger 0.1, scrollTrigger { start: "top 75%", end: "bottom 45%", scrub: true }.
- Hide [data-reveal] with visibility:hidden only when JS runs (.js class on <html>), show after splitting. Use gsap.matchMedia: under reduced motion, don't split, just show.
Start from templates/split-text-reveal/index.html.
```

## Knobs

| Knob | Effect |
|---|---|
| `yPercent: 110` + `power4.out` | The "rise from a slot" feel; 100 is the minimum to start hidden |
| `stagger` | 0.08–0.15 for lines, 0.02–0.04 for letters |
| `from: "random"` | Try `"start"`, `"center"`, `"edges"` |
| read-along `start` / `end` | How much scrolling it takes to light the whole paragraph |

## Pitfalls

- Split before fonts load and the lines break in the wrong places. Wait for `document.fonts.ready`, and use `autoSplit` so a resize re-splits.
- Splitting into chars only lets words break mid-word at line ends; split `"words, chars"`.
- `filter: blur()` on hundreds of letters is expensive. Keep blurred reveals to headings.
- Screen readers: SplitText adds `aria-label` to the parent and hides the pieces. Don't strip it.
