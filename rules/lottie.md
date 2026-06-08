# Lottie (web)

## When to use

Playing After Effects animations exported as JSON via Bodymovin. Best for complex vector animations designed in AE that you don't want to re-code from scratch. NOT for interactive state-driven motion (use Rive instead).

## React (LottieFiles player)

```tsx
import { Player } from "@lottiefiles/react-lottie-player";

function Animation() {
  return (
    <Player
      autoplay
      loop
      src="https://assets.lottiefiles.com/packages/lf20_xxx.json"
      style={{ width: 300, height: 300 }}
    />
  );
}
```

## Controls via ref

```tsx
import { Player } from "@lottiefiles/react-lottie-player";
import { useRef } from "react";

function Controlled() {
  const playerRef = useRef(null);

  return (
    <>
      <Player ref={playerRef} src="/anim.json" autoplay={false} />
      <button onClick={() => playerRef.current?.play()}>Play</button>
      <button onClick={() => playerRef.current?.pause()}>Pause</button>
      <button onClick={() => playerRef.current?.stop()}>Stop</button>
    </>
  );
}
```

## Events / segment playback

```tsx
<Player
  ref={playerRef}
  src="/anim.json"
  onEvent={(e) => {
    if (e === "complete") console.log("done");
  }}
  // Play frames 30 to 60
  keepLastFrame={true}
  onLoad={() => playerRef.current?.setSeeker(30)}
/>
```

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
- Canvas renderer: better performance for complex scenes
- SVG renderer: better quality, supports CSS interactions
- Large Lottie files (>300KB) can block main thread — consider canvas renderer
