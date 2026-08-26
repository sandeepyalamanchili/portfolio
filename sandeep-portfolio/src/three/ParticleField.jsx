import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { gsap } from 'gsap';
import * as THREE from 'three';
import { SHAPES, scatterField } from './shapes';
import { useSectionScroll } from '../hooks/useSectionScroll';
import {
  DIGIT_COLS,
  DIGIT_ROWS,
  DIGIT_COUNT,
  makeDigitAtlasTexture,
  digitVertexShader,
  digitFragmentShader,
} from './digitAtlas';

export const POINT_COUNT = 10000;

const SHAPE_ORDER = ['torusKnot', 'sphereNetwork', 'trefoil', 'comet', 'halo', 'starburst'];

const SCATTER_FRACTION = 0.3; // first 30% of a transition scatters
const TRANSITION_MS = 2800;

function easeInOutCubic(x) {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

function easeInOutQuad(x) {
  return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
}

function lerpArrays(a, b, t, out) {
  for (let i = 0; i < a.length; i++) {
    out[i] = a[i] + (b[i] - a[i]) * t;
  }
  return out;
}

export default function ParticleField({ reducedMotion = false }) {
  const { activeIndex, approachProgress } = useSectionScroll();
  const groupRef = useRef();
  const pointsRef = useRef();
  const materialRef = useRef();
  const atlas = useMemo(() => makeDigitAtlasTexture(), []);

  // one random digit (0-9) per particle, stable for the component's life
  const digits = useMemo(() => {
    const arr = new Float32Array(POINT_COUNT);
    for (let i = 0; i < POINT_COUNT; i++) {
      arr[i] = Math.floor(Math.random() * DIGIT_COUNT);
    }
    return arr;
  }, []);

  // Precompute every base shape + a couple of scatter fields once.
  const shapes = useMemo(() => {
    const map = {};
    SHAPE_ORDER.forEach((key) => {
      map[key] = SHAPES[key](POINT_COUNT);
    });
    map.ring = SHAPES.ring(POINT_COUNT);
    return map;
  }, []);

  const scatter = useMemo(() => scatterField(POINT_COUNT, 3.4), []);

  const positions = useMemo(() => new Float32Array(shapes.torusKnot), [shapes]);

  const state = useRef({
    from: new Float32Array(shapes.torusKnot),
    to: new Float32Array(shapes.torusKnot),
    display: new Float32Array(shapes.torusKnot),
    transitioning: false,
    startTime: 0,
    lastIndex: 0,
    settledApproachTarget: new Float32Array(POINT_COUNT * 3),
    pointerX: 0,
    pointerY: 0,
  });

  // fires imperatively from useFrame comparing activeIndex to lastIndex,
  // so we don't need an effect + extra re-render for the transition kickoff.

  useFrame(({ clock, pointer }) => {
    const s = state.current;
    const geometry = pointsRef.current?.geometry;
    if (!geometry) return;

    const targetKey = SHAPE_ORDER[activeIndex];
    let target = shapes[targetKey];

    // Approach section (index 2) morphs live from trefoil -> ring as the
    // user scrolls through it, on top of the section-to-section transition.
    if (activeIndex === 2 && targetKey === 'trefoil') {
      target = lerpArrays(shapes.trefoil, shapes.ring, approachProgress, s.settledApproachTarget);
    }

    const now = clock.getElapsedTime() * 1000;

    if (activeIndex !== s.lastIndex && !reducedMotion) {
      // kick off a fresh scatter transition toward the new section's shape
      s.from.set(s.display);
      s.to.set(target);
      s.transitioning = true;
      s.startTime = now;
      s.lastIndex = activeIndex;
    } else if (activeIndex !== s.lastIndex && reducedMotion) {
      // reduced motion: cross-fade opacity instead of scattering — hold the
      // shape statically, dip to transparent, swap, fade back in
      s.lastIndex = activeIndex;
      const mat = materialRef.current;
      const uOpacity = mat?.uniforms?.uOpacity;
      if (uOpacity) {
        gsap.killTweensOf(uOpacity);
        gsap.to(uOpacity, {
          value: 0,
          duration: 0.35,
          ease: 'power1.out',
          onComplete: () => {
            s.display.set(target);
            gsap.to(uOpacity, { value: 0.9, duration: 0.35, ease: 'power1.in' });
          },
        });
      } else {
        s.display.set(target);
      }
    } else if (activeIndex === 2) {
      // continuous live morph while scrubbing inside Approach — ease toward
      // the current blended target without re-triggering the scatter effect
      s.to.set(target);
      if (!s.transitioning) {
        for (let i = 0; i < s.display.length; i++) {
          s.display[i] += (target[i] - s.display[i]) * 0.045;
        }
      }
    }

    if (s.transitioning) {
      const elapsed = now - s.startTime;
      const t = Math.min(1, elapsed / TRANSITION_MS);

      if (t < SCATTER_FRACTION) {
        const local = t / SCATTER_FRACTION;
        const eased = easeInOutQuad(local);
        lerpArrays(s.from, scatter, eased, s.display);
      } else {
        const local = (t - SCATTER_FRACTION) / (1 - SCATTER_FRACTION);
        const eased = easeInOutCubic(local);
        lerpArrays(scatter, s.to, eased, s.display);
      }

      if (t >= 1) {
        s.transitioning = false;
        s.display.set(s.to);
      }
    }

    geometry.attributes.position.array.set(s.display);
    geometry.attributes.position.needsUpdate = true;

    if (groupRef.current) {
      // smooth the raw pointer signal so the tilt feels like it's drifting
      // toward the cursor rather than snapping to it
      s.pointerX += (pointer.x - s.pointerX) * 0.02;
      s.pointerY += (pointer.y - s.pointerY) * 0.02;

      groupRef.current.rotation.y += 0.00016;
      groupRef.current.rotation.x =
        Math.sin(now * 0.000015) * 0.045 + s.pointerY * 0.18;
      groupRef.current.rotation.y += s.pointerX * 0.0006;
    }
  });

  return (
    <group ref={groupRef}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={POINT_COUNT}
            array={positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-aDigit"
            count={POINT_COUNT}
            array={digits}
            itemSize={1}
          />
        </bufferGeometry>
        <shaderMaterial
          ref={materialRef}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          uniforms={{
            uMap: { value: atlas },
            uSize: { value: 0.052 },
            uOpacity: { value: 0.9 },
            uCols: { value: DIGIT_COLS },
            uRows: { value: DIGIT_ROWS },
          }}
          vertexShader={digitVertexShader}
          fragmentShader={digitFragmentShader}
        />
      </points>
    </group>
  );
}
