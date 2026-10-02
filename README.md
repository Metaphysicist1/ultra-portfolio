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
