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

## Data binding (current approach)

Rive's docs now lead with data binding: the designer exposes a **view model** (named number, boolean, string, color and trigger properties) and your code reads and writes those properties. Prefer this for new files. Use state machine inputs (next section) for older `.riv` files that don't have a view model.

```tsx
import {
  useRive,
  useViewModelInstanceNumber,
  useViewModelInstanceBoolean,
  useViewModelInstanceTrigger,
} from "@rive-app/react-canvas";

function HealthBar() {
  const { rive, RiveComponent } = useRive({
    src: "/health_bar.riv",
    stateMachines: "State Machine 1",
    autoplay: true,
    autoBind: true, // bind the artboard's default view model instance
  });

  const vmi = rive?.viewModelInstance;
  const { value: health, setValue: setHealth } = useViewModelInstanceNumber("health", vmi);
  const { setValue: setShielded } = useViewModelInstanceBoolean("shielded", vmi);
  const { trigger: hit } = useViewModelInstanceTrigger("hit", vmi, {
    onTrigger: () => console.log("hit fired"),
  });

  return (
    <>
      <RiveComponent style={{ width: 400, height: 120 }} />
      <button onClick={() => { setHealth((health ?? 100) - 10); hit(); }}>Take damage</button>
      <button onClick={() => setShielded(true)}>Shield</button>
    </>
  );
}
```

- Property names are paths: nested view models use `"settings/theme/name"`.
- `value` is `null` until the file loads or if the property doesn't exist. Use `onRiveReady` in `useRive` to set values before the first frame.
- `value` updates automatically when the animation changes the property, so you can drive React UI from Rive too.

## Controlling state machines (inputs)

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
