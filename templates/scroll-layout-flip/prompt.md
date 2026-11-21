# Scroll layout flip

**Effect:** each gallery pins to the screen while you scroll, and its tiles glide from one CSS layout to another, scrubbed by the scrollbar. Three examples: a row where the centre frame grows to fill the screen, a spread grid that folds into a fanned deck, and a bento grid that zooms out past the screen edges.

**Use it for:** portfolios, product storytelling, case studies, editorial pages. Two or three per page, separated by normal content.

## Prompt

```
Build scroll-scrubbed layout changes with GSAP 3.15.1 Flip + ScrollTrigger (CDN: gsap.min.js, Flip.min.js, ScrollTrigger.min.js; gsap.registerPlugin(Flip, ScrollTrigger)).
- Each gallery sits in a 100svh wrapper. Its start layout is plain CSS; its end layout is the same markup with an .is-final class (different grid, sizes, margins).
- For each gallery: add .is-final, Flip.getState(tiles + caption, { props: "filter, opacity" }), remove .is-final, then
  Flip.to(state, { ease: "none", simple: true, scale: true, scrollTrigger: { trigger: gallery, start: "center center", end: "+=300%", pin: wrapper, scrub: true } }).
- Per-gallery options: absoluteOnLeave + scale:false for the row whose centre tile goes full-screen; stagger 0.05 with power2.inOut for the stack.
- Wrap it in gsap.matchMedia: with reduced motion, add .is-final to every gallery and do no pinning.
- Flip measures pixels: on a width change, revert the gsap.context, restore the original style attributes, rebuild, ScrollTrigger.refresh().
Start from templates/scroll-layout-flip/index.html.
```

## Knobs

| Knob | Effect |
|---|---|
| `end: "+=300%"` | Scroll distance the gallery stays pinned; longer = slower morph |
| `.is-final` CSS | The destination layout. Any grid, flex or size change works |
| `stagger`, `ease` | `none` tracks the scrollbar 1:1; `power2.inOut` with stagger makes tiles leave one by one |
| `props` | Extra CSS properties to tween along (filter, opacity, borderRadius) |

## Pitfalls

- Record the **final** state first, then remove the class. Flip.to animates from what's on screen now to the recorded state.
- Pin the **wrapper**, not the gallery: Flip moves the gallery's children and the pin spacer must not be inside the measured layout.
- Reverting a Flip leaves its end values inline; reset `style` attributes before rebuilding on resize.
- Ignore height-only resizes on phones (the URL bar), or the page rebuilds while scrolling.
