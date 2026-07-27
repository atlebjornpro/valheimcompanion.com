# Enshrouded Companion

[Enshrouded Companion](https://www.enshroudedcompanion.com) is a community-built collection of current Enshrouded guides, resource locations, progression checklists, character builds, dedicated-server help, and planning tools.

## Included tools

- Resource Finder
- Flame Upgrade Planner
- Skill Point Calculator
- Rested Calculator
- Dedicated Server Config Generator
- Adventure Checklist

## Local development

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Validation

Run the same core checks used before deployment:

```bash
npm run lint
npx tsc --noEmit
npm run build
```

The production build regenerates `public/search-index.json` from the MDX content.

## Project structure

- `content/` — MDX guides and editorial pages
- `src/app/` — Next.js routes and interactive tools
- `src/config/nav.ts` — primary navigation
- `scripts/build-search-index.mjs` — search-index generator
- `public/` — static assets and generated search data

Game information is reviewed against official Keen Games announcements, support documentation, and the Official Enshrouded Wiki. See the site's [Data Sources](https://www.enshroudedcompanion.com/data-sources) and [Editorial Policy](https://www.enshroudedcompanion.com/editorial-policy).

Enshrouded and related trademarks belong to Keen Games. This project is an independent community resource.


testtest