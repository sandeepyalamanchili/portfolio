import { useCallback, useEffect, useRef, useState } from 'react';
import Scene from '../three/Scene';
import { useReveal } from '../hooks/useReveal';
import './PersonalBlog.css';

const PHOTOS = [
  { src: '/journal/journal-1.jpg', caption: 'Coffee break, mid-project' },
  { src: '/journal/journal-2.jpg', caption: 'Late evening, still thinking about the data' },
  { src: '/journal/journal-3.jpg', caption: 'Campus, between classes' },
  { src: '/journal/journal-4.jpg', caption: 'Same afternoon, different frame' },
  { src: '/journal/journal-5.jpg', caption: 'Outside, taking a breather' },
  { src: '/journal/journal-6.jpg', caption: 'A quieter moment' },
  { src: '/journal/journal-7.jpg', caption: 'A campus event, robe and all' },
];

const AUTO_ADVANCE_MS = 4200;
const VISIBLE_RANGE = 2; // how many cards show on each side of center
const DRAG_THRESHOLD_PX = 60; // how far you need to drag before it counts as a swipe

function shortestOffset(from, to, length) {
  let diff = (to - from) % length;
  if (diff > length / 2) diff -= length;
  if (diff < -length / 2) diff += length;
  return diff;
}

function Carousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [drag, setDrag] = useState({ active: false, dx: 0 });
  const dragStartX = useRef(0);
  const stageRef = useRef(null);

  const goTo = useCallback((i) => {
    setIndex(((i % PHOTOS.length) + PHOTOS.length) % PHOTOS.length);
    setProgress(0);
  }, []);

  // auto-advance driven by rAF (not setInterval) so the progress bar can
  // track the same clock and stay perfectly in sync with the actual advance
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (paused || reduceMotion || drag.active) return undefined;

    let raf;
    let start = performance.now();

    function tick(now) {
      const elapsed = now - start;
      const pct = Math.min(1, elapsed / AUTO_ADVANCE_MS);
      setProgress(pct);
      if (pct >= 1) {
        setIndex((i) => (i + 1) % PHOTOS.length);
        start = now;
      }
      raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [paused, drag.active, index]);

  // keyboard navigation when the carousel has focus
  function onKeyDown(e) {
    if (e.key === 'ArrowLeft') goTo(index - 1);
    if (e.key === 'ArrowRight') goTo(index + 1);
  }

  // pointer-drag / swipe support (mouse + touch, unified via Pointer Events)
  function onPointerDown(e) {
    dragStartX.current = e.clientX;
    setDrag({ active: true, dx: 0 });
    setPaused(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function onPointerMove(e) {
    if (!drag.active) return;
    setDrag({ active: true, dx: e.clientX - dragStartX.current });
  }

  function onPointerUp() {
    if (drag.dx < -DRAG_THRESHOLD_PX) goTo(index + 1);
    else if (drag.dx > DRAG_THRESHOLD_PX) goTo(index - 1);
    setDrag({ active: false, dx: 0 });
    setPaused(false);
  }

  const stageWidth = stageRef.current?.clientWidth || 640;
  const dragOffsetPct = drag.active ? (drag.dx / stageWidth) * 58 : 0;

  return (
    <div
      className="carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => !drag.active && setPaused(false)}
      onKeyDown={onKeyDown}
      tabIndex={0}
      role="region"
      aria-label="Personal photo carousel"
    >
      <p className="carousel__eyebrow">Selected moments</p>

      <div
        className="carousel__stage"
        ref={stageRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={() => drag.active && onPointerUp()}
        style={{ cursor: drag.active ? 'grabbing' : 'grab' }}
      >
        {PHOTOS.map((photo, i) => {
          const offset = shortestOffset(index, i, PHOTOS.length);
          const isVisible = Math.abs(offset) <= VISIBLE_RANGE;
          const isActive = offset === 0;

          const translateX = offset * 58 + dragOffsetPct;
          const scale = isActive ? 1 : 1 - Math.abs(offset) * 0.12;
          const opacity = isVisible ? (isActive ? 1 : 0.4 - Math.abs(offset) * 0.08) : 0;

          return (
            <figure
              className={`carousel__card${isActive ? ' is-active' : ''}`}
              key={photo.src}
              style={{
                transform: `translateX(${translateX}%) scale(${scale})`,
                opacity,
                zIndex: 100 - Math.abs(offset),
                pointerEvents: isVisible ? 'auto' : 'none',
                transition: drag.active
                  ? 'none'
                  : 'transform 0.85s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.85s cubic-bezier(0.22, 1, 0.36, 1), border-color 0.4s ease',
              }}
              onClick={() => !isActive && !drag.active && goTo(i)}
            >
              <span className="carousel__badge">{String(i + 1).padStart(2, '0')}</span>
              <div className="carousel__frame">
                <img
                  src={photo.src}
                  alt={photo.caption}
                  loading="lazy"
                  draggable={false}
                  className={isActive ? 'is-kenburns' : ''}
                />
              </div>
              <figcaption>
                <span>{photo.caption}</span>
              </figcaption>
              {isActive && (
                <div className="carousel__progress">
                  <div
                    className="carousel__progress-fill"
                    style={{ transform: `scaleX(${progress})` }}
                  />
                </div>
              )}
            </figure>
          );
        })}
      </div>

      <div className="carousel__controls">
        <button
          className="carousel__arrow"
          onClick={() => goTo(index - 1)}
          aria-label="Previous photo"
        >
          ‹
        </button>
        <div className="carousel__dots">
          {PHOTOS.map((photo, i) => (
            <button
              key={photo.src}
              className={i === index ? 'is-active' : ''}
              onClick={() => goTo(i)}
              aria-label={`Go to photo ${i + 1}`}
            />
          ))}
        </div>
        <button
          className="carousel__arrow"
          onClick={() => goTo(index + 1)}
          aria-label="Next photo"
        >
          ›
        </button>
      </div>
    </div>
  );
}

export default function PersonalBlog() {
  const headRef = useRef(null);
  useReveal(headRef);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="blog-page">
      <Scene />

      <header className="blog-nav">
        <div className="shell blog-nav__inner">
          <a href="#hero" className="blog-nav__brand">
            <span className="nav__mark">SY</span>
            <span>Sandeep Yalamanchili</span>
          </a>
          <a href="#hero" className="btn btn--outline blog-nav__back">
            Back to portfolio
            <span className="btn__dot" />
          </a>
        </div>
      </header>

      <section className="blog-hero" ref={headRef}>
        <div className="shell blog-hero__inner">
          <div className="blog-panel panel reveal">
            <p className="eyebrow">Off the clock</p>
            <h1>
              <span className="lead">Personal Blog</span>
              Not everything here is a dashboard.
            </h1>
            <p className="section__sub">
              A few unposed moments between projects, campus, coffee, and the
              occasional afternoon outside. Drag, click a side card, or use
              the arrow keys.
            </p>
          </div>
        </div>
      </section>

      <section className="blog-grid-section">
        <div className="shell">
          <Carousel />
        </div>
      </section>

      <footer className="blog-footer">
        <a href="#hero">Back to portfolio</a>
        <span>&copy; {new Date().getFullYear()} Sandeep Yalamanchili</span>
      </footer>
    </div>
  );
}
