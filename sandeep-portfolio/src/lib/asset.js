/**
 * Prefixes a root-relative public-folder path (e.g. "/headshot.jpg") with
 * Vite's configured base path at build time. Needed because Vite only
 * rewrites asset URLs it can statically analyze (imports, index.html) —
 * a plain string like src="/headshot.jpg" in JSX is left untouched, which
 * breaks when the site is deployed under a subpath (e.g. GitHub Pages'
 * /portfolio/). Use this for every public/ asset referenced by string.
 */
export function asset(path) {
  const base = import.meta.env.BASE_URL; // '/' locally and on Vercel, '/portfolio/' on GH Pages
  return base.replace(/\/$/, '') + '/' + path.replace(/^\//, '');
}
