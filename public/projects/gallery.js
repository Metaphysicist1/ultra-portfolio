const list = document.querySelector('#repositories');
const status = document.querySelector('#feed-status');
const search = document.querySelector('#search');
let projects = [];
function link(text, href) {
  const a = document.createElement('a'); a.textContent = text; a.href = href; return a;
}
function render() {
  const q = search.value.trim().toLowerCase();
  const matches = projects.filter(p => `${p.name} ${p.description} ${p.language || ''}`.toLowerCase().includes(q));
  list.replaceChildren();
  for (const p of matches) {
    const article = document.createElement('article');
    const image = document.createElement('img');
    image.src = p.image; image.alt = `${p.name} GitHub preview`; image.loading = 'lazy'; image.width = 1200; image.height = 600;
    image.addEventListener('error', () => image.remove(), { once: true });
    const h = document.createElement('h3'); h.append(link(p.name, p.url));
    const text = document.createElement('p'); text.textContent = p.description || 'Explore the source and README on GitHub.';
    const meta = document.createElement('p'); meta.className = 'mono meta';
    meta.textContent = [p.language, p.fork && 'Fork', p.archived && 'Archived'].filter(Boolean).join(' · ');
    const links = document.createElement('nav'); links.setAttribute('aria-label', `${p.name} links`);
    links.append(link('Source ↗', p.url));
    if (p.website) links.append(link('Website ↗', p.website));
    article.append(image, h, text, meta, links); list.append(article);
  }
  document.querySelector('#result-count').textContent = `${matches.length} of ${projects.length} public repositories`;
  if (!matches.length) { const p = document.createElement('p'); p.textContent = 'No projects match your search.'; list.append(p); }
}
async function refresh() {
  try {
    const response = await fetch('/api/projects');
    if (!response.ok) throw new Error();
    const data = await response.json();
    projects = data.projects; render();
    status.textContent = `From public GitHub repositories · checked ${new Date(data.checkedAt).toLocaleString()} · refreshes every 5 minutes`;
  } catch {
    projects = []; list.replaceChildren(); document.querySelector('#result-count').textContent = '';
    status.replaceChildren(document.createTextNode('The public collection is temporarily unavailable. '), link('View all projects on GitHub ↗', 'https://github.com/Metaphysicist1?tab=repositories'));
  }
}
search.addEventListener('input', render);
refresh();
setInterval(() => { if (!document.hidden) refresh(); }, 300000);
document.addEventListener('visibilitychange', () => { if (!document.hidden) refresh(); });
