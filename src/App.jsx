import { useEffect } from 'react';
import Scene from './three/Scene';
import Navbar from './components/Navbar';
import SectionRail from './components/SectionRail';
import Hero from './components/Hero';
import Skills from './components/Skills';
import Approach from './components/Approach';
import Projects from './components/Projects';
import Contact from './components/Contact';
import PersonalBlog from './components/PersonalBlog';
import CustomCursor from './components/CustomCursor';
import { SectionScrollProvider } from './hooks/useSectionScroll';
import { useRoute } from './hooks/useRoute';

function Portfolio() {
  const route = useRoute();

  useEffect(() => {
    if (route === '#blog') return;
    const id = route.replace('#', '');
    if (id) {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'auto', block: 'start' });
        return;
      }
    }
    window.scrollTo(0, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SectionScrollProvider>
      <Scene />
      <Navbar />
      <SectionRail />
      <main>
        <Hero />
        <Skills />
        <Approach />
        <Projects />
        <Contact />
      </main>
    </SectionScrollProvider>
  );
}

export default function App() {
  const route = useRoute();

  return (
    <>
      <CustomCursor />
      {route === '#blog' ? <PersonalBlog /> : <Portfolio />}
    </>
  );
}
