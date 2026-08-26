import { useSectionScroll } from '../hooks/useSectionScroll';
import './SectionRail.css';

export default function SectionRail() {
  const { activeIndex, sections } = useSectionScroll();

  return (
    <nav className="rail" aria-label="Section progress">
      {sections.map((section, i) => (
        <a
          key={section.id}
          href={`#${section.id}`}
          className={i === activeIndex ? 'is-active' : ''}
          aria-current={i === activeIndex ? 'true' : undefined}
        >
          {section.num}
        </a>
      ))}
    </nav>
  );
}
