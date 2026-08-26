import { useState } from 'react';
import { useSectionScroll } from '../hooks/useSectionScroll';
import './Navbar.css';

const RAIL_ITEMS = [
  { id: 'skills', label: 'Skills' },
  { id: 'approach', label: 'Approach' },
  { id: 'impact', label: 'Impact' },
  { id: 'projects', label: 'Projects' },
];

export default function Navbar() {
  const { activeIndex, sections } = useSectionScroll();
  const [open, setOpen] = useState(false);
  const activeId = sections[activeIndex]?.id;

  return (
    <header className="nav">
      <div className="nav__inner shell">
        <a href="#hero" className="nav__brand">
          <span className="nav__mark">SY</span>
          <span>Sandeep Yalamanchili</span>
        </a>

        <nav className="nav__rail" aria-label="Primary">
          {RAIL_ITEMS.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={activeId === item.id ? 'is-active' : ''}
            >
              {item.label}
            </a>
          ))}
          <a href="#blog">Personal Blog</a>
        </nav>

        <div className="nav__action">
          <a href="#contact" className="btn btn--pearl">
            Get in touch
            <span className="btn__dot" />
          </a>
        </div>

        <button
          className="nav__toggle"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
        </button>
      </div>

      {open && (
        <div className="nav__sheet">
          {RAIL_ITEMS.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={() => setOpen(false)}
              className={activeId === item.id ? 'is-active' : ''}
            >
              {item.label}
            </a>
          ))}
          <a href="#blog" onClick={() => setOpen(false)}>
            Personal Blog
          </a>
          <a href="#contact" className="btn btn--pearl" onClick={() => setOpen(false)}>
            Get in touch
            <span className="btn__dot" />
          </a>
        </div>
      )}
    </header>
  );
}
