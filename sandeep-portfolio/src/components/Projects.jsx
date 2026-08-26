import { useRef } from 'react';
import { useReveal } from '../hooks/useReveal';
import './Projects.css';

const PROJECTS = [
  {
    name: 'Analytical Dashboard',
    tagline:
      'A self-contained hospitality analytics platform for a restaurant group. It parses guest surveys, Google Review exports, and rating trackers into one view, with sentiment analysis, a steward coaching brief, and one-click PowerPoint export.',
    tags: ['Python', 'Chart.js', 'SheetJS', 'PptxGenJS'],
    url: 'https://github.com/sandeepyalamanchili/analysis',
  },
  {
    name: 'Food Audit Management Tool',
    tagline:
      'A full-stack internal audit system for a multi-location restaurant group, with admin, manager, and auditor roles scoped to specific restaurants and audit categories.',
    tags: ['Node.js', 'SQLite', 'Role-based access'],
    url: 'https://github.com/sandeepyalamanchili/food-audit',
  },
  {
    name: 'Food Audit Photo Quality App',
    tagline:
      'A photo-based quality audit app with a dish library and a color-histogram vision engine that flags plating inconsistencies against a reference image.',
    tags: ['Next.js', 'Node.js', 'Postgres'],
  },
  {
    name: 'Google Reviews Dashboard',
    tagline:
      'A single-file dashboard that parses weekly Excel rating exports across multiple restaurant locations, with side-by-side comparison and automatic pruning of empty columns.',
    tags: ['JavaScript', 'Chart.js', 'Excel parsing'],
    url: 'https://sandeepyalamanchili.github.io/google-review',
  },
  {
    name: 'QR Cloud',
    tagline:
      'A Python-based QR code generator that converts URLs and text into QR images with automatic upload to AWS S3, built for low-latency access across devices.',
    tags: ['Python', 'AWS S3'],
  },
  {
    name: 'Customer Retention Dashboard',
    tagline:
      'A Power BI dashboard analyzing customer acquisition and retention across demographics and purchase frequency. It tracks CLV, churn rate, and NPS to surface high-value segments.',
    tags: ['Power BI', 'DAX'],
  },
];

export default function Projects() {
  const impactRef = useRef(null);
  const projectsRef = useRef(null);
  useReveal(impactRef);
  useReveal(projectsRef, { stagger: 0.08 });

  function handleTilt(e) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(700px) rotateX(${-py * 7}deg) rotateY(${px * 7}deg) translateY(-4px)`;
  }

  function resetTilt(e) {
    e.currentTarget.style.transform = '';
  }

  return (
    <>
      <section id="impact" className="impact" ref={impactRef}>
        <div className="shell impact__head">
          <div className="impact__panel panel">
            <p className="eyebrow reveal">Selected work</p>
            <h2 className="reveal">
              <span className="lead">Six problems,</span>
              six small systems that solved them.
            </h2>
            <p className="section__sub reveal">
              Restaurant operations, review data, quality audits, cloud tooling.
              Different domains, same instinct: build the smallest thing that
              actually gets used.
            </p>
          </div>
        </div>
      </section>

      <section id="projects" className="projects" ref={projectsRef}>
        <div className="shell">
          <div className="projects__grid">
            {PROJECTS.map((project) => (
              <article
                className="project-card reveal"
                key={project.name}
                onMouseMove={handleTilt}
                onMouseLeave={resetTilt}
              >
                <h3>{project.name}</h3>
                <p>{project.tagline}</p>
                <div className="project-card__tags">
                  {project.tags.map((tag) => (
                    <span className="tag" key={tag}>
                      {tag}
                    </span>
                  ))}
                </div>
                {project.url && (
                  <a
                    className="project-card__link"
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View project
                    <span className="btn__dot" />
                  </a>
                )}
              </article>
            ))}
          </div>

          <ul className="client-strip reveal">
            <li>SQL</li>
            <li>Python</li>
            <li>Power BI</li>
            <li>Tableau</li>
            <li>AWS</li>
            <li>Excel</li>
          </ul>
        </div>
      </section>
    </>
  );
}
