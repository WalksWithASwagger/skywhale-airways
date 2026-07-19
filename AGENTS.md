# Skywhale Airways Agent Guide

## Canonical entities and public facts

Skywhale Airways is the project and festival brand for the short film **I AM
NOMAD**, a psychedelic airport for time travelers. Its canonical public URL is
`https://skywhaleairways.com/`, and its public share image is
`https://skywhaleairways.com/social/i-am-nomad-og.jpg`.

The approved festival cut is v9 at **53.5 seconds**. It was created by **Kris
Krug and Suzy Easton**. Do not infer additional credits, rights, publication,
award, or festival claims.

## Sources of truth

- `index.html` and `press.html`: currently visible public facts and credits
- `production/AWARDS_QA.md` and `production/README.md`: approved final-cut facts
- `vite.config.js`: indexable page list, build inputs, and sitemap generation
- `src/analytics.js`, `.env.example`, and `vite.config.js`: env-gated analytics
  and Search Console behavior

Stop and open an issue if runtime, credits, rights, publication status, or
creator attribution conflict across those sources. Never hard-code analytics or
site-verification IDs.

## Verification

Run the following commands from the repository root:

```bash
npm ci
npm run lint
npm run build
npm run check:seo
npm run test:seo
git diff --check
```

Keep site, film, commerce, WebGL, audio, external-service, and deployment changes
out of search-signal maintenance unless an issue explicitly authorizes them.
