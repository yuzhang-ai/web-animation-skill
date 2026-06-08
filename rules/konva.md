# Konva — Canvas 2D (React)

## When to use

Complex 2D canvas rendering when you need layers, event handling, and React integration. Good for drawing tools, image editors, interactive diagrams, games. For data viz specifically, use D3.js; for generic canvas, p5.js may be simpler.

## React setup (react-konva)

```tsx
import { Stage, Layer, Rect, Circle, Text, Line, Group } from "react-konva";

function Canvas() {
  return (
    <Stage width={800} height={600}>
      <Layer>
        <Rect x={20} y={20} width={100} height={100} fill="red" />
        <Circle x={200} y={100} radius={50} fill="blue" />
        <Text x={20} y={150} text="Hello Canvas" fontSize={24} />
      </Layer>
    </Stage>
  );
}
```

## Animating

```tsx
import { useEffect, useRef } from "react";
import { Rect } from "react-konva";
import { Konva } from "konva";

function AnimatedRect() {
  const ref = useRef(null);

  useEffect(() => {
    const anim = new Konva.Animation((frame) => {
      if (ref.current) {
        ref.current.x(Math.sin(frame.time / 1000) * 100 + 150);
      }
    }, ref.current?.getLayer());
    anim.start();
    return () => anim.stop();
  }, []);

  return <Rect ref={ref} x={100} y={100} width={100} height={100} fill="red" />;
}
```

## Tween (built-in)

```tsx
import { useEffect, useRef } from "react";
import { Rect } from "react-konva";
import { Konva } from "konva";

function TweenRect() {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    const tween = new Konva.Tween({
      node: ref.current,
      x: 400,
      y: 300,
      rotation: 360,
      duration: 2,
      easing: Konva.Easings.EaseInOut,
      onFinish: () => console.log("done"),
    });
    tween.play();
  }, []);

  return <Rect ref={ref} x={100} y={100} width={100} height={100} fill="red" />;
}
```

## Events (click, drag, hover)

```tsx
<Rect
  x={100} y={100} width={100} height={100} fill="red"
  draggable
  onClick={() => alert("clicked")}
  onDragEnd={(e) => console.log(e.target.x(), e.target.y())}
  onMouseEnter={(e) => e.target.to({ fill: "blue", duration: 0.2 })}
  onMouseLeave={(e) => e.target.to({ fill: "red", duration: 0.2 })}
/>
```

## Layers and groups

```tsx
<Stage width={800} height={600}>
  <Layer>
    <Group x={100} y={100} rotation={45}>
      <Rect width={100} height={100} fill="red" />
      <Text text="Inside group" />
    </Group>
  </Layer>
  <Layer>
    {/* Another layer — independent, can be toggled */}
  </Layer>
</Stage>
```

## Image loading

```tsx
import { useImage } from "react-konva";

function KonvaImage() {
  const [image] = useImage("/photo.jpg");
  return <Image image={image} x={0} y={0} width={400} height={300} />;
}
```

## Key points

- Konva renders to Canvas — no DOM inspection, no CSS styling
- All interactions (click, hover) are handled by Konva's hit detection
- Layers are independent — you can hide/show layers for performance
- Use `<Stage>` as the root, `<Layer>` for grouping, then shapes inside
