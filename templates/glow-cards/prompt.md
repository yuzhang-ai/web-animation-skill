# Glow cards

**Effect:** a soft light follows the pointer over a grid of cards. Every card's 1px border lights up near the pointer, and the card under the pointer gets a faint surface glow.

**Use it for:** feature grids, bento layouts, pricing tables. One per page; it is the "premium SaaS" signature.

## Prompt

```
Build a grid of feature cards with a pointer-following glow, using CSS custom properties and a few lines of vanilla JS (no library).
- Each card is a 1px "border" layer (the card background) with an inner panel inset by 1px.
- One pointermove listener on the grid writes --mx/--my (pointer position relative to each card) on every card, throttled to one rAF; read all getBoundingClientRect() first, then write.
- card::after: radial-gradient(420px circle at var(--mx) var(--my), accent 60% alpha, transparent 40%) under the panel, visible while the grid is hovered, so all borders near the pointer light up.
- card::before: radial-gradient(640px circle ..., accent 8% alpha) over the panel, visible only on the hovered card.
- Fade both with a 400ms opacity transition. Start --mx/--my off-screen so nothing glows on load.
- Touch (hover: none): replace the effect with a static gradient border.
Start from templates/glow-cards/index.html.
```

## Knobs

| Knob | Effect |
|---|---|
| `--glow` in `:root` | Light color (`r g b`) |
| `420px` / `640px` in `::after` / `::before` | Radius of border light / surface light |
| `0.6` / `0.08` (gradient alpha) | Brightness of border / surface |
| `gap: 8px` in `.cards` | Wider gaps make the light jump between cards less |

## Pitfalls

- The border light must sit **under** the inner panel (`z-index` 1 vs 2). On top, it floods the whole card.
- Don't put the listener on each card: the light has to reach a card's border before the pointer enters it.
- `getBoundingClientRect()` after a style write forces layout. Batch reads, then writes.
