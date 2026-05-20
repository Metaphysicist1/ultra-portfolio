# Edgar Abasov — AI Engineer Portfolio

> A spatial, WebGL-driven portfolio built to Awwwards standard. Sections travel through cinematic zones as you scroll — each phase synchronized between a Three.js engine and a GSAP-animated DOM HUD layer.

[![CI](https://github.com/Metaphysicist1/portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/Metaphysicist1/portfolio/actions/workflows/ci.yml)
[![Deploy](https://github.com/Metaphysicist1/portfolio/actions/workflows/deploy.yml/badge.svg)](https://github.com/Metaphysicist1/portfolio/actions/workflows/deploy.yml)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![Three.js](https://img.shields.io/badge/Three.js-0.184-black?logo=three.js)](https://threejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?logo=tailwindcss)](https://tailwindcss.com)

---

## Architecture

```
┌──────────────────────────────────────────────────────────┐
│                        Browser                           │
│                                                          │
│  ┌─────────────────────┐  ┌───────────────────────────┐  │
│  │   WebGL Engine      │  │     DOM / HUD Layer       │  │
│  │   (z-index: 0)      │  │     (z-index: 30)         │  │
│  │                     │  │                           │  │
│  │  PhilosophicalEng   │  │  page.tsx                 │  │
│  │  ├─ HyperCore       │  │  ├─ HERO                  │  │
│  │  ├─ InteractiveAbyss│  │  ├─ SEQ_01 Philosophy     │  │
│  │  ├─ CellularNebula  │  │  ├─ SEQ_02 Experience     │  │
│  │  ├─ Tesseract (4D)  │  │  ├─ SEQ_03 Education      │  │
│  │  ├─ PhilosophyAtom  │  │  ├─ SEQ_04 Projects (6)   │  │
│  │  ├─ EducationKnot   │  │  ├─ SEQ_05 Arsenal        │  │
│  │  ├─ ArsenalOrb      │  │  ├─ SEQ_06 Credentials    │  │
│  │  └─ ConquerorsHalo  │  │  └─ SEQ_07 Contact        │  │
│  └─────────────────────┘  └───────────────────────────┘  │
│        Three.js R3F              GSAP ScrollTrigger       │
│                        Lenis smooth scroll bridge         │
└──────────────────────────────────────────────────────────┘
```

Canvas and DOM share one scroll progress value (`0.0 → 1.0`). The canvas reacts in `useFrame`; the DOM via a GSAP scrubbed timeline. Neither blocks the other.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 |
| 3D Engine | Three.js + `@react-three/fiber` + `@react-three/drei` |
| Animation | GSAP 3 + ScrollTrigger |
| Smooth Scroll | Lenis |
| Typography | Syncopate · Space Mono · Inter |
| Deploy | Vercel (Frankfurt `fra1`) |

---

## Color System — Gradient Pop

| Token | Hex | Usage |
|---|---|---|
| `brand-rose` | `#FF2D78` | Electric Rose — Experience, Contact |
| `brand-indigo` | `#3E48FF` | Neon Indigo — Tesseract, Contact |
| `brand-cyan` | `#00FFB2` | Mint Pop — Philosophy, Arsenal |
| `brand-gold` | `#FF7000` | Kinetic Orange — Credentials, HUD |
| `brand-violet` | `#9945FF` | Vivid Violet — Education, Projects |
| `background` | `#06060C` | Void Black |

---

## Project Structure

```
src/
├── app/
│   ├── globals.css          # Tailwind v4 theme + AR noise overlay
│   ├── layout.tsx           # Root layout, fonts, SmoothScroll wrapper
│   └── page.tsx             # Scroll container + all 8 HUD panels
│
└── components/
    ├── PhilosophicalEngine.tsx  # Three.js canvas — 3D objects + zones
    ├── Preloader.tsx
    └── ui/
        ├── Cursor.tsx
        └── SmoothScroll.tsx
```

---

## Quick Start

```bash
git clone https://github.com/Metaphysicist1/portfolio.git
cd portfolio
npm install
npm run dev
# → http://localhost:3000
```

**Requires:** Node.js ≥ 18, WebGL 2 capable browser.
If WebGL is unavailable the engine falls back to an animated CSS gradient — no blank screen.

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Development server with HMR |
| `npm run build` | Production build |
| `npm run start` | Serve production build locally |
| `npm run lint` | ESLint (Next.js + TypeScript) |

---

## Deployment

### Option A — Vercel CLI (fastest)

```bash
npm i -g vercel
vercel          # preview
vercel --prod   # production
```

### Option B — GitHub + Vercel Dashboard

1. Push repo to GitHub
2. [vercel.com/new](https://vercel.com/new) → Import repository
3. Zero config needed → **Deploy**

### Option C — GitHub Actions CI/CD (this repo)

Add these three secrets to **GitHub → Settings → Secrets → Actions**:

| Secret | Where to get it |
|---|---|
| `VERCEL_TOKEN` | [vercel.com/account/tokens](https://vercel.com/account/tokens) |
| `VERCEL_ORG_ID` | Run `vercel` once locally → `.vercel/project.json` |
| `VERCEL_PROJECT_ID` | Same file |

Every push to `main` then deploys automatically. Every PR gets a preview URL.

---

## Environment Variables

None required for the base portfolio. For extensions:

```env
# .env.local — optional
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

---

## Performance Notes

- WebGL: `powerPreference: "high-performance"`, `preserveDrawingBuffer: true`
- Star field: 7,000 particles, geometry reused across frames
- Three.js dynamically imported with `ssr: false` — zero server render cost
- Fonts via `next/font` — no layout shift

---

## License

MIT — use freely, attribution appreciated.
