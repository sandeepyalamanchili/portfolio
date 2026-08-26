import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const SECTIONS = [
  { id: 'hero', label: 'Hero', num: '01' },
  { id: 'skills', label: 'Skills', num: '02' },
  { id: 'approach', label: 'Approach', num: '03' },
  { id: 'impact', label: 'Impact', num: '04' },
  { id: 'projects', label: 'Projects', num: '05' },
  { id: 'contact', label: 'Contact', num: '06' },
];

const SectionScrollContext = createContext({
  activeIndex: 0,
  approachProgress: 0,
});

export function SectionScrollProvider({ children }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const approachProgressRef = useRef(0);
  const [, forceTick] = useState(0);

  useEffect(() => {
    const triggers = [];

    SECTIONS.forEach((section, i) => {
      const el = document.getElementById(section.id);
      if (!el) return;
      triggers.push(
        ScrollTrigger.create({
          trigger: el,
          start: 'top center',
          end: 'bottom center',
          onEnter: () => setActiveIndex(i),
          onEnterBack: () => setActiveIndex(i),
        })
      );
    });

    const approachEl = document.getElementById('approach');
    if (approachEl) {
      triggers.push(
        ScrollTrigger.create({
          trigger: approachEl,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
          onUpdate: (self) => {
            approachProgressRef.current = self.progress;
            forceTick((t) => (t + 1) % 100000);
          },
        })
      );
    }

    return () => triggers.forEach((t) => t.kill());
  }, []);

  return (
    <SectionScrollContext.Provider
      value={{ activeIndex, approachProgress: approachProgressRef.current, sections: SECTIONS }}
    >
      {children}
    </SectionScrollContext.Provider>
  );
}

export function useSectionScroll() {
  return useContext(SectionScrollContext);
}
