# Lottie (web)

## When to use

Playing After Effects animations exported as Lottie JSON (via Bodymovin) or `.lottie` files. Best for complex vector animations designed in AE that you don't want to re-code from scratch. NOT for interactive state-driven motion (use Rive instead).

> `@lottiefiles/react-lottie-player` (the `<Player>` component) is deprecated and no longer maintained. Use `@lottiefiles/dotlottie-react` for React, and `@lottiefiles/dotlottie-web` or `lottie-web` for vanilla JS.

## React (dotLottie)

```tsx
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

function Animation() {
  return (
    <DotLottieReact
      src="/animation.lottie"   // .lottie or .json
      loop
      autoplay
      style={{ width: 300, height: 300 }}
    />
  );
}
```

Useful props: `speed`, `mode` (`"forward" | "reverse" | "bounce" | "reverse-bounce"`), `segment={[start, end]}`, `marker`, `playOnHover`, `backgroundColor`.

## Controls via instance

```tsx
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useRef } from "react";

function Controlled() {
  const dotLottieRef = useRef(null);

  return (
    <>
      <DotLottieReact
        src="/anim.lottie"
        dotLottieRefCallback={(dotLottie) => {
          dotLottieRef.current = dotLottie;
        }}
      />
      <button onClick={() => dotLottieRef.current?.play()}>Play</button>
      <button onClick={() => dotLottieRef.current?.pause()}>Pause</button>
      <button onClick={() => dotLottieRef.current?.stop()}>Stop</button>
      <button onClick={() => dotLottieRef.current?.setFrame(30)}>Go to frame 30</button>
    </>
  );
}
```

## Events / segment playback

```tsx
<DotLottieReact
  src="/anim.lottie"
  autoplay
  segment={[30, 60]}   // play frames 30 to 60
  dotLottieRefCallback={(dotLottie) => {
    dotLottie?.addEventListener("complete", () => console.log("done"));
    dotLottie?.addEventListener("frame", ({ currentFrame }) => {
      // per-frame updates
    });
  }}
/>
```

Other events: `"load"`, `"play"`, `"pause"`, `"stop"`, `"loop"`.

## Vanilla JS (lottie-web)

```js
import lottie from "lottie-web";

const anim = lottie.loadAnimation({
  container: document.getElementById("container"),
  renderer: "svg",         // or "canvas"
  loop: true,
  autoplay: true,
  path: "/animation.json", // or animationData: {...}
});

anim.addEventListener("complete", () => console.log("done"));
anim.play();
anim.pause();
anim.goToAndStop(30, true);
anim.setSpeed(2); // double speed
```

`lottie-web` plays JSON only and renders to SVG/canvas DOM. dotLottie renders to a single `<canvas>` and also plays `.lottie` files.

## Loading JSON locally

```js
// As import (bundler handles it)
import animationData from "./animation.json";

lottie.loadAnimation({
  container: document.getElementById("container"),
  animationData,
  autoplay: true,
});
```

## Key points

- Lottie is **playback only** — you can't easily modify colors, shapes, text at runtime (Lottie Expressions are limited)
- For runtime-editable animations, look at Rive
- Prefer `.lottie` over `.json`: it's a zipped container, smaller over the wire, and can bundle images and multiple animations
- lottie-web canvas renderer: better performance for complex scenes; SVG renderer: sharper, supports CSS interactions
- Large Lottie files (>300KB) can block main thread — compress to `.lottie` or use a canvas renderer
