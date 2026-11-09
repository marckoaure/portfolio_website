# Adding projects, certifications and experience

Everything on the site is data-driven. You never touch a component to add content.

## Projects (the normal way: Sanity Studio)

Projects are stored in Sanity (project `pgmhlpa8`, dataset `production`). The site re-reads them every 30 seconds, so there is **no redeploy** needed.

1. Open the Studio. Either the deployed `<name>.sanity.studio` URL, or run it locally:
   ```bash
   cd ../portfolio-studio
   npm run dev
   ```
2. Click **Project → Create new** and fill in:

   | Field | What to put | Shows up as |
   |---|---|---|
   | `title` | Project name | Card title + popup heading |
   | `sortOrder` | Number. Lower = shown first. Use 1 for your newest/best. | Drives the `01 / 02 / …` number |
   | `year` | `2026` | Small label on the card |
   | `role` | `Lead Developer` | Italic line under the title in the popup |
   | `description` | 2 to 4 sentences. What it does, what you built, what it runs on. | Popup body |
   | `tech` | One tag per entry: `Laravel`, `MySQL`, … | Pill tags |
   | `liveUrl` | Demo URL, or leave empty | "Live ↗" link |
   | `githubUrl` | Repo URL, or leave empty | "Code ↗" link |
   | `image` | Screenshot (see specs below) | Card face + popup image |

3. Click **Publish**. Reload the site after ~30 s.

**Image specs:** the cards are portrait **2:3**. Export at **800 × 1200 px** (or 1000 × 1500), JPG or WebP, under ~400 KB. Landscape screenshots get cropped top/bottom by `object-cover`, so either frame a portrait crop or place the screenshot on a dark 2:3 canvas first. Both themes are fine; the title bar sits on a dark gradient at the bottom.

**Re-ordering** = change `sortOrder`. **Removing** = unpublish or delete the document.

## Projects (fallback: `data/projects.ts`)

`data/projects.ts` is used **only** when Sanity is unreachable or returns zero projects. You do not need to keep it in sync, but if Sanity is ever dropped, this file is the whole Projects section again. Same fields, plus `num` and `image` (a path under `public/`).

## Certifications

`data/certifications.ts`. Copy a block, fill in `name`, `issuer`, and optionally:

- `image`: drop the certificate image in `public/certs/` and reference it as `/certs/<file>.png` (any aspect, ~1200 px wide is plenty).
- `url`: the Coursera / Credly / LinkedIn credential link.

Entries without an image show a placeholder paper. Needs a commit + push (static data).

## Experience, bio, stats, tech stack, socials

All in `data/profile.ts`. Needs a commit + push.

- `experience[]`: newest first. `points` are the bullet lines.
- `stats[]`: the three animated counters in About. Bump `Projects` when you add one.
- `techStack[]` is the grouped text list; the scrolling logo rows are in `components/TechStack.tsx` (`row1`/`row2`/`row3`) because they need icon components from `react-icons/si`.

## Sections / navigation

`data/sections.ts` lists the sections in order and feeds both the desktop side-nav and the mobile menu. To add a section: add a `<section id="...">` in `app/page.tsx` and one entry here.

## Shipping a code/data change

```bash
npm run lint
npm run build
git add -A
git commit -m "Add <thing>"
git push
```

Vercel builds `main` automatically and the site updates in 1 to 2 minutes. Sanity edits need none of this.
