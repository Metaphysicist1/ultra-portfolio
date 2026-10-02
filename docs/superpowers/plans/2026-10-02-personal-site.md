# Personal Site (Dreams → Shipped log) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the old portfolio with a plain, human, data-driven "Dreams → Shipped" log page.

**Architecture:** `data/life.json` holds all content. `lib.js` is a pure ES module that turns that data into HTML strings and validates it (unit-tested with `node --test`). `app.js` fetches the JSON and mounts the HTML; a static fallback in `index.html` stays visible if that fails.

**Tech Stack:** HTML, CSS, vanilla JS (ES modules), Node 24 built-in test runner, headless Chrome for render checks. No dependencies, no build.

## Global Constraints

- One typeface: `Charter, "Bitstream Charter", "Sitka Text", Cambria, Georgia, serif`; 17px; left-aligned; max ~68ch; no web fonts; no hero.
- Off-white bg, black text, blue underlined links; dark mode = plain inversion via `prefers-color-scheme`.
- No cards, rounded corners, shadows, gradients, icons, emoji, badges, skill bars, counters, animation.
- Copy first person, short, factual; nothing unverifiable.
- Empty/missing optional fields are not rendered.
- `fulfills` must reference an existing `dream` id; otherwise the note is skipped and `console.warn` is logged.
- Dates are `YYYY` or `YYYY-MM`.

## File map

| File | Responsibility |
|---|---|
| `lib.js` | `esc`, `validate`, `renderHeader`, `renderNow`, `renderLog`, `renderFooter`, `renderPage` (pure) |
| `app.js` | fetch `data/life.json` → `renderPage` → mount; hide fallback |
| `index.html` | skeleton, meta tags, static fallback |
| `style.css` | all styling |
| `data/life.json` | content |
| `img/edgar.jpg`, `img/paperclaw.jpg` | real photo (resized), real Paperclaw map screenshot |
| `test/lib.test.mjs` | unit tests for lib.js + validation of the real life.json |
| removed | `styles.css`, `script.js`, `contact-success.html`, `photo.JPG` |

---

### Task 1: Pure rendering + validation library

**Files:** Create `lib.js`, `test/lib.test.mjs`

**Interfaces — Produces:**
- `esc(s: any): string`
- `validate(data): string[]` (empty = valid)
- `renderHeader(data): string`, `renderNow(now: string[]): string`, `renderLog(entries): string`, `renderFooter(data): string`, `renderPage(data): string`

- [ ] **Step 1: Write failing tests** — `test/lib.test.mjs`:

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { esc, validate, renderNow, renderLog, renderHeader } from "../lib.js";

const dream = { id: "d1", kind: "dream", date: "2023", title: "Win a hackathon" };
const done = { id: "s1", kind: "shipped", date: "2024-11", title: "Won it", text: "First place.", url: "https://x.test", fulfills: "d1" };
const older = { id: "s0", kind: "shipped", date: "2021", title: "Old thing" };

test("esc escapes html", () => {
  assert.equal(esc(`<a href="x">&'`), "&lt;a href=&quot;x&quot;&gt;&amp;&#39;");
  assert.equal(esc(undefined), "");
});

test("validate catches bad kind, date, duplicate id, dangling fulfills", () => {
  const errs = validate({ entries: [
    { id: "a", kind: "maybe", title: "t" },
    { id: "a", kind: "shipped", date: "24", title: "t", fulfills: "nope" },
  ]});
  assert.equal(errs.length, 4);
  assert.deepEqual(validate({ entries: [dream, done, older] }), []);
});

test("renderNow drops empty lines and renders nothing when empty", () => {
  assert.equal(renderNow(["", " "]), "");
  const html = renderNow(["Building X", ""]);
  assert.match(html, /<li>Building X<\/li>/);
  assert.equal((html.match(/<li>/g) || []).length, 1);
});

test("renderLog: dreams first, shipped newest first, dreamed note, link", () => {
  const html = renderLog([older, dream, done]);
  const order = ["Win a hackathon", "Won it", "Old thing"].map((t) => html.indexOf(t));
  assert.deepEqual([...order].sort((a, b) => a - b), order);
  assert.match(html, /← dreamed 2023/);
  assert.match(html, /<a href="https:\/\/x.test">Won it<\/a>/);
  assert.match(html, /done 2024/);
});

test("renderLog skips a dangling fulfills note", () => {
  const html = renderLog([{ ...done, fulfills: "missing" }]);
  assert.doesNotMatch(html, /dreamed/);
});

test("renderHeader hides links without url", () => {
  const html = renderHeader({ name: "E", links: [{ label: "GitHub", url: "https://g.test" }, { label: "Strava", url: "" }] });
  assert.match(html, /GitHub/);
  assert.doesNotMatch(html, /Strava/);
});

test("real data/life.json is valid", () => {
  const data = JSON.parse(readFileSync(new URL("../data/life.json", import.meta.url)));
  assert.deepEqual(validate(data), []);
});
```

- [ ] **Step 2: Run, expect FAIL** — `node --test` → fails: cannot find `../lib.js`.

- [ ] **Step 3: Implement** — `lib.js`:

```js
// Pure functions: life.json -> HTML strings. No DOM access, so node can test them.

const ENT = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
export const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ENT[c]);

const DATE = /^\d{4}(-\d{2})?$/;
const year = (d) => (d ? d.slice(0, 4) : "");
const filled = (s) => typeof s === "string" && s.trim() !== "";
const a = (label, url) => (filled(url) ? `<a href="${esc(url)}">${esc(label)}</a>` : esc(label));

export function validate(data) {
  const errs = [];
  const entries = data.entries ?? [];
  const ids = new Set();
  for (const e of entries) {
    if (ids.has(e.id)) errs.push(`duplicate id: ${e.id}`);
    ids.add(e.id);
    if (e.kind !== "dream" && e.kind !== "shipped") errs.push(`${e.id}: bad kind ${e.kind}`);
    if (e.date && !DATE.test(e.date)) errs.push(`${e.id}: bad date ${e.date}`);
    if (e.kind === "shipped" && !e.date) errs.push(`${e.id}: shipped needs a date`);
  }
  const dreams = new Set(entries.filter((e) => e.kind === "dream").map((e) => e.id));
  for (const e of entries) {
    if (e.fulfills && !dreams.has(e.fulfills)) errs.push(`${e.id}: fulfills unknown dream ${e.fulfills}`);
  }
  return errs;
}

export function renderHeader(d) {
  const links = (d.links ?? []).filter((l) => filled(l.url)).map((l) => a(l.label, l.url)).join(" · ");
  return `<header>
  ${filled(d.photo) ? `<img src="${esc(d.photo)}" alt="${esc(d.name)}" width="96" height="96">` : ""}
  <h1>${esc(d.name)}</h1>
  ${filled(d.about) ? `<p>${esc(d.about)}</p>` : ""}
  ${filled(d.place) ? `<p class="muted">${esc(d.place)}</p>` : ""}
  ${links ? `<p>${links}</p>` : ""}
</header>`;
}

export function renderNow(now = []) {
  const items = now.filter(filled);
  if (!items.length) return "";
  return `<section><h2>Now</h2><ul>${items.map((t) => `<li>${esc(t)}</li>`).join("")}</ul></section>`;
}

function row(e, date, kindNote) {
  const body = [a(e.title, e.url), filled(e.text) ? ` — ${esc(e.text)}` : "", kindNote ? ` <span class="note">${esc(kindNote)}</span>` : ""].join("");
  const img = filled(e.image) ? `<img src="${esc(e.image)}" alt="${esc(e.title)}" loading="lazy">` : "";
  return `<li id="${esc(e.id)}" class="${e.kind}"><time>${esc(date)}</time><span class="kind">${e.kind}</span><span class="body">${body}${img}</span></li>`;
}

export function renderLog(entries = []) {
  const byId = new Map(entries.map((e) => [e.id, e]));
  const fulfilledBy = new Map(entries.filter((e) => e.fulfills).map((e) => [e.fulfills, e]));
  const dreams = entries.filter((e) => e.kind === "dream");
  const shipped = entries.filter((e) => e.kind === "shipped").sort((x, y) => (x.date < y.date ? 1 : x.date > y.date ? -1 : 0));

  const dreamRows = dreams.map((e) => {
    const done = fulfilledBy.get(e.id);
    return row(e, e.date ? year(e.date) : "—", done ? `done ${year(done.date)}` : "");
  });
  const shippedRows = shipped.map((e) => {
    let note = "";
    if (e.fulfills) {
      const d = byId.get(e.fulfills);
      if (d?.kind === "dream") note = d.date ? `← dreamed ${year(d.date)}` : "← was a dream";
      else console.warn(`life.json: ${e.id} fulfills unknown dream ${e.fulfills}`);
    }
    return row(e, e.date, note);
  });
  return `<section><h2>Log</h2><ol class="log">${dreamRows.join("")}${shippedRows.join("")}</ol></section>`;
}

export function renderFooter(d) {
  return `<footer>${filled(d.cv) ? `${a("CV (PDF)", d.cv)} · ` : ""}updated ${esc(d.updated)}</footer>`;
}

export const renderPage = (d) => renderHeader(d) + renderNow(d.now) + renderLog(d.entries) + renderFooter(d);
```

- [ ] **Step 4: Run** `node --test` → all pass except "real data/life.json is valid" (file missing; created in Task 2).

- [ ] **Step 5: Commit** `git add lib.js test && git commit -m "feat: pure renderer + validator for life.json"`

### Task 2: Content + assets

**Files:** Create `data/life.json`, `img/edgar.jpg`, `img/paperclaw.jpg`

- [ ] **Step 1:** Resize photo: `convert photo.JPG -resize 192x192 -quality 82 -strip img/edgar.jpg`
- [ ] **Step 2:** Screenshot the live Paperclaw map: `google-chrome --headless --hide-scrollbars --window-size=1280,800 --virtual-time-budget=10000 --screenshot=/tmp/pc.png https://metaphysicist1.github.io/papercrawl/ && convert /tmp/pc.png -resize 1100x -quality 78 -strip img/paperclaw.jpg`, then open the image and confirm the map actually rendered (not blank/loading). If blank, retry with a longer budget; if still blank, omit `image`.
- [ ] **Step 3:** Write `data/life.json` with the entries from spec "Initial content" (exact content in the commit; dates from CV 2026-03 and GitHub `created_at`).
- [ ] **Step 4:** `node --test` → 7/7 pass.
- [ ] **Step 5: Commit** `feat: life.json content + real photo and paperclaw screenshot`

### Task 3: Page shell, styles, mount, cleanup

**Files:** Replace `index.html`; create `style.css`, `app.js`; delete `styles.css`, `script.js`, `contact-success.html`, `photo.JPG`; update `sitemap.xml` lastmod, `README.md`.

- [ ] **Step 1:** `app.js`:

```js
import { renderPage } from "./lib.js";

fetch("data/life.json")
  .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
  .then((data) => {
    document.getElementById("app").innerHTML = renderPage(data);
    document.getElementById("fallback").hidden = true;
  })
  .catch((err) => console.error("life.json failed to load:", err));
```

- [ ] **Step 2:** `index.html` — doctype, `lang="en"`, charset, viewport, `<title>Edgar Abasov</title>`, meta description, `color-scheme` meta, `style.css`, `<main id="app"></main>`, `<div id="fallback">` (name, about line, GitHub/LinkedIn/email/CV links), `<script type="module" src="app.js">`.
- [ ] **Step 3:** `style.css` per Global Constraints: CSS vars for light/dark, body max-width 68ch with 16px gutter, header grid (photo left), `h2` small italic muted with top rule, `.log li` grid `7ch 7ch 1fr`, `.dream` muted, `.note` italic muted, screenshot full-width of body column with 1px rule border; ≤540px: date+kind on one line, body full width below.
- [ ] **Step 4:** Delete old files, update sitemap lastmod `2026-10-02`, README one paragraph ("edit data/life.json").
- [ ] **Step 5: Commit** `feat: new page shell and styles; remove old site`

### Task 4: Verify

- [ ] `node --test` → all pass.
- [ ] Headless render at 1280 and 375 widths with `--allow-file-access-from-files`; view screenshots; check: header, Now, Log present; no horizontal scroll at 375; dark-mode screenshot via `--force-dark-mode` / emulated scheme.
- [ ] `curl -sIL` every outbound url in life.json → 2xx/3xx; drop or fix any that fail.
- [ ] Commit fixes. Do not push without the user's go-ahead.
