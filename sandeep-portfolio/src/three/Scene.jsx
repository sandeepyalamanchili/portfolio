import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import ParticleField from './ParticleField';
import {
  DIGIT_COUNT,
  makeDigitAtlasTexture,
  digitVertexShader,
  digitFragmentShader,
} from './digitAtlas';

const STAR_COUNT = 450;

function BackgroundStars() {
  const ref = useRef();
  const atlas = useMemo(() => makeDigitAtlasTexture(), []);
  const positions = useMemo(() => {
    const arr = new Float32Array(STAR_COUNT * 3);
    for (let i = 0; i < STAR_COUNT; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 26;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 16;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 14 - 4;
    }
    return arr;
  }, []);
  const digits = useMemo(() => {
    const arr = new Float32Array(STAR_COUNT);
    for (let i = 0; i < STAR_COUNT; i++) {
      arr[i] = Math.floor(Math.random() * DIGIT_COUNT);
    }
    return arr;
  }, []);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.getElapsedTime() * 0.0004;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={STAR_COUNT}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aDigit"
          count={STAR_COUNT}
          array={digits}
          itemSize={1}
        />
      </bufferGeometry>
      <shaderMaterial
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={{
          uMap: { value: atlas },
          uSize: { value: 0.06 },
          uOpacity: { value: 0.55 },
          uCols: { value: 5 },
          uRows: { value: 2 },
        }}
        vertexShader={digitVertexShader}
        fragmentShader={digitFragmentShader}
      />
    </points>
  );
}

export default function Scene() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return (
    <div className="scene-fixed" aria-hidden="true">
      <Canvas
        dpr={[1, 1.8]}
        gl={{ antialias: false, alpha: false }}
        camera={{ position: [0, 0, 7.2], fov: 42 }}
        onCreated={({ gl }) => {
          gl.setClearColor(new THREE.Color('#060608'), 1);
        }}
      >
        <BackgroundStars />
        <ParticleField reducedMotion={reducedMotion} />
        <EffectComposer multisampling={0}>
          <Bloom
            intensity={0.85}
            luminanceThreshold={0.08}
            luminanceSmoothing={0.35}
            mipmapBlur
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
