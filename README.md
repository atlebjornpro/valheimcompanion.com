# Valheim Companion

[Valheim Companion](https://www.valheimcompanion.com) is an independent, source-backed guide focused initially on Valheim 1.0, the Deep North, dedicated servers, crossplay, world migration, backups, and server hosting.

The first public version is deliberately a factual scaffold. Detailed mechanics are added only after they can be tied to current official documentation or recorded live-game verification. The project does not attempt to replace broad Valheim wikis or seed-map sites.

## Local development

```bash
npm install
npm run dev
```

## Validation

```bash
npm run lint
npx tsc --noEmit
npm run build
```

The production build regenerates `public/search-index.json` from published MDX pages.

## Project structure

- `content/` — factual scaffold and legal pages
- `src/app/` — Next.js routes, metadata routes, and layouts
- `src/config/site.ts` — brand, domain, release facts, and official source URLs
- `src/config/routes.ts` — typed route registry
- `src/config/nav.ts` — navigation built from the route registry
- `src/config/metadata.ts` — canonical, Open Graph, and X metadata helper
- `scripts/build-search-index.mjs` — search-index generator

Valheim Companion is not affiliated with Iron Gate AB or Coffee Stain Publishing. Valheim and related trademarks belong to their respective owners.
