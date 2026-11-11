# Motion for React (formerly Framer Motion)

## When to use

React projects needing component-level enter/exit animations, layout transitions, drag gestures, or orchestrated multi-step sequences. Best React animation DX.

> Framer Motion is now published as `motion`. Install with `npm install motion` and import from `"motion/react"`. The APIs below are unchanged from Framer Motion v11; only the package and import path changed. If an existing project still has `framer-motion` installed, match its imports rather than mixing both packages.

## Basic motion component

```tsx
import { motion } from "motion/react";

<motion.div
  initial={{ opacity: 0, scale: 0.8 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.5, ease: "easeOut" }}
/>
```

## Variants (named animation states)

```tsx
const variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

<motion.div
  variants={variants}
  initial="hidden"
  animate="visible"
  transition={{ staggerChildren: 0.1 }}
>
  {items.map(i => (
    <motion.div key={i} variants={variants} />
  ))}
</motion.div>
```

## AnimatePresence (enter/exit)

```tsx
import { AnimatePresence, motion } from "motion/react";

<AnimatePresence mode="wait">
  {page === "home" && (
    <motion.div
      key="home"
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
    />
  )}
</AnimatePresence>
```

## Layout animations (auto-morphing)

```tsx
import { motion, LayoutGroup } from "motion/react";

// Shared layoutId — elements morph between positions
<motion.div layoutId="card" onClick={() => setExpanded(!expanded)}>
  ...
</motion.div>

// Group siblings so their layout changes animate together
<LayoutGroup>
  <motion.div layout />
  <motion.div layout />
</LayoutGroup>
```

## Gestures

```tsx
<motion.div
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  whileFocus={{ boxShadow: "0 0 0 3px blue" }}
  drag
  dragConstraints={{ left: 0, right: 300 }}
  dragElastic={0.1}
/>
```

## Scroll-linked

```tsx
import { useScroll, useTransform, motion } from "motion/react";

function Parallax() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return <motion.div style={{ y, opacity }} />;
}
```

## Scroll reveal

```tsx
import { motion } from "motion/react";

// Simplest: whileInView
<motion.div
  initial={{ opacity: 0, y: 50 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-100px" }}
  transition={{ duration: 0.6 }}
/>
```

```tsx
// When you need the boolean elsewhere: useInView
import { motion, useInView } from "motion/react";
import { useRef } from "react";

function Reveal() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
    />
  );
}
```

## Key points

- `mode="wait"` on AnimatePresence: wait for exit before entering next
- `layout` prop: automatically animates layout changes (width, position)
- `layoutId`: shared layout animations across components
- Exit animations require `AnimatePresence` and direct children with `key`
- Prefer `initial`/`animate`/`exit` over CSS transitions
- Next.js App Router: components using `motion` need `"use client"`
- Styled Components / Emotion users on Motion 13+: if extra props leak to the DOM, use `motion.create(StyledDiv)` or pass `isValidProp` to `MotionConfig`
