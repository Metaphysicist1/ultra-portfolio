import { renderPage, signalGeometry } from "./lib.js";
import { mountSignal } from "./signal.js";

const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

function startClock(el) {
  const fmt = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Berlin", hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const tick = () => { el.textContent = `Germany ${fmt.format(new Date())}`; };
  tick();
  setInterval(tick, 1000);
}

fetch("data/life.json")
  .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
  .then((data) => {
    document.getElementById("app").innerHTML = renderPage(data);
    startClock(document.getElementById("clock"));

    const now = new Date().toISOString().slice(0, 7);
    const signal = mountSignal(document.getElementById("signal"), signalGeometry(data.entries, now), { reduced });

    // Hovering an entry in the log lights up its peak in the waveform.
    const log = document.querySelector(".log");
    log.addEventListener("pointerover", (e) => signal.setHover(e.target.closest("li[id]")?.id ?? null));
    log.addEventListener("pointerleave", () => signal.setHover(null));
  })
  .catch((err) => console.error("life.json failed to load:", err));
