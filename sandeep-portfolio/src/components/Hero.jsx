import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useReveal } from '../hooks/useReveal';
import { useMagnetic } from '../hooks/useMagnetic';
import './Hero.css';

const STATS = [
  { value: 2026, label: 'Graduating' },
  { value: 6, label: 'Projects shipped' },
  { value: 5, label: 'Certifications' },
  { value: 4, label: 'Core data tools' },
];

export default function Hero() {
  const ref = useRef(null);
  const statRefs = useRef([]);
  const primaryBtnRef = useMagnetic(0.3);
  const outlineBtnRef = useMagnetic(0.3);
  useReveal(ref, { stagger: 0.1 });

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    const targets = statRefs.current.filter(Boolean);
    const proxies = targets.map(() => ({ val: 0 }));

    // count-up runs once the reveal fade has mostly finished, so it doesn't
    // fight visually with the fade/rise entrance
    const tween = gsap.to(proxies, {
      val: (i) => STATS[i].value,
      duration: 1.6,
      delay: 0.5,
      ease: 'power2.out',
      onUpdate: () => {
        proxies.forEach((p, i) => {
          if (targets[i]) targets[i].textContent = Math.round(p.val).toLocaleString();
        });
      },
    });

    return () => tween.kill();
  }, []);

  return (
    <section id="hero" className="hero" ref={ref}>
      <div className="shell hero__inner">
        <img
          src="/headshot.jpg"
          alt="Portrait of Sandeep Yalamanchili"
          className="avatar reveal"
        />

        <div className="hero__panel panel reveal">
          <p className="eyebrow">Computer Science, Class of 2026</p>
          <h1>
            <span className="lead">Anyone can log numbers.</span>
            I turn them into decisions.
          </h1>
          <p className="hero__sub">
            I&rsquo;m Sandeep Yalamanchili, a data analyst who builds dashboards, pipelines,
            and small internal tools. I take raw exports like surveys, reviews, and
            audit photos and turn them into something a team can actually use.
          </p>
        </div>

        <div className="hero__actions reveal">
          <a href="#projects" className="btn btn--pearl" ref={primaryBtnRef}>
            View projects
            <span className="btn__dot" />
          </a>
          <a
            href="/resume/Sandeep_Yalamanchili_Resume.pdf"
            className="btn btn--outline"
            download="Sandeep_Yalamanchili_Resume.pdf"
            ref={outlineBtnRef}
          >
            Download résumé
            <span className="btn__dot" />
          </a>
        </div>

        <div className="hero__stats reveal">
          {STATS.map((stat, i) => (
            <div key={stat.label}>
              <strong ref={(el) => (statRefs.current[i] = el)}>
                {window.matchMedia('(prefers-reduced-motion: reduce)').matches
                  ? stat.value.toLocaleString()
                  : 0}
              </strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
