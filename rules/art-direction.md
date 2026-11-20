# Art direction: making motion memorable

The other rules make motion **correct**: current APIs, smooth, accessible. This one is about making it **memorable**. Load it when the brief says "impressive", "showcase", "landing page", "hero", or "make people say wow". It is not for routine UI motion, where restraint matters more.

## 1. Decide the look before writing code

Add three lines to the motion brief from [workflow.md](workflow.md):

```
mood        e.g. "precise lab instrument" / "warm analog" / "deep space, calm"
palette     background, 1 accent, 1–2 support colours (exact hex)
type        display face + text face + mono, with the contrast between them stated
```

- **Pick one accent and commit to it.** One unexpected colour (acid lime, signal orange, ice cyan) used sparingly reads as designed. Five equal colours read as a template.
- **Avoid the default AI look.** Watch out for:
  - purple → pink gradients on everything;
  - gradient text in every heading;
  - glass cards everywhere;
  - everything centred;
  - emoji as icons;
  - copy like "Unleash the power of…".

  Any one of these is fine on purpose. All of them together look generated.
- **Contrast the type.** Pair an expressive display face with a neutral text face and a mono for code or labels, e.g. Instrument Serif + Space Grotesk + JetBrains Mono, or a wide grotesk + a plain sans. One family in three weights rarely looks deliberate.
- **Background is a colour, not black.** Use a near-black with a hue (`#0a0b0d`, `#0b0a10`) or an off-white, plus a faint grain or noise layer.

## 2. One signature effect above the fold

The first screen needs **one** effect that:

1. **Moves without input.** It is alive within the first 500ms.
2. **Reacts to the pointer within the first second.** Moving the mouse visibly changes it.
3. **Is about the subject.** A flow field fits a site about motion; a particle assembly fits one about data.

Strong options, roughly from cheapest to most expensive:

| Effect | Tool | Cost |
|---|---|---|
| Flow-field particles with trails | Canvas 2D | ~2–3k particles at 60fps on a laptop |
| Noise-displaced or iridescent shader blob | Three.js `ShaderMaterial` | One draw call; render at 0.6–0.75× resolution on large screens |
| Full-screen domain-warped noise | Fragment shader on a quad | Fill-rate bound; cap DPR at 1–1.5 |
| Text that assembles from particles | Canvas + `getImageData` sampling | Sample once, animate points |
| Kinetic type | GSAP SplitText + 3D transforms | Cheap, but needs strong type |

Keep the intro choreography under ~1.5s, then hand control to the user. Don't make people wait for the logo.

## 3. Rhythm and density

A showcase is read by scrolling, so plan it like a sequence, not a stack of equal sections.

- **Alternate density.** Follow a dense grid of live demos with one breathing moment (a big statement, one large effect), then go dense again. Ten identical "text left, demo right" sections in a row is monotonous.
- **No dead screens.** Every viewport should contain something alive. If a full screen is mostly empty and still, pull content up or cut height. The whole-page pass in [workflow.md](workflow.md) catches this.
- **Vary scale.** Mix one huge element per screen with many small ones. A bento grid with 1×1, 2×1 and 2×2 cells reads richer than equal cards.
- **End on purpose.** The last screen deserves a moment, such as a scrubbed statement or the install command, not a footer that just stops.

## 4. Layers of motion

Memorable pages usually run three layers at once, each at its own pace:

| Layer | Speed | Examples |
|---|---|---|
| Ambient | Slow, always on | Background field, drifting grain, slow gradient rotation |
| Reactive | Instant, follows input | Tilt, border light following the pointer, magnetic buttons, springs |
| Choreographed | Triggered once | Entrance sequences, scroll reveals, scrubbed statements |

Only one layer should compete for attention at a time. Ambient motion stays low in contrast, reactive motion is small but immediate, and choreographed motion gets the big moves.

## 5. Recipes for reactive polish

**Border light that follows the pointer.** Cheap, and it makes every card feel touched:

```css
.card { position: relative; --mx: 50%; --my: 50%; }
.card::before {
  content: ""; position: absolute; inset: 0; border-radius: inherit; padding: 1px;
  background: radial-gradient(240px circle at var(--mx) var(--my), var(--accent), transparent 70%);
  mask: linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0);
  pointer-events: none;
}
```

```js
grid.addEventListener("pointermove", (e) => {
  for (const card of cards) {
    const r = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${e.clientX - r.left}px`);
    card.style.setProperty("--my", `${e.clientY - r.top}px`);
  }
});
```

**Tilt with `gsap.quickTo`.** It retargets smoothly with no new tweens per event:

```js
gsap.set(card, { transformPerspective: 900 });
const rx = gsap.quickTo(card, "rotationX", { duration: 0.5, ease: "power3" });
const ry = gsap.quickTo(card, "rotationY", { duration: 0.5, ease: "power3" });
card.addEventListener("pointermove", (e) => {
  const r = card.getBoundingClientRect();
  ry(((e.clientX - r.left) / r.width - 0.5) * 10);
  rx(-((e.clientY - r.top) / r.height - 0.5) * 10);
});
card.addEventListener("pointerleave", () => { rx(0); ry(0); });
```

Don't let a scroll reveal tween the same properties the tilt uses (`rotationX`/`rotationY`). The reveal's `overwrite` kills the `quickTo` tweens. Reveal with `y`, `scale`, and `autoAlpha` only. Skip tilt on cards the user drags or clicks inside.

**Goo: shapes that fuse when close.** An SVG filter on a container of circles:

```html
<svg width="0" height="0" aria-hidden="true">
  <filter id="goo">
    <feGaussianBlur in="SourceGraphic" stdDeviation="10" />
    <feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -9" />
  </filter>
</svg>
<div class="blobs" style="filter: url(#goo)">…circles moved by springs…</div>
```

Chain the circles: each one springs toward the previous one's position from a few frames ago. You get a tail that stretches and merges.

**Flow-field particles.** Batch the strokes by colour, because one path per particle is slow:

```js
const colours = ["#d7ff5a", "#9a8cff", "#5fd4ff", "#ff7a59"];
const pts = Array.from({ length: 2400 }, (_, i) => ({ x: Math.random() * w, y: Math.random() * h, c: i % colours.length }));
const angle = (x, y, t) => (Math.sin(x * 0.0021 + t * 0.0003) + Math.cos(y * 0.0024 - t * 0.0002)) * Math.PI;

function frame(t) {
  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = "rgba(10, 11, 13, 0.08)";      // low alpha = long trails
  ctx.fillRect(0, 0, w, h);
  ctx.globalCompositeOperation = "lighter";
  ctx.lineWidth = 1;
  colours.forEach((col, ci) => {
    ctx.strokeStyle = col; ctx.beginPath();
    for (const p of pts) {
      if (p.c !== ci) continue;
      const a = angle(p.x, p.y, t), nx = p.x + Math.cos(a) * 1.6, ny = p.y + Math.sin(a) * 1.6;
      ctx.moveTo(p.x, p.y); ctx.lineTo(nx, ny);
      if (nx < 0 || nx > w || ny < 0 || ny > h) { p.x = Math.random() * w; p.y = Math.random() * h; }
      else { p.x = nx; p.y = ny; }
    }
    ctx.stroke();
  });
}
```

Add pointer influence by bending `angle` near the cursor. Under reduced motion, run about 200 frames off-screen once and show the result as a still image.

Keep the fade alpha at **0.06 or above**. A canvas stores 8-bit colour, so a very low-alpha fill stops changing pixels before they reach the background, leaving permanent grey ghosts. Below that, also clear the canvas fully every few seconds.

## 6. The screenshot test

After the whole-page pass, look at each frame of the contact sheet and ask: **would someone screenshot this and send it to a friend?**

- **Yes:** keep it.
- **"It's fine":** pick one fix. Add a reactive layer, raise the contrast of the signature effect, tighten the layout, or make it bigger.
- **No, and it's only there for completeness:** shrink it into a dense grid cell or cut it.

Do this before polishing details. A page with three unforgettable moments beats one with fifteen adequate ones.
