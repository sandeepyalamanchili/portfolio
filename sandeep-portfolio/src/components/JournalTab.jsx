import { useCallback, useEffect, useRef, useState } from 'react';
import './JournalTab.css';

const PHOTOS = [
  { src: '/journal/journal-1.jpg', caption: 'Coffee break, mid-project' },
  { src: '/journal/journal-2.jpg', caption: 'Late evening, still thinking about the data' },
  { src: '/journal/journal-3.jpg', caption: 'Campus, between classes' },
  { src: '/journal/journal-4.jpg', caption: 'Same afternoon, different frame' },
  { src: '/journal/journal-5.jpg', caption: 'Outside, taking a breather' },
  { src: '/journal/journal-6.jpg', caption: 'A quieter moment' },
  { src: '/journal/journal-7.jpg', caption: 'A campus event, robe and all' },
];

export default function JournalTab({ onBack }) {
  const trackRef = useRef(null);
  const [index, setIndex] = useState(0);
  const isProgrammaticScroll = useRef(false);

  const scrollToIndex = useCallback((i) => {
    const track = trackRef.current;
    if (!track) return;
    const clamped = Math.max(0, Math.min(PHOTOS.length - 1, i));
    isProgrammaticScroll.current = true;
    track.scrollTo({ left: clamped * track.clientWidth, behavior: 'smooth' });
    setIndex(clamped);
    window.setTimeout(() => {
      isProgrammaticScroll.current = false;
    }, 500);
  }, []);

  const handleScroll = useCallback(() => {
    if (isProgrammaticScroll.current) return;
    const track = trackRef.current;
    if (!track) return;
    const nearest = Math.round(track.scrollLeft / track.clientWidth);
    setIndex((prev) => (prev === nearest ? prev : nearest));
  }, []);

  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'ArrowRight') scrollToIndex(index + 1);
      if (e.key === 'ArrowLeft') scrollToIndex(index - 1);
      if (e.key === 'Escape') onBack();
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [index, scrollToIndex, onBack]);

  return (
    <div className="journal-tab">
      <div className="journal-tab__header">
        <button className="journal-tab__back" onClick={onBack}>
          <span className="journal-tab__back-arrow" aria-hidden="true">
            ←
          </span>
          Back to portfolio
        </button>
        <span className="journal-tab__counter">
          {index + 1} / {PHOTOS.length}
        </span>
      </div>

      <div className="journal-tab__stage">
        <button
          className="journal-tab__nav journal-tab__nav--prev"
          onClick={() => scrollToIndex(index - 1)}
          disabled={index === 0}
          aria-label="Previous photo"
        >
          ‹
        </button>

        <div className="journal-tab__track" ref={trackRef} onScroll={handleScroll}>
          {PHOTOS.map((photo) => (
            <div className="journal-tab__slide" key={photo.src}>
              <img src={photo.src} alt={photo.caption} />
            </div>
          ))}
        </div>

        <button
          className="journal-tab__nav journal-tab__nav--next"
          onClick={() => scrollToIndex(index + 1)}
          disabled={index === PHOTOS.length - 1}
          aria-label="Next photo"
        >
          ›
        </button>
      </div>

      <p className="journal-tab__caption">{PHOTOS[index].caption}</p>

      <div className="journal-tab__dots">
        {PHOTOS.map((photo, i) => (
          <button
            key={photo.src}
            className={i === index ? 'is-active' : ''}
            onClick={() => scrollToIndex(i)}
            aria-label={`Go to photo ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
