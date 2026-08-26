import { useRef, useState } from 'react';
import { useReveal } from '../hooks/useReveal';
import { useMagnetic } from '../hooks/useMagnetic';
import './Contact.css';

const EDUCATION = [
  {
    title: 'B.E. in Computer Science and Engineering',
    place: 'Sathyabama Institute of Science and Technology, Chennai',
  },
  {
    title: 'Intermediate (MPC)',
    place: 'Resonance, Vijayawada',
  },
  {
    title: '10th Class (CBSE)',
    place: "V.S. St. John's Higher Secondary School",
  },
];

const CERTIFICATIONS = [
  'Power BI & Tableau',
  'AWS Python',
  'Python Master Class',
  'Front-End Development',
  'UI/UX Fundamentals',
];

export default function Contact() {
  const ref = useRef(null);
  useReveal(ref);
  const [submitted, setSubmitted] = useState(false);
  const submitBtnRef = useMagnetic(0.3);

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <section id="contact" className="contact" ref={ref}>
      <div className="shell contact__inner">
        <div className="contact__panel panel reveal">
          <p className="eyebrow">Let&rsquo;s talk data</p>
          <h2>
            <span className="lead">Got a dataset</span>
            that needs a story?
          </h2>
          <p className="section__sub">
            I&rsquo;m looking for data analyst roles. Happy to walk through any of
            the projects above in more detail.
          </p>
        </div>

        {submitted ? (
          <p className="contact__confirm reveal panel">
            Sent. I&rsquo;ll be in touch within two working days.
          </p>
        ) : (
          <form className="contact__form reveal panel" onSubmit={handleSubmit}>
            <input type="text" name="name" placeholder="Name" required />
            <input type="email" name="email" placeholder="Email" required />
            <button type="submit" className="btn btn--pearl" ref={submitBtnRef}>
              Send request
              <span className="btn__dot" />
            </button>
          </form>
        )}

        <div className="contact__links reveal">
          <a href="mailto:sandeepyalamanchili10@gmail.com">sandeepyalamanchili10@gmail.com</a>
          <a href="tel:+919490923366">+91 94909 23366</a>
          <a href="https://linkedin.com/in/sandeep" target="_blank" rel="noopener noreferrer">
            linkedin.com/in/sandeep
          </a>
        </div>

        <div className="contact__credentials reveal panel">
          <div>
            <h4>Education</h4>
            <ul>
              {EDUCATION.map((item) => (
                <li key={item.title}>
                  <span className="credential__title">{item.title}</span>
                  <span className="credential__meta">{item.place}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4>Certifications</h4>
            <ul className="credential__tags">
              {CERTIFICATIONS.map((cert) => (
                <li key={cert} className="tag">
                  {cert}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <footer className="contact__footer">
        <span>&copy; {new Date().getFullYear()} Sandeep Yalamanchili</span>
      </footer>
    </section>
  );
}
