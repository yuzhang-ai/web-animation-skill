# Three.js — 3D for the web

## When to use

3D scenes, product configurators, 3D backgrounds, particles, post-processing effects. Uses WebGL/WebGPU. Heavy bundle (~600KB with OrbitControls) — lazy load it.

## Minimal scene

```js
import * as THREE from "three";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Cube
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// Light
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 5, 5);
scene.add(light);
scene.add(new THREE.AmbientLight(0x404040));

camera.position.z = 5;

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  renderer.render(scene, camera);
}
animate();
```

## React (React Three Fiber)

```tsx
import { Canvas } from "@react-three/fiber";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

function Box() {
  const ref = useRef(null);

  useFrame((state, delta) => {
    ref.current.rotation.x += delta;
    ref.current.rotation.y += delta * 0.5;
  });

  return (
    <mesh ref={ref}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="hotpink" />
    </mesh>
  );
}

function Scene() {
  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} />
      <Box />
    </Canvas>
  );
}
```

## Post-processing

```tsx
import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

<Canvas>
  <Scene />
  <EffectComposer>
    <Bloom intensity={1.5} />
  </EffectComposer>
</Canvas>
```

## Common effects

- OrbitControls: `import { OrbitControls } from "@react-three/drei"`
- GLTF models: `import { useGLTF } from "@react-three/drei"`
- Environment map: `import { Environment } from "@react-three/drei"`
- Floating animation: use `useFrame` with `Math.sin`

## Loading a 3D model

```tsx
import { useGLTF } from "@react-three/drei";

function Model() {
  const { scene } = useGLTF("/model.glb");
  return <primitive object={scene} />;
}
```

## Performance checklist

- Use `frustumCulled` (default) — skip rendering off-screen objects
- Use `instancedMesh` for 100+ identical objects
- Lower pixel ratio: `renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))`
- Use Draco-compressed `.glb` for models
- Lazy load: `React.lazy(() => import("./Scene"))`
