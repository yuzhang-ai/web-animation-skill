# Anime.js

## When to use

Lightweight (~17KB) standalone library. Excellent for SVG animations, CSS transforms, and multi-property keyframe sequences. No framework dependency.

## Basic

```js
import anime from "animejs";

anime({
  targets: ".box",
  translateX: 250,
  rotate: "1turn",
  backgroundColor: "#FF6B6B",
  duration: 2000,
  loop: true,
  direction: "alternate",
  easing: "easeInOutQuad",
});
```

## Keyframes (property-level)

```js
anime({
  targets: ".box",
  translateX: [
    { value: 250, duration: 1000 },
    { value: 0, duration: 1000 },
  ],
  rotate: "1turn",
  loop: true,
});
```

## SVG morphing

```js
// Animate SVG path 'd' attribute
anime({
  targets: "path",
  d: [
    { value: "M10 80 Q 95 10 180 80 T 350 80", duration: 1000 },
    { value: "M10 80 Q 95 80 180 80 T 350 80", duration: 1000 },
  ],
  easing: "easeInOutQuad",
  loop: true,
});
```

## SVG line drawing

```js
anime({
  targets: "path",
  strokeDashoffset: [anime.setDashoffset, 0],
  easing: "easeInOutSine",
  duration: 1500,
  delay: anime.stagger(200),
});
```

## Staggering

```js
anime({
  targets: ".card",
  translateY: [-20, 0],
  opacity: [0, 1],
  delay: anime.stagger(100, { start: 200 }), // 100ms between, 200ms initial
  easing: "easeOutExpo",
});
```

## Timeline

```js
const tl = anime.timeline({ easing: "easeOutExpo", duration: 600 });

tl.add({ targets: ".el-1", translateX: 200 })
  .add({ targets: ".el-2", translateX: 200 }, "-=400") // 400ms overlap
  .add({ targets: ".el-3", translateX: 200 }, "+=200"); // 200ms after
```

## Callbacks

```js
anime({
  targets: ".box",
  translateX: 200,
  begin: () => console.log("start"),
  complete: () => console.log("done"),
  update: (anim) => console.log(anim.progress), // 0..100
  loopBegin: () => {},
  loopComplete: () => {},
});
```

## React usage

```tsx
import { useEffect, useRef } from "react";
import anime from "animejs";

function Animation() {
  const ref = useRef(null);

  useEffect(() => {
    const anim = anime({
      targets: ref.current,
      translateX: 200,
      autoplay: false,
    });
    anim.play();
    return () => anim.pause();
  }, []);

  return <div ref={ref} />;
}
```

## Easing presets

```
"linear"
"easeInQuad"  "easeOutQuad"  "easeInOutQuad"
"easeInCubic" "easeOutCubic" "easeInOutCubic"
"easeInExpo"  "easeOutExpo"  "easeInOutExpo"
"easeInElastic(1, .5)"  "easeOutElastic(1, .5)"
```
