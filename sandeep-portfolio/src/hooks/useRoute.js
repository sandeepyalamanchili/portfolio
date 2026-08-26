import { useEffect, useState } from 'react';

/**
 * Minimal hash-based router. No external routing library needed for a
 * two-page site, and hash routes work on any static host (GitHub Pages,
 * Vercel, a plain file server) without extra rewrite configuration.
 */
export function useRoute() {
  const [route, setRoute] = useState(() => window.location.hash || '#home');

  useEffect(() => {
    const onHashChange = () => setRoute(window.location.hash || '#home');
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  return route;
}
