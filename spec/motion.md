# Motion design spec

How things should move, by situation. Every row gives numbers you can paste. See them side by side in [templates/motion-curves](../templates/motion-curves/): one ball per curve, same distance, same duration.

## 1. Pick the curve from what the object is doing

| The object… | Curve | CSS / WAAPI easing | GSAP | Duration |
|---|---|---|---|---|
| **appears / enters** (slides in, fades up, opens) | Decelerate: fast start, gentle stop | `cubic-bezier(0.16, 1, 0.3, 1)` | `power3.out` / `expo.out` | 200–480ms |
| **leaves** (dismissed, closes, slides out) | Accelerate: gentle start, fast exit | `cubic-bezier(0.7, 0, 0.84, 0)` | `power3.in` | ~70% of its entrance |
| **moves A → B, both ends on screen** (reorder, panel resize, carousel step) | Accelerate then decelerate | `cubic-bezier(0.65, 0, 0.35, 1)` | `power2.inOut` | 280–600ms |
| **runs mechanically** (spinner, marquee, progress tied to time, scroll scrub) | Constant speed | `linear` | `none` | any |
| **hits something and stops dead** (slams shut, snaps into a slot, lands on a wall) | Accelerate, no braking, then a 2–4% squash on impact | `cubic-bezier(0.55, 0, 1, 0.45)` + impact keyframe 80ms | `power2.in` + `scaleX 1.03, scaleY 0.97` yoyo | 180–320ms |
| **pops in with energy** (toast, badge, chip added, like) | Overshoot ~8–10% and settle | `cubic-bezier(0.34, 1.56, 0.64, 1)` | `back.out(1.7)` | 300–450ms |
| **winds up before launching** (swipe-away, "send", game-like CTA) | Pull back 5–10%, then go | `cubic-bezier(0.36, 0, 0.66, -0.56)` | `back.in(1.7)` | 300–500ms |
| **follows a gesture / gets interrupted** (drag release, sheet, toggle thumb) | Spring (keeps velocity) | spring → `linear(...)` (section 3) | Motion `type: "spring"` | settles on its own |
| **falls and lands** (dropped item, notification dot, pin drop) | Bounce, 2–3 bounces of decreasing height | `linear()` bounce (see template) | `bounce.out` | 500–800ms |

Rules that hold for all of them:

- Animate `transform` and `opacity`. One element changing size in isolation is the only exception.
- Feedback for a press or toggle starts within 100ms and finishes within 200ms.
- Nothing the user waits on takes longer than 500ms. Storytelling (hero, scroll scenes) may take 700–1200ms.
- Exits are shorter than entrances. The user already decided; don't make them wait.

## 2. Duration from distance and size

| Travel / size | Duration |
|---|---|
| Icon, checkbox, toggle thumb (< 40px) | 100–180ms |
| Button, chip, tooltip, small menu (40–200px) | 150–250ms |
| Dropdown, card, popover (200–400px) | 220–320ms |
| Modal, sheet, side panel (400–800px) | 280–420ms |
| Full-screen / route change (> 800px) | 350–500ms |

On phones, cut 20–30%: the distances are shorter. On large desktop screens, don't scale up past 500ms; increase easing strength instead.

## 3. Springs: weight and personality

A spring is set by stiffness `k`, damping `c` and mass `m`. The damping ratio `ζ = c / (2·√(k·m))` decides the character: `ζ ≥ 1` never overshoots, `ζ ≈ 0.7` overshoots once slightly, and `ζ < 0.4` wobbles.

| Preset | k | c | m | ζ | Feels like | Use for |
|---|---|---|---|---|---|---|
| **Snappy** | 500 | 30 | 1 | 0.67 | Precise, quick | Toggles, tabs indicator, segmented controls |
| **Default UI** | 320 | 26 | 1 | 0.73 | Responsive, calm | Sheets, popovers, layout changes |
| **Gentle** | 120 | 20 | 1 | 0.91 | Soft, floaty | Large panels, background elements, hero objects |
| **Bouncy** | 180 | 9 | 1 | 0.34 | Playful, rubbery | Likes, stickers, consumer delight moments |
| **Heavy** | 200 | 28 | 3 | 0.57 | Weighty, slow to start | Big cards, physical metaphors, "drop" effects |

- Motion: `animate(el, { x: 200 }, { type: "spring", stiffness: 320, damping: 26, mass: 1 })`.
- CSS: sample the spring into `linear()` (the `springToLinear()` function in templates/motion-curves does it) and give it the duration it takes to settle.
- The jelly-button template has a 15-line solver for press/release springs.

**Weight** is mostly mass and start speed. Light things (icons, chips) start fast and stop short. Heavy things (cards, sheets) take longer to get going and settle with less wobble. Don't put a bouncy spring on something that should feel heavy.

## 4. Controls, state by state

Durations assume the Default UI rhythm. `↗` = entering the state, `↘` = leaving it.

### Button

| State | Change | Timing |
|---|---|---|
| hover | background +6–8% lightness, or `translateY(-1px)` + shadow | 150ms ease-out ↗, 200ms ↘ |
| press | `scale(0.97)` (flat buttons) or squash `scale(1.06, 0.94)` (playful) | 80–110ms ease-out |
| release | back to 1 with the Snappy spring, or Bouncy for playful | spring |
| focus-visible | 2px outline, offset 2–4px, no animation needed | instant |
| loading | label fades out 120ms, spinner fades in; width stays fixed | 120ms |
| success | spinner → check (stroke draw 250ms), button tint to success colour | 250–300ms |
| error | shake `translateX(0, -6, 6, -4, 4, -2, 0)px` | 320ms ease-out |
| disabled | opacity 0.4–0.5, no hover/press animation | 150ms |

### Toggle / switch

- Thumb travels with the **Snappy** spring; track colour cross-fades in 150ms.
- While pressed, stretch the thumb 15–20% along the travel axis (it "reaches"), then release into the spring.
- Dragging the thumb follows the pointer 1:1; on release, snap to the nearer side with the spring, carrying the drag velocity.

### Knob / dial / rotary

- During drag: rotation follows the pointer **1:1 with no easing**. Direct manipulation must never lag.
- With detents: on release, rotate to the nearest detent with a stiff spring (k 600, c 35). Add a 1–2° overshoot only if the product is playful.
- Free-spinning (flick): keep the release velocity and decay it by ×0.92–0.95 per frame (inertia), then snap to a detent if there is one.
- At the limits: rubber-band. Past the limit, rotation = `limit + overflow × 0.3`; on release, spring back.

### Slider

- Thumb follows the pointer 1:1. A click on the track moves the thumb there with ease-out 180ms.
- Value label scales `0.9 → 1` with opacity on press, 120ms.
- At min / max with a drag still going: rubber-band the fill 4–8px, spring back on release.

### Input

| State | Change |
|---|---|
| focus | border colour 150ms, label floats up (`translateY(-50%) scale(0.85)`) 180ms ease-out |
| typing | no motion |
| error | shake as the button (320ms), error text slides down 8px + fades in 180ms |
| valid | small check fades in 150ms; no shake, no bounce |

### Checkbox / radio

- Box fills with `scale(0.6 → 1)` + opacity, 120ms ease-out; check mark stroke-draws 180ms with 40ms delay.
- Unchecking is faster (100ms) and has no draw.

### Card

- Hover: `translateY(-2 to -4px)` + shadow grows, 200ms ease-out. Avoid scale > 1.03: text blurs and neighbours get covered.
- Pointer tilt (if any): max 6–8°, follow with `quickTo` 0.4s power3, return on leave 0.6s.
- Press on a clickable card: `scale(0.98)`, 100ms.

### Overlays

| Element | Enter | Exit |
|---|---|---|
| Tooltip | opacity + 4px toward its anchor, 120ms, 300–500ms hover delay | 80ms, no delay |
| Dropdown / popover | opacity + `scale(0.96 → 1)` from the trigger side (`transform-origin`), 180ms ease-out | 120ms ease-in |
| Modal | backdrop 200ms; dialog opacity + `scale(0.96 → 1)` or 16px up, 240ms ease-out | 160ms ease-in |
| Bottom sheet | slides up with Default UI spring; follows drag 1:1; dismiss if dragged > 30% or flicked > 500px/s | ease-in 220ms |
| Toast | slides in 16px + opacity with overshoot (`back.out`), 300ms | ease-in 180ms, or swipe away |

### Tabs and segmented controls

- The active indicator moves between tabs (shared element, FLIP or View Transitions) with the Snappy spring. Content cross-fades in 150ms; don't slide the content as far as the indicator.

## 5. Choreography

- **One lead.** In each change, one thing moves first and most; everything else follows. The shape leads, its content follows 120–200ms later (see shape-morph-ui).
- **Stagger** 30–60ms per item, capped at ~400ms in total. Beyond 8–10 items, stagger the first few and bring the rest in together.
- **Direction is meaning.** Things come from where they were (the trigger, the previous page position) and leave toward where they go. Going deeper slides left or scales up; going back reverses it.
- **Fewer, larger moves.** Two coordinated moves read better than six small ones.

## 6. Interruption

- Anything the user can trigger again mid-animation must **retarget from the current value**, not jump to the start. WAAPI: read the computed value, cancel, start a new animation from it. GSAP: `overwrite: "auto"` or `quickTo`. Motion and springs do it natively.
- Hover in/out uses one transition, so leaving halfway reverses smoothly.

## 7. Reduced motion

| Normal | Under `prefers-reduced-motion: reduce` |
|---|---|
| Slide / scale entrance | Opacity only, ≤ 150ms |
| Spring, bounce, overshoot | Plain ease-out, no overshoot |
| Shake (error) | Colour change + icon, no movement |
| Parallax, scroll-linked movement, auto-playing loops | Off; show the final or a still state |
| Drag following the pointer | Keep it: it's user-driven |

See [rules/accessibility.md](../rules/accessibility.md) for the implementation.
