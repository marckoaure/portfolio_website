# Portfolio Website

Personal portfolio of **Gianne Marcko G. Aure**, BS Computer Engineering student at Cavite State University.
Dark, minimalist single-page site with a few interactive touches.

## Stack

- [Next.js 16](https://nextjs.org) (App Router) + TypeScript
- Tailwind CSS v4
- [Motion](https://motion.dev) for animations
- Three.js via `@react-three/fiber` for the hero wireframe
- [Sanity](https://www.sanity.io) as a headless CMS for the Projects section
- Deployed on Vercel

## Sections

Hero → About (hover-to-type bio, stat counters) → Projects and Certifications (tilting cards, certificate folder) → Experience → Tech Stack (logo loops) → Contact → Bump Me (handshake + global counter).
A left side-navigation with scroll-spy, a light/dark toggle with a "sword slash" transition, and a loading intro tie it together.

## Running locally

```bash
npm install
npm run dev
```

Then open <http://localhost:3000>.

Copy `.env.example` to `.env.local` and fill in the Sanity values (they are public read-only settings, not secrets).

## Editing content

| What | Where |
|---|---|
| Name, bio, contact, socials, stats, tech stack, experience | `data/profile.ts` |
| Projects | Sanity Studio (separate `portfolio-studio` repo). `data/projects.ts` is the fallback used if Sanity is empty or unreachable. |
| Certifications | `data/certifications.ts` (+ images in `public/certs/`) |
| Resume PDF / headshot | `public/resume.pdf`, `public/headshot.png` |

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Production build (also type-checks) |
| `npm run lint` | ESLint (Next.js + React Compiler rules) |
| `npm start` | Serve the production build |
