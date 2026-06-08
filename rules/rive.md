# Rive

## When to use

Interactive character animations, animated icons, complex state-driven motion. Rive is a design tool (like Figma for animation) — designers create `.riv` files, developers embed and control them. Runs on Canvas/WebGL, bypasses DOM entirely.

## React setup

```tsx
import { useRive, Layout, Fit, Alignment } from "@rive-app/react-canvas";

function RiveDemo() {
  const { rive, RiveComponent } = useRive({
    src: "/animation.riv",
    stateMachines: "State Machine 1",
    layout: new Layout({
      fit: Fit.Contain,
      alignment: Alignment.Center,
    }),
    autoplay: true,
  });

  return <RiveComponent style={{ width: 400, height: 400 }} />;
}
```

## Controlling state machines

```tsx
import { useRive, useStateMachineInput } from "@rive-app/react-canvas";

function RiveCharacter() {
  const { rive, RiveComponent } = useRive({
    src: "/character.riv",
    stateMachines: "Idle",
    autoplay: true,
  });

  // Bind to boolean input in state machine
  const isHappy = useStateMachineInput(rive, "Idle", "isHappy");

  return (
    <>
      <RiveComponent />
      <button onClick={() => (isHappy.value = !isHappy.value)}>
        Toggle Mood
      </button>
    </>
  );
}
```

## Trigger-based animations

```tsx
const { rive, RiveComponent } = useRive({
  src: "/like.riv",
  stateMachines: "Main",
  autoplay: true,
});

function fireTrigger() {
  rive?.fireStateMachineInput("Main", "clicked");
}
```

## Play single animation (no state machine)

```tsx
const { rive, RiveComponent } = useRive({
  src: "/bounce.riv",
  animations: "bounce",
  autoplay: true,
});

// Control playback
rive?.play("bounce");
rive?.pause();
rive?.reset();
```

## Vanilla JS (no React)

```js
import { Rive } from "@rive-app/canvas";

const rive = new Rive({
  src: "/anim.riv",
  canvas: document.getElementById("canvas"),
  autoplay: true,
});
```

## Key points

- Animation logic lives in the `.riv` file (built in Rive editor)
- You only write **control code** — triggers, input values
- Multiple artboards in one file → each is a separate animation
- State machines are optional; single animations work too
- Renders via Canvas — total isolation from CSS/HTML
