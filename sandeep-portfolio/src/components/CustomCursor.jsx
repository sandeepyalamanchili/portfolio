import { useEffect, useRef } from 'react';
import './CustomCursor.css';

/**
 * A small glowing dot that trails the real cursor with a slight lag, plus a
 * wider ring that snaps to hoverable elements. Desktop/mouse only — bails
 * out entirely on touch devices so it never gets in the way on mobile.
 */
export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
    if (isTouch) return undefined;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return undefined;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let dotX = mouseX;
    let dotY = mouseY;
    let ringX = mouseX;
    let ringY = mouseY;
    let hovering = false;
    let raf;

    document.body.classList.add('has-custom-cursor');

    function onMove(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }

    function onOver(e) {
      hovering = Boolean(e.target.closest('a, button, input, .journal, [role="button"]'));
    }

    function tick() {
      dotX += (mouseX - dotX) * 0.35;
      dotY += (mouseY - dotY) * 0.35;
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;

      dot.style.transform = `translate(${dotX}px, ${dotY}px)`;
      ring.style.transform = `translate(${ringX}px, ${ringY}px) scale(${hovering ? 1.8 : 1})`;

      raf = requestAnimationFrame(tick);
    }

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseover', onOver);
    raf = requestAnimationFrame(tick);

    return () => {
      document.body.classList.remove('has-custom-cursor');
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div className="custom-cursor__ring" ref={ringRef} aria-hidden="true" />
      <div className="custom-cursor__dot" ref={dotRef} aria-hidden="true" />
    </>
  );
}
