import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Fades + rises children of `ref` that carry the `.reveal` class in from
 * `opacity:0, translateY(16px)` on section entry. Discrete arrival, not a
 * scrubbed animation — and fully skipped for prefers-reduced-motion.
 */
export function useReveal(ref, { stagger = 0.08 } = {}) {
  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const mm = gsap.matchMedia();

    mm.add(
      {
        motion: '(prefers-reduced-motion: no-preference)',
        noMotion: '(prefers-reduced-motion: reduce)',
      },
      (context) => {
        const { motion } = context.conditions;
        const targets = root.querySelectorAll('.reveal');

        if (!motion) {
          gsap.set(targets, { opacity: 1, y: 0 });
          return;
        }

        gsap.set(targets, { opacity: 0, y: 16 });
        const trigger = ScrollTrigger.create({
          trigger: root,
          start: 'top 75%',
          once: true,
          onEnter: () => {
            gsap.to(targets, {
              opacity: 1,
              y: 0,
              duration: 0.7,
              ease: 'power2.out',
              stagger,
            });
          },
        });

        return () => trigger.kill();
      }
    );

    return () => mm.revert();
  }, [ref, stagger]);
}
