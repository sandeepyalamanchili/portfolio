# Sandeep Yalamanchili — Portfolio

A scroll-driven WebGL portfolio built from Sandeep's résumé: React + Vite,
react-three-fiber / drei / postprocessing for the Three.js layer, GSAP +
ScrollTrigger for section-to-morph wiring. Same 10,000-point particle system
as the original studio template this was adapted from, retimed to a data
analyst's actual work: a network globe for skills, a knot that unwinds into
a ring for the analysis loop, a comet + halo for the project showcase, and
a constellation behind the contact form.

## Run it

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build -> dist/
npm run preview   # serve the production build locally
```

## What's new in this pass

- **Fixed a real deployment bug** I'd have shipped otherwise: the headshot,
  résumé link, and all 7 journal photos were hardcoded as `/headshot.jpg`
  style absolute paths. That works locally and on Vercel, but breaks under
  GitHub Pages' subpath (`/portfolio/`) — those images would have 404'd on
  the live site. Added `src/lib/asset.js`, a small helper that prefixes
  every public-folder reference with Vite's actual base path at runtime, and
  applied it everywhere an image or the résumé link is referenced. Verified
  this by inspecting the compiled JS bundle directly, not just the source.
- Set `base: '/portfolio/'` in `vite.config.js` to match your actual repo
  name (`sandeepyalamanchili/portfolio`) — comment this line back out if you
  deploy to Vercel/Netlify instead of GitHub Pages, since they serve from
  the domain root.
- **The Personal Blog page is substantially reworked**, not just tweaked:
  - The background behind the carousel now tints itself to match the
    dominant color of whichever photo is active, sampled from the image
    itself via a canvas and cached per-photo, and cross-fades smoothly as
    you move between photos. This is the same trick Spotify/Apple Music use
    for now-playing screens.
  - **Click the active photo to open a full lightbox** — dims the whole
    page, shows the photo at full size, with its own prev/next arrows and
    Escape-to-close.
  - The carousel itself is bigger and better proportioned, with a large
    italic editorial-style caption beneath it instead of a small caption
    crammed inside the card.
  - A "01 / 07" counter next to the section label so you always know where
    you are.
  - All previous functionality carried over: drag-to-swipe, auto-advance
    with a synced progress bar, arrow-key navigation, the Ken Burns zoom on
    the active photo.

- **The carousel is now genuinely interactive, not just auto-playing.**
  Drag it with your mouse or finger and it follows your cursor in real
  time; release past a threshold and it snaps to the next/previous photo.
  Works with touch on mobile too (tuned so vertical page scroll still
  works fine, only horizontal drags are captured).
- **Left/right arrow keys** move the carousel when it's focused (click it
  once, then use the keyboard).
- **A thin progress bar along the top of the active card** fills up over
  the auto-advance interval, so you can actually see time passing rather
  than being surprised by a jump. It's driven by the same clock as the
  auto-advance itself (via `requestAnimationFrame`), not a separate timer,
  so they can't drift out of sync.
- **A subtle cinematic zoom on the active photo** — each photo starts
  slightly zoomed in and settles to its normal size over ~6 seconds (a
  "Ken Burns" effect), so even a photo you're looking at for a few seconds
  has quiet motion in it.
- Fixed a layout collision from the previous pass where the progress bar
  and the numbered badge would have overlapped at the top of the card.

- **The Personal Blog carousel is now a "coverflow" style, not a single flat
  slide.** The active photo sits large and centered; the two photos on
  either side peek in at reduced scale and opacity, so the whole thing
  reads as one continuous, layered strip rather than a single static image
  swapping out. Modeled after the "Selected Work" carousel pattern in the
  reference video you sent (numbered badge per card, gradient caption
  overlay, smooth eased motion between cards).
- Still auto-advances on its own, still pauses on hover, still has working
  dot indicators and arrow buttons, clicking a peeking side card also jumps
  straight to it now.
- Added a subtle hover response on the side cards (their border picks up
  the accent color) so the carousel feels interactive even before you
  click anything.

- **A custom cursor** on desktop: a small accent-colored dot with a soft
  trailing ring, matching the particle system's color language. It widens
  when hovering anything clickable. Disabled entirely on touch devices.
- **The particle sculpture now tilts toward your cursor** as you move the
  mouse, a subtle parallax effect on top of its constant slow rotation.
- **Magnetic buttons**: the primary CTAs (View projects, Download résumé,
  Send request) pull slightly toward your cursor when you hover near them,
  then spring back when you leave.
- **Animated stat counters** in Hero: the four numbers (2026, 6, 5, 4)
  count up from zero on page load instead of just appearing.
- Removed two orphaned files (`JournalTab.jsx`/`.css`) left over from an
  earlier carousel implementation that was never wired up, dead code with
  no effect on the site, just cleaned up for clarity.

## What's new from earlier passes

- **Personal Blog is now a separate page**, not a section in the main
  scroll. It lives at the `#blog` route (e.g. `yoursite.com/#blog`) and has
  its own header with a "Back to portfolio" link. The main portfolio nav
  has a "Personal Blog" link that takes you there.
- Routing is a small custom hook (`src/hooks/useRoute.js`) based on the URL
  hash, not a routing library. This was a deliberate choice: hash routing
  works on any static host (GitHub Pages, Vercel, a plain file server)
  without needing server-side rewrite rules, which a "real" path like
  `/blog` would require.
- 7 personal photos on that page now (added one more from a recent upload),
  each resized/compressed for the web (stripped of metadata, capped at
  1200px) and stored in `public/journal/`.
- The captions under each photo are placeholder text I wrote (e.g. "Coffee
  break, mid-project") since none were specified. Edit
  `src/components/PersonalBlog.jsx` to change them.
- Custom "SY" favicon (was still the default Vite scaffold icon before).
- Open Graph, Twitter card, and JSON-LD `Person` structured data in
  `index.html`, so link previews and search results actually show your
  name, role, and headshot instead of nothing.
- The résumé button now genuinely downloads the file (`download` attribute)
  instead of just opening it in a new tab.
- Removed the graduation years from the Education list in Contact (was
  "· 2026" etc. after each entry).

(An earlier pass added a status badge, a scroll-cue arrow, hover-lift
effects on cards, and a "back to top" footer link. Those were rolled back
on request. An even earlier pass put the personal photos inline as a
"Journal" section within the main scroll — that's now this separate page
instead, per a later request.)

## Sections

1. **Hero** — headline, résumé download, headshot (extracted from the
   uploaded PDF), and four stat chips.
2. **Skills** — SQL/Python/R, Power BI/Tableau/Excel, AWS/Google Analytics,
   and storytelling/collaboration, laid out around the network-globe canvas.
3. **Approach** — a four-step Ingest → Explore → Model → Deliver loop,
   written as a general description of how the projects below were built.
4. **Impact + Projects** — six real projects pulled from your working
   memory and the résumé, each with a tag list and a link where one was
   confirmed.
5. **Contact** — a request form, direct contact links (email/phone/LinkedIn
   from the résumé), and an education + certifications block (no years).

A separate **Personal Blog** page (`#blog`) holds the photo grid — see
above.

## What's real vs. invented

Everything in Skills, Education, and Certifications comes directly off the
résumé. The six Projects entries and their taglines are written from what's
on record about each one; two have confirmed links, the rest don't (see
below) so I didn't fabricate a URL for them. The **Approach** section's
four-step framing (Ingest/Explore/Model/Deliver) is not something you told
me explicitly — it's my synthesis of how the projects were actually built,
written to give the page a narrative arc. Worth reading over and correcting
before this goes live, the same as the rest.

### Confirm before shipping

- **`public/headshot.jpg`** — extracted from the résumé PDF's embedded
  image. Swap for a higher-res version if you have one.
- **Project links** — `Analytical Dashboard` → github.com/sandeepyalamanchili/analysis,
  `Food Audit — Management Tool` → github.com/sandeepyalamanchili/food-audit,
  `Google Reviews Dashboard` → sandeepyalamanchili.github.io/google-review.
  `Food Audit — Photo Quality App`, `QR Cloud`, and `Customer Retention
  Dashboard` are left without a link because I don't have a confirmed repo
  or hosted URL for them — add one in `src/components/Projects.jsx` if you
  have it.
- **`public/resume/Sandeep_Yalamanchili_Resume.pdf`** — this is the exact
  file you uploaded; replace it here if you update your résumé so the
  "Download résumé" button always points at the current version.
- **Contact form** — currently just shows a confirmation message on submit;
  it isn't wired to actually send anywhere. Point it at a form service
  (Formspree, Resend, etc.) or your own backend before relying on it.
- **Accent color** — added a single teal accent (`--accent` in
  `src/styles/globals.css`) since a personal portfolio can carry a bit more
  color than a studio brand; change the hex there if it's not your taste.

## Publishing it live

This is a standard Vite + React app, so it deploys to any static host —
Vercel, Netlify, GitHub Pages, Cloudflare Pages. It does **not** work as a
Framer site: Framer is a visual builder for pages made in their own editor,
with custom React "Code Components" dropped in as individual pieces — it
can't take over an entire independent app like this one (custom WebGL
canvas, scroll-driven animation, hash routing, dozens of interlinked files)
without a full rebuild inside Framer's component model.

### Vercel (recommended — you've already used this for other projects)

1. Push this folder to a GitHub repo.
2. On [vercel.com](https://vercel.com), **Add New → Project**, pick the repo.
3. Leave the defaults (Vite is auto-detected: build command `npm run build`,
   output directory `dist`) and click **Deploy**.
4. Every future `git push` redeploys automatically.

### GitHub Pages (also free — matches your Google Reviews Dashboard setup)

1. In `vite.config.js`, uncomment the `base` line and set it to your repo
   name, e.g. `base: '/portfolio/'`.
2. Run:
   ```bash
   npm run deploy
   ```
   (this builds the site and pushes `dist/` to a `gh-pages` branch via the
   `gh-pages` package, already added as a dev dependency)
3. In the GitHub repo's Settings → Pages, set the source to the `gh-pages`
   branch. Your site will be live at
   `https://sandeepyalamanchili.github.io/portfolio/` within a few minutes.

Either way, once it's live, update the `og:url`/JSON-LD `url` field in
`index.html` to the real published URL for correct link previews.
