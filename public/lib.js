// Pure functions: life.json -> HTML strings and signal geometry. No DOM access, so node can test them.

const ENT = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
export const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ENT[c]);

const DATE = /^\d{4}(-\d{2})?$/;
const year = (d) => (d ? d.slice(0, 4) : "");
const filled = (s) => typeof s === "string" && s.trim() !== "";
const a = (label, url) => (filled(url) ? `<a href="${esc(url)}">${esc(label)}</a>` : esc(label));
const linkList = (links = []) => links.filter((l) => filled(l.url)).map((l) => a(l.label, l.url)).join("");

// "2024-06" -> 2024.458 (middle of June); "2024" -> 2024.5 (middle of the year).
export function toYears(date) {
  const [y, m] = date.split("-").map(Number);
  return m ? y + (m - 0.5) / 12 : y + 0.5;
}

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

export function renderTopbar(d) {
  const live = d.status && filled(d.status.url)
    ? `<a class="live" href="${esc(d.status.url)}"><i></i>${esc(d.status.label)}</a>`
    : "<span></span>";
  return `<div class="topbar mono"><span>${esc(d.name)} / log</span><span id="clock"></span>${live}</div>`;
}

export function renderHeader(d) {
  const [first, ...rest] = String(d.name ?? "").split(" ");
  const links = linkList(d.links);
  const shipped = (d.entries ?? []).filter((e) => e.kind === "shipped").length;
  const dreams = (d.entries ?? []).filter((e) => e.kind === "dream").length;
  return `<header class="hero">
  <h1 class="name"><span>${esc(first)}</span> <span>${esc(rest.join(" "))}</span></h1>
  <div class="intro">
    ${filled(d.photo) ? `<img src="${esc(d.photo)}" alt="${esc(d.name)}" width="88" height="88">` : ""}
    <div>
      ${filled(d.about) ? `<p class="about">${esc(d.about)}</p>` : ""}
      ${filled(d.place) ? `<p class="place mono">${esc(d.place)}</p>` : ""}
    </div>
  </div>
  ${links ? `<nav class="links mono">${links}</nav>` : ""}
  <figure class="signal">
    <canvas id="signal" role="img" aria-label="Timeline: ${shipped} things shipped since 2021, ${dreams} dreams ahead"></canvas>
    <figcaption class="mono">Each peak is something shipped. Dashed peaks after now are dreams.</figcaption>
  </figure>
</header>`;
}

export function renderNow(now = []) {
  const items = now.filter(filled);
  if (!items.length) return "";
  return `<section class="now"><h2 class="label mono">01 / Now</h2><ul>${items.map((t) => `<li>${esc(t)}</li>`).join("")}</ul></section>`;
}

function row(e, date, note) {
  const img = filled(e.image) ? `<figure class="shot"><img src="${esc(e.image)}" alt="${esc(e.title)}" loading="lazy"></figure>` : "";
  return `<li id="${esc(e.id)}" class="${e.kind}">`
    + `<div class="meta mono"><time>${esc(date)}</time><span class="kind">${e.kind}</span></div>`
    + `<div class="body"><h3>${a(e.title, e.url)}</h3>`
    + (filled(e.text) ? `<p>${esc(e.text)}</p>` : "")
    + (note ? `<p class="note mono">${esc(note)}</p>` : "")
    + `${img}</div></li>`;
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
  const shippedRow = (e) => {
    let note = "";
    if (e.fulfills) {
      const d = byId.get(e.fulfills);
      if (d?.kind === "dream") note = d.date ? `← dreamed ${year(d.date)}` : "← was a dream";
      else console.warn(`life.json: ${e.id} fulfills unknown dream ${e.fulfills}`);
    }
    return row(e, e.date, note);
  };

  const groups = new Map();
  for (const e of shipped) {
    const y = year(e.date);
    if (!groups.has(y)) groups.set(y, []);
    groups.get(y).push(e);
  }
  const block = (label, rows, cls = "") =>
    `<div class="year ${cls}"><div class="yr" aria-hidden="true">${esc(label)}</div><ol>${rows.join("")}</ol></div>`;

  return `<section class="log"><h2 class="label mono">02 / Log</h2>`
    + (dreams.length ? block("Next", dreamRows, "next") : "")
    + [...groups].map(([y, es]) => block(y, es.map(shippedRow))).join("")
    + `</section>`;
}

export function renderFooter(d) {
  const links = linkList(d.links) + (filled(d.cv) ? a("CV", d.cv) : "");
  return `<footer>
  <h2 class="label mono">03 / Elsewhere</h2>
  ${filled(d.motto) ? `<p class="motto">${esc(d.motto)}</p>` : ""}
  <nav class="links big">${links}</nav>
  <p class="mono stamp">Updated ${esc(d.updated)}</p>
</footer>`;
}

export const renderPage = (d) =>
  renderTopbar(d) + renderHeader(d) + renderNow(d.now) + renderLog(d.entries) + renderFooter(d);

// Geometry for the hero waveform, in 0..1 units. The past (start → now) fills [0, PAST];
// dreams sit in the future zone after the now marker.
const PAST = 0.84;
export function signalGeometry(entries = [], now, start = 2021) {
  const end = toYears(now);
  const at = (t) => Math.min(PAST, Math.max(0, ((t - start) / (end - start)) * PAST));
  const shipped = entries.filter((e) => e.kind === "shipped" && e.date);
  const dreams = entries.filter((e) => e.kind === "dream");
  const points = [
    ...shipped.map((e) => ({
      id: e.id, title: e.title, date: e.date, kind: "shipped",
      weight: e.image ? 1 : e.url ? 0.65 : 0.4,
      x: at(toYears(e.date)),
    })),
    ...dreams.map((e, i) => ({
      id: e.id, title: e.title, date: "next", kind: "dream", weight: 0.55,
      x: 0.885 + ((i + 0.5) / dreams.length) * 0.1,
    })),
  ].map((p, i) => ({ ...p, phase: i * 1.7 }));
  const ticks = [];
  for (let y = start; y <= Math.floor(end); y++) ticks.push({ label: String(y), x: at(y) });
  return { points, ticks, nowX: PAST };
}
