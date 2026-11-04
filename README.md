# edgarabasov.website

Personal page of Edgar Abasov: a log of things dreamed and things shipped.
Live at https://www.edgarabasov.website (Vercel).

## Update the site

Edit `public/data/life.json` only:

- add an entry with `"kind": "shipped"` (date `YYYY` or `YYYY-MM`), or `"kind": "dream"`;
- when a dream comes true, add the shipped entry with `"fulfills": "<dream id>"` — the page shows "← dreamed <year>";
- empty fields (e.g. a link with `"url": ""`) are not shown.

Run `node --test` before pushing; pushing to `main` deploys.

## Layout

- `public/` — the whole site, served as-is (no build, no dependencies)
  - `lib.js` pure renderers + validation, `app.js` mounts the page, `signal.js` the hero waveform
- `test/` — `node --test` unit tests, including validation of the real `life.json`
- Preview locally: `python3 -m http.server 8770 -d public`

## Deployed project collection

`/projects/` presents independently deployed apps and websites. Wortweg,
Paperclaw, UniMate, and Klar remain as featured/live project links. The collection
below them contains the reviewed Neuro Timer, Nietzsche presentation, and earlier
stamo.AI website. Repository-only work, GitHub profiles, dataset pages, portfolio
mirrors, and unverified demos are excluded from the gallery.

`lib/deployed-projects.mjs` is the publication allowlist. Check a working, separate
deployment before adding a project there. Merely making a repository public or
setting its GitHub homepage does not publish it. `/api/projects` still refreshes
public GitHub metadata automatically, but applies both public visibility and this
publication review. It does not read tokens, private code, notes, or Atlas data.

The feed refreshes on visits, every five minutes while visible, and on returning
to the tab, with a five-minute Vercel cache. Its metadata can lag by roughly ten
minutes. The publication review is dated, not an ongoing uptime check. Errors
show a GitHub link; old repository lists are not retained as a fallback.

Reviewed stories and images live in `lib/project-stories.mjs` and
`public/img/projects/`. They are editorial snapshots with public sources, image
captions, and review dates. The full story archive stays available in source
control; the API only returns entries that satisfy the publication allowlist and
current public visibility. Existing homepage timeline content remains unchanged.

Verification: `node --test` covers public-only filtering, publication eligibility,
pagination, field allowlists, image/source coverage, upstream failures, and the
original portfolio.
