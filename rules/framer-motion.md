# Framer Motion

## When to use

React projects needing component-level enter/exit animations, layout transitions, drag gestures, or orchestrated multi-step sequences. Best React animation DX.

## Basic motion component

```tsx
import { motion } from "framer-motion";

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
import { AnimatePresence, motion } from "framer-motion";

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
// Toggle layoutId — items will morph between positions
<motion.div layoutId="card" onClick={() => setExpanded(!expanded)}>
  ...
</motion.div>

// Magic layout group
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
import { useScroll, useTransform, motion } from "framer-motion";

function Parallax() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return <motion.div style={{ y, opacity }} />;
}
```

## useInView (scroll reveal)

```tsx
import { useInView } from "framer-motion";
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
