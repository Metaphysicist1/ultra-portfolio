// Public-only discovery. Deliberately never reads environment tokens, local files, or Atlas.
import { stories } from '../lib/project-stories.mjs';
import { deployedProjects } from '../lib/deployed-projects.mjs';
const OWNER = 'Metaphysicist1';
export function publicProject(repo) {
  if (repo.private !== false || repo.visibility !== 'public' || repo.owner?.login?.toLowerCase() !== OWNER.toLowerCase()) return null;
  if (!/^[\w.-]+$/.test(repo.name)) return null;
  let website = null;
  try {
    const u = new URL(repo.homepage);
    if (u.protocol === 'https:' && !u.username && !u.password && !u.search && !u.hash && !/^(localhost|127\.|0\.|10\.|192\.168\.|\[|.*\.local$)/i.test(u.hostname)) website = u.href;
  } catch {}
  return {
    name: repo.name, description: typeof repo.description === 'string' ? repo.description : '',
    url: `https://github.com/${OWNER}/${repo.name}`, website,
    image: `https://opengraph.githubassets.com/portfolio/${OWNER}/${repo.name}`,
    story: Object.hasOwn(stories, repo.name) ? stories[repo.name] : null,
    language: typeof repo.language === 'string' ? repo.language : null,
    fork: repo.fork === true, archived: repo.archived === true,
  };
}
export function deployedProject(repo, reviewed = deployedProjects) {
  const project = publicProject(repo);
  if (!project || !Object.hasOwn(reviewed, project.name)) return null;
  return { ...project, website: reviewed[project.name].url };
}
export async function discover(fetcher = fetch, reviewed = deployedProjects) {
  const projects = [];
  for (let page = 1; page <= 100; page++) {
    const response = await fetcher(`https://api.github.com/users/${OWNER}/repos?type=owner&sort=updated&per_page=100&page=${page}`, {
      headers: { Accept: 'application/vnd.github+json', 'User-Agent': 'Edgar-Public-Portfolio' },
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) throw new Error('Public GitHub feed unavailable');
    const repos = await response.json();
    if (!Array.isArray(repos)) throw new Error('Invalid public feed');
    projects.push(...repos.map(repo => deployedProject(repo, reviewed)).filter(Boolean));
    if (repos.length < 100) return { projects, checkedAt: new Date().toISOString() };
  }
  throw new Error('Incomplete public feed');
}
export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.setHeader('Allow', 'GET, HEAD'); return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const data = await discover();
    res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=300');
    return res.status(200).json(data);
  } catch {
    res.setHeader('Cache-Control', 'no-store');
    return res.status(503).json({ error: 'Public projects temporarily unavailable' });
  }
}
