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

## Automatic public project collection

`/projects/` keeps the portfolio's existing portrait, project photos, and public
project descriptions. It also loads **all public repositories owned by
Metaphysicist1**, including labeled forks and archives, from `/api/projects`.
The Vercel function calls GitHub's unauthenticated public-user repository API,
paginates, rejects any row not explicitly public, and publishes only an allowlist
of public presentation fields. It does not read tokens, repository contents,
Atlas files, local paths, notes, or dashboard state.

The feed refreshes on visits, every five minutes while visible, and when a tab
becomes visible again. The Vercel cache lasts five minutes; the open page can
therefore lag a change by up to roughly ten minutes. No computer, scheduled job,
manual export, new secret, or rebuild is required for repository-list updates.
GitHub outages/rate limits display an honest error and GitHub link; old repository
snapshots are not retained as a fallback. A repository changed to private can
remain visible until the short existing cache/page refresh expires.

Project descriptions and website links follow public GitHub metadata. Set a
repository's Description and Website on GitHub to improve its entry. Existing
featured project stories are editorial content and remain in the page. GitHub
preview images are external; if an image fails, its project text and links remain.
The private Project Atlas scanner and repo are separate from this deployment.

Verification: `node --test` covers pagination, public-only filtering, the field
allowlist, unsafe website links, upstream failures, and the original portfolio.
