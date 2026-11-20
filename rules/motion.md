# Motion (formerly Framer Motion + Motion One)

> **Naming changed.** `framer-motion` is now the `motion` package (Nov 2024), and Motion One was merged into it. One package covers both:
> - React: `import { motion, AnimatePresence } from "motion/react"`
> - Vanilla JS: `import { animate, scroll, inView } from "motion"`
>
> `framer-motion` still installs for legacy projects, but new code should use `motion`. Old Motion One APIs such as `timeline()` and the `easing` option no longer exist. Use `animate([...sequence])` and `ease`.

## When to use

- **React**: component enter/exit, layout and shared-element animation, gestures (hover, press, drag, pan, pinch), scroll-linked values. It has the best React animation DX.
- **Vanilla**: small, fast `animate()` (hardware-accelerated via WAAPI where possible), springs, sequences, `scroll`/`inView`, plus `animateLayout` for layout animation without React.

---

## React

### Basic

```tsx
import { motion } from "motion/react";

<motion.div
  initial={{ opacity: 0, y: 16 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
/>
```

### Springs

```tsx
// Duration-based spring: easy to reason about and to keep in sync with other timings
<motion.div animate={{ x: 100 }} transition={{ type: "spring", visualDuration: 0.4, bounce: 0.25 }} />

// Physics spring
<motion.div animate={{ x: 100 }} transition={{ type: "spring", stiffness: 300, damping: 24 }} />
```

### Variants & orchestration

```tsx
import { motion, stagger } from "motion/react";

const list = {
  hidden: {},
  show: { transition: { delayChildren: stagger(0.05) } }, // replaces staggerChildren
};
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

<motion.ul variants={list} initial="hidden" animate="show">
  {items.map((i) => <motion.li key={i.id} variants={item} />)}
</motion.ul>
```

### AnimatePresence (exit animations)

```tsx
import { AnimatePresence, motion } from "motion/react";

<AnimatePresence mode="wait" initial={false}>
  {page === "home" && (
    <motion.section
      key="home"
      initial={{ opacity: 0, x: -24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 24 }}
    />
  )}
</AnimatePresence>
```

- Direct children need a stable, unique `key`.
- `mode="wait"`: exit finishes before the next enters. `"popLayout"`: the exiting element is taken out of layout immediately, which works best with `layout` siblings.

### Layout & shared-element animation

```tsx
<motion.div layout />                          // animates its own size/position changes

{selected && <motion.div layoutId="card-hero" />}  // morphs between components sharing an id

<LayoutGroup>{/* siblings that affect each other's layout */}</LayoutGroup>
```

Use `layout="position"` to animate only the position and avoid text squish during size changes.

### Gestures

```tsx
<motion.button
  whileHover={{ scale: 1.04 }}
  whileTap={{ scale: 0.96 }}
  whileFocus={{ boxShadow: "0 0 0 3px var(--focus)" }}
/>

<motion.div drag="x" dragConstraints={{ left: 0, right: 300 }} dragElastic={0.1} />
```

### Scroll-linked values

```tsx
import { useScroll, useTransform, useSpring, motion } from "motion/react";

function Parallax() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const smooth = useSpring(y, { stiffness: 120, damping: 20 });
  return <motion.div ref={ref} style={{ y: smooth }} />;
}
```

### Scroll reveal

```tsx
<motion.div
  initial={{ opacity: 0, y: 24 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-80px" }}
/>
```

### Reduced motion

```tsx
import { MotionConfig } from "motion/react";
<MotionConfig reducedMotion="user">{app}</MotionConfig>  // honours OS setting app-wide
```

### Bundle size

Use `LazyMotion` + `m` to code-split the features:

```tsx
import { LazyMotion, domAnimation } from "motion/react";
import * as m from "motion/react-m";

<LazyMotion features={domAnimation}><m.div animate={{ opacity: 1 }} /></LazyMotion>
```

In React Server Components files, import from `"motion/react-client"`.

---

## Vanilla JS

### animate

```js
import { animate } from "motion";

const controls = animate(".box", { x: 100, rotate: 45 }, { duration: 0.8, ease: "easeOut" });
controls.pause(); controls.play(); controls.stop(); controls.time = 0.4;
await controls;                     // thenable

animate(".box", { x: [0, 100, 50] }, { duration: 1.2, times: [0, 0.6, 1] }); // keyframes
animate(".box", { x: 200 }, { type: "spring", bounce: 0.3, visualDuration: 0.5 });

// Animate any value / JS object
animate(0, 100, { duration: 1, onUpdate: (v) => (counter.textContent = Math.round(v)) });
```

For the smallest bundle (WAAPI only), use `import { animate } from "motion/mini"`.

### Sequences (replaces Motion One `timeline`)

```js
animate([
  [".header", { y: [-24, 0], opacity: [0, 1] }, { duration: 0.4 }],
  [".card",   { y: [16, 0], opacity: [0, 1] }, { at: "-0.2", delay: stagger(0.05) }],
  "cta",                                                   // label
  [".cta",    { scale: [0.9, 1] }, { at: "cta", type: "spring" }],
]);
```

### Stagger

```js
import { animate, stagger } from "motion";
animate(".item", { opacity: [0, 1], y: [12, 0] }, { delay: stagger(0.04, { startDelay: 0.1 }) });
animate(".cell", { scale: [0.5, 1] }, { delay: stagger(0.03, { from: "center" }) });
```

### Scroll & inView

```js
import { animate, scroll, inView } from "motion";

scroll(animate(".progress", { scaleX: [0, 1] }));                  // page progress
scroll(animate(".hero img", { y: [0, 120] }), { target: document.querySelector(".hero") });
scroll((progress) => console.log(progress));                      // raw 0..1

inView(".reveal", (el) => {
  animate(el, { opacity: [0, 1], y: [24, 0] }, { duration: 0.5 });
  return () => animate(el, { opacity: 0 });                       // on leave (optional)
}, { margin: "0px 0px -15% 0px" });
```

`scroll()` uses native `ScrollTimeline` when available, so it runs off the main thread.

### Gestures without React

```js
import { hover, press, animate } from "motion";

hover(".btn", (el) => {
  animate(el, { scale: 1.04 });
  return () => animate(el, { scale: 1 });
});
press(".btn", (el) => {
  animate(el, { scale: 0.96 });
  return () => animate(el, { scale: 1 });
});
```

Recent versions also ship vanilla `drag`, `animateLayout` (FLIP layout animation without React), `scopeMotion` (scoped defaults and cleanup), and `stepFrames` (advance the frame loop synchronously in tests). See https://motion.dev/docs for signatures.

---

## Motion vs alternatives

| | Motion (vanilla) | Motion (React) | GSAP | Native WAAPI |
|---|---|---|---|---|
| Springs with velocity | ✅ | ✅ | via plugin/ease | ❌ |
| Exit animations | — | ✅ AnimatePresence | manual | manual |
| Layout / shared element | `animateLayout` | ✅ `layout`, `layoutId` | Flip plugin | View Transitions |
| Timeline scrubbing | sequences | sequences | ✅ best | manual |
| Scroll pinning | ❌ | ❌ | ✅ ScrollTrigger | ❌ |
| Size | ~2.5 KB (mini) – ~18 KB | ~30 KB (≈5 KB with LazyMotion) | ~25 KB core | 0 |
