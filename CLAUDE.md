# Claude Code Project Guide

## Tech Stack
- Astro 5, React 18 (islands), TypeScript 5, Tailwind 3.4 + DaisyUI 4.4
- Content: BibTeX publications, Markdown blogs/news (Astro content collections), YAML research data

## Build Commands
- `yarn dev` — local dev server
- `yarn build` — production build (output: `dist/`)
- `yarn preview` — preview production build
- `yarn typecheck` — TypeScript check

## Content System
- Publications: BibTeX files in `src/data/_publications/` (parsed by `src/lib/parse-bibtex.ts`)
- News: Markdown in `src/content/news/` (Astro content collection)
- Blogs: Markdown in `src/content/blogs/` (Astro content collection)
- Projects: Markdown in `src/content/projects/` (Astro content collection)
- Research: `src/data/_research/position.yaml` (loaded by `src/lib/data.ts`)
- Bio: `src/data/summary.md` (rendered to HTML by `src/lib/data.ts`)

## Architecture
- Static `.astro` components for layout, SEO, headings, footer
- React islands (`client:load`) for interactive parts: header, banner, news, research, publications, blog feedback
- BaseLayout.astro is the main HTML shell with theme initialization script
- Theme toggle reads/writes `data-theme` attribute on `<html>` and localStorage directly

## Styling
- Custom DaisyUI theme in `tailwind.config.js`
- Dark/light mode via `data-theme` attribute on `<html>`
- Orange accent: `#E45826` (secondary color)
- Fonts: Maven Pro (sans), Ubuntu Mono (mono)

## Key Conventions
- Monospace headings with `GET /path` pattern (see `src/components/Heading.astro`)
- SVG icons imported via `vite-plugin-svgr` with `?react` suffix (see `src/utils/constants.ts`)
- Static assets in `public/` (images, papers, CV, CNAME)

## Deployment
- GitHub Actions -> GitHub Pages (`.github/workflows/deploy.yml`)
- Domain: saiid.ch (CNAME in `public/`)
- Branch: main
