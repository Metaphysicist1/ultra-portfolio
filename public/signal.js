// Hero waveform: one bump per shipped entry, dashed bumps for dreams after "now".
// Geometry comes from lib.js signalGeometry(); this file only draws and handles the pointer.

export function mountSignal(canvas, geo, { reduced = false } = {}) {
  const ctx = canvas.getContext("2d");
  const pad = 10;
  let w = 0, h = 0, t = 0, last = 0, raf = 0, visible = true, hover = null;

  const css = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const X = (x) => pad + x * (w - 2 * pad);
  const base = () => h - 34;
  const amp = (p) => (8 + p.weight * (h - 64)) * (reduced ? 0.92 : 0.84 + 0.16 * Math.sin(t * 1.4 + p.phase));
  const spread = (p) => (7 + p.weight * 9) * Math.max(0.4, Math.min(1, w / 1200)); // narrower peaks on small screens
  const bump = (px, p) => amp(p) * Math.exp(-(((px - X(p.x)) / spread(p)) ** 2));
  const past = geo.points.filter((p) => p.kind === "shipped");
  const future = geo.points.filter((p) => p.kind === "dream");
  // Tallest bump wins (not the sum), so entries in the same month don't stack off the top.
  const yAt = (px, pts) => base() - pts.reduce((m, p) => Math.max(m, bump(px, p)), 0);

  function size() {
    const r = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = r.width; h = r.height;
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function trace(pts, from, to, wobble) {
    ctx.beginPath();
    for (let px = from; px <= to; px += 1.5) {
      let y = yAt(px, pts);
      if (wobble) y += Math.sin(px * 0.05 - t * 3) * 0.9;
      px === from ? ctx.moveTo(px, y) : ctx.lineTo(px, y);
    }
    ctx.stroke();
  }

  function draw() {
    const fg = css("--fg"), dim = css("--dim"), line = css("--line"), pulse = css("--pulse");
    const nx = Math.round(X(geo.nowX)) + 0.5;
    ctx.clearRect(0, 0, w, h);
    ctx.font = '500 10px "Martian Mono", ui-monospace, monospace';
    ctx.lineWidth = 1;

    for (const tk of geo.ticks) {
      const x = Math.round(X(tk.x)) + 0.5;
      ctx.strokeStyle = line;
      ctx.beginPath(); ctx.moveTo(x, base() + 8); ctx.lineTo(x, h - 2); ctx.stroke();
      ctx.fillStyle = dim; ctx.fillText(tk.label, x + 5, h - 4);
    }
    ctx.strokeStyle = pulse;
    ctx.beginPath(); ctx.moveTo(nx, 4); ctx.lineTo(nx, h - 2); ctx.stroke();
    ctx.fillStyle = pulse; ctx.fillText("NOW", nx + 5, h - 4);

    ctx.lineWidth = 1.25;
    ctx.strokeStyle = fg; ctx.setLineDash([]);
    trace(past, X(0), nx, !reduced);
    ctx.strokeStyle = dim; ctx.setLineDash([3, 4]);
    trace(future, nx, X(1), false);
    ctx.setLineDash([]);

    for (const p of geo.points) {
      const px = X(p.x), py = yAt(px, p.kind === "dream" ? future : past);
      const on = hover === p;
      ctx.beginPath(); ctx.arc(px, py, on ? 4 : 2.25, 0, Math.PI * 2);
      if (p.kind === "dream") { ctx.strokeStyle = on ? pulse : dim; ctx.stroke(); }
      else { ctx.fillStyle = on ? pulse : fg; ctx.fill(); }
    }

    if (hover) {
      const px = X(hover.x), py = yAt(px, hover.kind === "dream" ? future : past);
      const label = `${hover.date} · ${hover.title}`.toUpperCase();
      const tw = ctx.measureText(label).width;
      const lx = Math.min(Math.max(px - tw / 2, 0), w - tw);
      const ly = Math.max(py - 14, 12);
      ctx.fillStyle = css("--bg"); ctx.fillRect(lx - 4, ly - 11, tw + 8, 15);
      ctx.fillStyle = fg; ctx.fillText(label, lx, ly);
    }
  }

  function loop(now) {
    t += Math.min((now - last) / 1000, 0.05); last = now;
    draw();
    raf = visible ? requestAnimationFrame(loop) : 0;
  }
  const start = () => { if (!reduced && !raf) { last = performance.now(); raf = requestAnimationFrame(loop); } };

  function pick(evt) {
    const r = canvas.getBoundingClientRect();
    const mx = evt.clientX - r.left;
    let best = null, d = 16;
    for (const p of geo.points) { const dx = Math.abs(X(p.x) - mx); if (dx < d) { d = dx; best = p; } }
    return best;
  }
  function setHover(p) {
    if (p === hover) return;
    hover = p;
    canvas.style.cursor = p ? "pointer" : "default";
    if (reduced) draw();
  }

  canvas.addEventListener("pointermove", (e) => setHover(pick(e)));
  canvas.addEventListener("pointerleave", () => setHover(null));
  canvas.addEventListener("click", (e) => {
    const p = pick(e);
    const el = p && document.getElementById(p.id);
    if (!el) return;
    el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
    el.classList.add("flash");
    setTimeout(() => el.classList.remove("flash"), 1600);
  });

  new ResizeObserver(() => { size(); draw(); }).observe(canvas);
  new IntersectionObserver(([en]) => { visible = en.isIntersecting; if (visible) start(); }).observe(canvas);
  matchMedia("(prefers-color-scheme: dark)").addEventListener("change", draw);
  size(); draw(); start();

  return { setHover: (id) => setHover(geo.points.find((p) => p.id === id) ?? null) };
}
