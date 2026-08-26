import { useEffect, useRef } from 'react';

/**
 * Subtly pulls an element's content toward the cursor while hovering,
 * springing back on mouseleave. Desktop-only in effect (touch devices never
 * fire mousemove the same way, so it's inert there without extra checks).
 */
export function useMagnetic(strength = 0.35) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    function onMove(e) {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      el.style.transition = 'transform 0.15s ease-out';
      el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
    }

    function onLeave() {
      el.style.transition = 'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)';
      el.style.transform = 'translate(0, 0)';
    }

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, [strength]);

  return ref;
}
