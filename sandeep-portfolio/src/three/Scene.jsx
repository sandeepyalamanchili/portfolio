import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import ParticleField from './ParticleField';

const STAR_COUNT = 900;

function BackgroundStars() {
  const ref = useRef();
  const positions = useMemo(() => {
    const arr = new Float32Array(STAR_COUNT * 3);
    for (let i = 0; i < STAR_COUNT; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 26;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 16;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 14 - 4;
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
      </bufferGeometry>
      <pointsMaterial
        size={0.018}
        sizeAttenuation
        transparent
        opacity={0.55}
        color="#ffffff"
        depthWrite={false}
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
