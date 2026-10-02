# Personal site redesign — design

Date: 2026-10-02
Repo: Metaphysicist1/Metaphysicist1.github.io (GitHub Pages, served from `main` root)

## Purpose

An informative card about Edgar — who he is — not a job-seeking page. No "hire me", no
availability, no metrics funnel. A stranger should leave thinking: *engineer, entrepreneur,
future thinker; a dreamer who actually ships.*

## Core idea: Dreams → Shipped log

The page is a dated ledger of a life. Two kinds of entries:

- **dream** — something aimed at. Rendered grey. No date required.
- **shipped** — something built, launched, won, finished. Rendered black, with a link if one exists.

A shipped entry may name the dream it fulfils (`fulfills`); it then shows a plain-text note
`← dreamed <year>`. The site's thesis is expressed by the data, not by a tagline.

## Anti-"AI-generated" rules (hard constraints)

- One typeface: system serif stack (`Charter, "Bitstream Charter", "Sitka Text", Cambria, Georgia, serif`), no web fonts. 17px, left-aligned, max ~68ch. No hero.
- Off-white background, black text, default blue underlined links. Dark mode = plain inversion via
  `prefers-color-scheme`, nothing more.
- No cards, rounded corners, shadows, gradients, glass, icons, emoji, badges, skill bars, counters.
- No animation, no scroll effects, no hover effects beyond the browser default link behaviour.
- Copy in first person, in Edgar's own words; short; no triadic slogans.
- Real material only: real photo (small, uncropped), real screenshot of Paperclaw's map, real dates.
- Nothing unverifiable: no star counts, no compliance claims, no percentages without source.

## Page structure

1. **Header** — name, one line in his words ("Engineer, entrepreneur, future thinker. Dreamer and doer."),
   location line (Greifswald / Berlin), small photo, links (GitHub, LinkedIn, email; Strava/music/Instagram
   only when filled in).
2. **Now** — 1–3 lines. Empty items are not rendered.
3. **Log** — ledger rows: `date | kind | title — one line | link | ← dreamed <year>`.
   Sorted newest first; dreams (undated) listed in their own short block at the top of the log.
   On narrow screens columns stack; the kind word stays visible.
4. **Footer** — CV link (PDF), "last updated" date taken from the data file.

## Data model — `data/life.json`

```json
{
  "updated": "2026-10-02",
  "name": "Edgar Abasov",
  "about": "Engineer, entrepreneur, future thinker. Dreamer and doer.",
  "place": "Greifswald / Berlin",
  "photo": "photo.JPG",
  "links": [{ "label": "GitHub", "url": "https://github.com/Metaphysicist1" }],
  "now": ["Building Paperclaw — ..."],
  "entries": [
    { "id": "paperclaw", "kind": "shipped", "date": "2026-09", "title": "Paperclaw",
      "text": "...", "url": "https://metaphysicist1.github.io/papercrawl/", "image": "img/paperclaw.png",
      "fulfills": null }
  ]
}
```

Rules: empty/missing optional fields are not rendered; `fulfills` must reference an existing
`dream` id, otherwise the note is skipped and a console warning is logged.

## Initial content (verified from CV 2026-03 + GitHub)

Source of truth: `Edgar_Abasov_Resume.pdf` (March 2026). Master's is at the University of Greifswald
(shown under Now); Kiel was an Erasmus+ year. CV link points to this PDF.


Shipped: Paperclaw (2026, live map), ClipVault (2026), neuro-timer (2026, live), Supply-AI-Agent +
White-Label AI Concierge (2026), PneuNet (2025, live on Cloud Run), AWS ML Specialty (2025-02),
Math for ML specialization (2025-04), Clustar + Kaggle dataset (2025), stamo.AI co-founder/COO and
MediaLab 5K Lari winner (2024), CoverBot (2024, live), Bank of Georgia AI Engineer (2023-10 → 2024-09,
chatbot accuracy +15%), B.Sc. CS Batumi (2024-02), Erasmus+ exchange year M.Sc. Data Science at HAW Kiel (ended 2026-02), Python teacher to 80+
kids (2021–24), BSU speech-to-text research (2021–22), Azure Data Scientist cert (2021).

Dreams (drafted, Edgar to confirm/replace): turn an agent into a self-sustaining company; win an
international hackathon. Running/music dreams and Strava/music links left empty until provided.

Removed: phone number, skill bars, star counts, "HIPAA compliant", Werkstudent pitch,
`contact-success.html`, old `styles.css`/`script.js`.

## Architecture

- `index.html` — semantic skeleton + `<noscript>` fallback (name, about, links, CV).
- `style.css` — < 150 lines, no framework.
- `app.js` — vanilla JS, fetches `data/life.json`, renders sections. Pure functions
  (`renderHeader`, `renderNow`, `renderLog`, `fulfilledNote`) so they can be unit-checked.
- Kept: CV PDF, photo, `robots.txt`, `sitemap.xml` (updated date).
- No build step, no dependencies.

## Error handling

If `life.json` fails to load, the `<noscript>`-equivalent static fallback stays visible
(it is hidden only after a successful render).

## Testing

- Validate `life.json` (every `fulfills` points to a dream id; dates `YYYY` or `YYYY-MM`).
- Render check in a headless browser: no console errors, all sections present, mobile width 375px
  without horizontal scroll, all outbound links return 2xx/3xx.
