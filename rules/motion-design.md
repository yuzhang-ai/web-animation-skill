# Motion design: making it feel right

Libraries make motion possible. These rules make it feel intentional. Apply them before tuning any code.

## Duration

Motion should be as fast as possible while still readable. Scale duration with distance and size: small things move quickly, large things more slowly.

| What | Duration |
|---|---|
| Hover / press feedback, colour change | 100–150ms |
| Toggles, checkboxes, small icons | 150–200ms |
| Dropdowns, tooltips, popovers | 150–250ms (exit ~20% faster than enter) |
| Modals, drawers, cards expanding | 250–400ms |
| Page / route transitions | 300–500ms |
| Hero load sequence (whole orchestration) | 800–1600ms total |
| Scroll-scrubbed | no duration — tied to scroll distance |

Anything a user triggers repeatedly (menu, tab, toggle) should stay under ~300ms, or it starts to feel slow by the tenth use.

## Easing

Real objects accelerate and decelerate. Linear motion looks mechanical except for scroll-scrubbing, progress, rotation loops and opacity-only fades.

| Situation | Easing | CSS | GSAP | Motion |
|---|---|---|---|---|
| Element **entering** or responding to input | strong ease-out | `cubic-bezier(0.16, 1, 0.3, 1)` (expo out) | `"expo.out"` / `"power3.out"` | `"easeOut"` or a spring |
| Element **leaving** | ease-in, shorter | `cubic-bezier(0.7, 0, 0.84, 0)` | `"power2.in"` | `"easeIn"` |
| Moving from A to B on screen | ease-in-out | `cubic-bezier(0.65, 0, 0.35, 1)` | `"power2.inOut"` | `"easeInOut"` |
| Scrubbed by scroll | linear | `linear` | `"none"` | `"linear"` |
| Physical, draggable, interruptible | spring | `linear(...)` approximation | `CustomEase` / Inertia | `type: "spring"` |

Define these once as tokens and reuse them:

```css
:root {
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in: cubic-bezier(0.7, 0, 0.84, 0);
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
  --dur-1: 120ms;  /* feedback */
  --dur-2: 220ms;  /* small UI */
  --dur-3: 380ms;  /* panels, modals */
  --dur-4: 600ms;  /* hero elements */
}
```

**Springs** are the best default for anything interruptible (drag, toggles, layout). They carry velocity when retargeted, so a second click mid-animation doesn't jump. In Motion, prefer the duration-based form, which is easier to reason about: `{ type: "spring", duration: 0.4, bounce: 0.15 }`. Keep `bounce` at 0–0.25 for UI; higher reads as playful and gets tiring.

## Choreography

- **One lead, then supporting cast.** In a sequence, the most important element moves first and furthest; secondary elements follow with smaller movement.
- **Stagger 30–80ms** between siblings. Cap total stagger time (`stagger: { amount: 0.4 }` in GSAP) so long lists don't take seconds.
- **Overlap steps.** Start the next element before the previous finishes (GSAP `"-=0.3"`, Motion `at: "-0.2"`). Strictly sequential motion feels slow.
- **Move less than you think.** Entrance offsets of 8–40px read as elegant; 100px+ reads as a slide show.
- **Direction carries meaning.** Content entering from the right implies "forward"; a modal should grow from the button that opened it, not from the centre of the screen.
- **Exit faster and quieter than enter.** Users already know what's leaving.

## What makes motion feel premium

These are the details that separate award-level sites from template sites:

1. **Masked text reveals.** Lines slide up from behind a clipping mask (`overflow: clip` on each line) rather than fading in. Use GSAP SplitText with `mask: "lines"` and `autoSplit: true`.
2. **Scrubbed, not triggered, for narrative sections.** Tie progress to scroll (`scrub: true` or CSS `animation-timeline`) so the user controls the pace and scrolling back reverses it.
3. **Smooth momentum scrolling, used carefully.** Lenis (`lenis` package) gives the inertia feel that many award sites have. Sync it with ScrollTrigger (see [scroll-animations.md](scroll-animations.md)). Skip it on content-heavy or form-heavy pages, and disable it for reduced motion.
4. **Shared-element continuity.** When a card opens to a detail view, morph the card itself (View Transitions, GSAP Flip, Motion `layoutId`) instead of fading one screen out and the next in.
5. **Pointer-aware micro-interactions.** Small magnetic pull on primary buttons, subtle tilt or spotlight that follows the cursor on feature cards. Limit to fine pointers: `@media (hover: hover) and (pointer: fine)`.
6. **Restraint everywhere else.** Reserve big motion for one or two moments per page. If every section animates in, none of them stands out.
7. **Nothing jumps.** Animate from the element's real current state. Interrupting an animation must not snap it back to its start.

## Common mistakes

| Mistake | Fix |
|---|---|
| Fade-up on every section | Pick one orchestrated moment; leave the rest static or very subtle |
| `transition: all` | List the properties you animate |
| Same duration for everything | Scale with distance and importance |
| Ease-in on entrances | Ease-out for things arriving |
| Bouncy springs on business UI | `bounce: 0` to `0.15` |
| Long staggers on 20+ items | Use `stagger: { amount }` or animate only what's in view |
| Animating on page load *and* on scroll for the same element | Choose one |
| Parallax on body text | Parallax decorative layers only; text should stay readable |

## Reduced motion

`prefers-reduced-motion: reduce` means **less movement**, not **no feedback**. Swap transforms for opacity, shorten durations, and turn scrubbed scenes into static layouts.

```js
// GSAP: separate setups per preference
const mm = gsap.matchMedia();
mm.add("(prefers-reduced-motion: no-preference)", () => {
  gsap.from(".hero-line", { yPercent: 100, duration: 1, ease: "expo.out", stagger: 0.08 });
});
mm.add("(prefers-reduced-motion: reduce)", () => {
  gsap.from(".hero-line", { opacity: 0, duration: 0.3 });
});
```

```tsx
// Motion for React: honour the OS setting app-wide
import { MotionConfig } from "motion/react";
<MotionConfig reducedMotion="user">{children}</MotionConfig>
```
