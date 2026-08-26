import { useRef } from 'react';
import { useReveal } from '../hooks/useReveal';
import { asset } from '../lib/asset';
import './Approach.css';

const CARDS = [
  {
    step: '01',
    title: 'Ingest',
    copy: 'Pull the data in, whatever shape it arrives in. CSV exports, PivotTables, weekly Excel drops, all of it gets turned into something queryable.',
  },
  {
    step: '02',
    title: 'Explore',
    copy: 'Look for the pattern before the metric. Churn, ratings, order volume, the first pass is always about what\u2019s actually moving.',
  },
  {
    step: '03',
    title: 'Model',
    copy: 'Turn the pattern into something repeatable: a KPI, a segment, a scoring rule that still holds up on next week\u2019s data.',
  },
  {
    step: '04',
    title: 'Deliver',
    copy: 'Ship it as a dashboard or report someone will actually open, not a one-off notebook nobody returns to.',
  },
];

export default function Approach() {
  const ref = useRef(null);
  useReveal(ref);

  return (
    <section id="approach" className="approach" ref={ref}>
      <div className="shell">
        <div className="approach__head">
          <div className="approach__panel panel">
            <img
              src={asset('/headshot.jpg')}
              alt="Sandeep Yalamanchili"
              className="approach__signature reveal"
            />
            <p className="eyebrow reveal">How I work through a dataset</p>
            <h2 className="reveal">
              <span className="lead">From raw export</span>
              to a decision someone can make.
            </h2>
            <p className="section__sub reveal">
              Every project starts messy. This is the loop I run until it isn&rsquo;t.
            </p>
          </div>
        </div>

        <div className="approach__row">
          {CARDS.map((card) => (
            <article className="approach__card reveal" key={card.step}>
              <div className="approach__meta">
                <span>{card.step}</span>
              </div>
              <h3>{card.title}</h3>
              <p>{card.copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
