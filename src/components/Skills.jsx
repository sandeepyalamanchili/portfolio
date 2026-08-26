import { useRef } from 'react';
import { useReveal } from '../hooks/useReveal';
import './Skills.css';

const ITEMS = [
  {
    num: 'I',
    title: 'Data & analysis',
    line: 'SQL · Python · R',
  },
  {
    num: 'II',
    title: 'Visualization',
    line: 'Power BI · Tableau · Excel',
  },
  {
    num: 'III',
    title: 'Cloud & delivery',
    line: 'AWS S3 · Google Analytics',
  },
  {
    num: 'IV',
    title: 'Communication',
    line: 'Data storytelling · Teamwork',
  },
];

export default function Skills() {
  const ref = useRef(null);
  useReveal(ref);

  return (
    <section id="skills" className="skills" ref={ref}>
      <div className="shell skills__head">
        <div className="skills__panel panel">
          <p className="eyebrow reveal">What I bring</p>
          <h2 className="reveal">
            <span className="lead">Five tools, one habit:</span>
            asking what the data is actually saying.
          </h2>
          <p className="section__sub reveal">
            Skills only matter once they&rsquo;re pointed at a real question. This is
            the toolkit I use to get from a raw export to an answer someone can act on.
          </p>
        </div>
      </div>

      <div className="shell">
        <div className="skills__grid">
          {ITEMS.map((item) => (
            <div key={item.num} className="skills__item reveal">
              <span className="num">{item.num}</span>
              <h3>{item.title}</h3>
              <span>{item.line}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
