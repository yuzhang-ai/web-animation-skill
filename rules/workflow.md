# Motion workflow: brief → build → animate → refine → render

An agent cannot *watch* an animation. Code that looks right can stutter, overshoot, or never fire. Follow these five steps instead of writing tweens straight away.

## 1. Brief — write the motion spec first

Before code, write down (in a comment or the reply) one line per moving element:

```
element        trigger          property          from → to        duration  easing     delay/stagger
.card          enters viewport  opacity, y        0,24px → 1,0     480ms     ease-out   40ms stagger, cap 8
.modal         open             opacity, scale    0,.96 → 1,1      240ms     ease-out   —
.modal         close            opacity, scale    1,1 → 0,.98      180ms     ease-in    —
```

Answer these questions in the spec:

- **Purpose**: what does this motion tell the user? Possible answers: where something came from, what changed, or what to look at. If there is no answer, cut the animation.
- **Trigger**: load, hover, press, scroll position, data change, or route change?
- **Interruptible?** If the user acts mid-animation, it must retarget smoothly from the current value, not snap to the start.
- **Reduced-motion version**: what happens under `prefers-reduced-motion: reduce`? Usually a fade or no motion. See [accessibility.md](accessibility.md).

## 2. Build — pick the lightest tool that does the job

Use [choosing-library.md](choosing-library.md). Try CSS or native first ([native-apis.md](native-apis.md)) and add a library only when you need what it gives you: timelines, springs, scroll scrubbing, layout animation, or canvas/WebGL.

Put the timing in **motion tokens** so every animation shares one rhythm:

```css
:root {
  --dur-instant: 100ms;  /* press feedback, toggles */
  --dur-fast:    180ms;  /* hover, small UI */
  --dur-base:    280ms;  /* dropdowns, modals */
  --dur-slow:    480ms;  /* page sections, large surfaces */
  --dur-story:   900ms;  /* hero / storytelling only */

  --ease-out:    cubic-bezier(0.16, 1, 0.3, 1);   /* entering */
  --ease-in:     cubic-bezier(0.7, 0, 0.84, 0);   /* leaving */
  --ease-inout:  cubic-bezier(0.65, 0, 0.35, 1);  /* moving on screen */
}
```

```js
// Mirror tokens in JS so GSAP / Motion / Anime.js use the same values
export const motion = {
  dur: { instant: 0.1, fast: 0.18, base: 0.28, slow: 0.48, story: 0.9 },
  ease: { out: [0.16, 1, 0.3, 1], in: [0.7, 0, 0.84, 0], inOut: [0.65, 0, 0.35, 1] },
};
```

## 3. Animate — rules of thumb

| Rule | Why |
|---|---|
| Use ease-out for entering, ease-in for leaving, ease-in-out for moving | Matches how physical objects start and stop |
| Make exits about 70% as long as entrances | Users wait for the next thing, not for the old thing to leave |
| UI feedback ≤ 200ms; nothing interactive > 500ms | Slower feels laggy |
| Travel 8–24px for reveals, not 100px | Big travel reads as "slow" and causes motion sickness |
| Stagger 30–60ms per item, cap total at ~400ms | 40 items × 100ms = 4s of waiting |
| Animate `transform` / `opacity` only | See [performance.md](performance.md) |
| Never animate from `scale: 0` | Use 0.9–0.96 plus opacity; 0 looks like a glitch |
| Use springs for gestures and drag, durations for choreography | Springs keep velocity when the user interrupts |

## 4. Refine — verify what actually renders

Don't trust the code: sample frames and look at them.

### Freeze CSS / WAAPI / Motion animations at a timestamp

```js
// Runs in the page (Playwright page.evaluate or DevTools console)
for (const a of document.getAnimations()) { a.pause(); a.currentTime = 240; }
```

### Freeze GSAP

```js
gsap.globalTimeline.pause();
gsap.globalTimeline.time(0.24); // seconds
```

### Deterministic frames for anything driven by requestAnimationFrame (Playwright)

```js
import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
await page.clock.install();            // fakes Date, timers, rAF, performance.now
await page.goto("http://localhost:5173");
// install() alone keeps time flowing in real time — pause it so frames are deterministic
await page.clock.pauseAt(await page.evaluate(() => Date.now() + 1));

// Key moments: start, 1/4, 1/2, end
let now = 0;
for (const t of [0, 120, 240, 480]) {
  await page.clock.runFor(t - now);
  now = t;
  await page.screenshot({ path: `frame-${t}ms.png` });
}
```

To capture every frame at a fixed rate (also the basis for [export.md](export.md)):

```js
const fps = 25, ms = 1000 / fps;       // 25/50 fps give whole-ms steps; runFor rounds fractions up
for (let i = 0; i < 60; i++) {
  await page.clock.runFor(ms);
  await page.screenshot({ path: `frames/${String(i).padStart(4, "0")}.png` });
}
```

> The fake clock drives JS (`requestAnimationFrame`, timers, `performance.now`), which covers GSAP, Motion, Anime.js, Three.js, and canvas loops. **CSS animations and WAAPI keep running in real time**, so seek them explicitly: `document.getAnimations().forEach(a => { a.pause(); a.currentTime = t; })`. See [export.md](export.md).

Look at the frames and check for these problems:

- [ ] Start frame: no flash of unstyled or final content (FOUC) before the animation starts
- [ ] Middle frames: nothing overlaps or clips, and no element jumps between frames
- [ ] End frame: matches the static design exactly, with no leftover transform or opacity < 1
- [ ] Reduced motion: re-run with `await page.emulateMedia({ reducedMotion: "reduce" })`
- [ ] Interrupt: trigger the reverse mid-animation and check it continues from the current value

### Whole-page pass (landing pages, showcases, anything longer than one screen)

Per-animation frames miss the problems that only appear while scrolling. Scroll the real page with the mouse wheel, not `scrollTo`, so scroll-linked effects fire. Take one screenshot per ~600px of scroll and wait about 1s at each stop for reveals to settle. Then tile the shots into one contact sheet (ffmpeg `tile=2x4`) so you see the rhythm of the whole page at once. Open the suspicious frames at full size.

```js
const total = await page.evaluate(() => document.documentElement.scrollHeight);
for (let y = 0, i = 0; y < total; y += 600, i++) {
  await page.mouse.wheel(0, 600);
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `page/${String(i).padStart(2, "0")}.png` });
}
```

Check every frame for:

- [ ] **Fixed or sticky headers covering content.** A transparent bar with a big heading scrolling under it reads as broken. Give the bar a background or backdrop blur, or fade it in after the hero.
- [ ] **Dead screens.** A full viewport with nothing moving and more than half of it empty. Pull the next section up or put something alive there.
- [ ] **Clipping.** Text cut off by `overflow`, SplitText line masks, or `background-clip: text` clipping shadows and descenders. Headlines that wrap mid-word ("Motio / n").
- [ ] **Blank canvases.** Canvases that are empty before they start, under reduced motion, or after a resize.
- [ ] **Unstyled leftovers.** A chip, label, or button missing its class, so it renders as plain text next to styled siblings.
- [ ] **Mobile.** Repeat at 390px wide and check `document.documentElement.scrollWidth <= innerWidth` (no sideways scroll).
- [ ] **Console.** Collect `console` errors and `pageerror` events during the whole pass; it should be zero.

### Performance check

Open Chrome DevTools → Performance → record while the animation plays. Long frames (> 16ms) or purple **Layout** bars inside the animation mean you're animating the wrong property.

## 5. Render — ship or export

- **Shipping in a page**: lazy-load heavy libraries (Three.js, Lottie, Rive) and pause loops when they are off-screen (`IntersectionObserver`) or the tab is hidden (`document.hidden`).
- **Need a GIF / MP4 / WebM** for a README, social post, or design review: see [export.md](export.md).
- **The deliverable *is* a video** (explainer, promo, data story): use code-driven video tools instead: [Remotion](https://github.com/remotion-dev/skills) (React) or [Motion Canvas](https://github.com/motion-canvas/motion-canvas) (TypeScript generators).
