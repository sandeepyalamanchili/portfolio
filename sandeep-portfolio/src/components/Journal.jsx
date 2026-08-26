import { useRef } from 'react';
import { useReveal } from '../hooks/useReveal';
import './Journal.css';

const PHOTOS = [
  { src: '/journal/journal-1.jpg', caption: 'Coffee break, mid-project' },
  { src: '/journal/journal-2.jpg', caption: 'Late evening, still thinking about the data' },
  { src: '/journal/journal-3.jpg', caption: 'Campus, between classes' },
  { src: '/journal/journal-4.jpg', caption: 'Same afternoon, different frame' },
  { src: '/journal/journal-5.jpg', caption: 'Outside, taking a breather' },
  { src: '/journal/journal-6.jpg', caption: 'A quieter moment' },
  { src: '/journal/journal-7.jpg', caption: 'A campus event, robe and all' },
];

export default function Journal() {
  const headRef = useRef(null);
  const gridRef = useRef(null);
  useReveal(headRef);
  useReveal(gridRef, { stagger: 0.06 });

  return (
    <section id="journal" className="journal" ref={headRef}>
      <div className="shell journal__head">
        <div className="journal__panel panel">
          <p className="eyebrow reveal">Off the clock</p>
          <h2 className="reveal">
            <span className="lead">Not everything here</span>
            is a dashboard.
          </h2>
          <p className="section__sub reveal">
            A few unposed moments between projects, campus, coffee, and the
            occasional afternoon outside.
          </p>
        </div>
      </div>

      <div className="shell journal__grid" ref={gridRef}>
        {PHOTOS.map((photo) => (
          <figure className="journal__item reveal" key={photo.src}>
            <img src={photo.src} alt={photo.caption} loading="lazy" />
            <figcaption>{photo.caption}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
