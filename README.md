# Bridgeon Assets — prototype

**Bridgeon Assets** is a European marketplace for insolvency assets — "an Idealista for insolvency assets across Europe". Professional **Disposal Partners** (brokers, licensed auctioneers, disposal firms and insolvency administrators) publish vehicles, machinery, real estate, stock and equipment; buyers search across every country at once and **contact the seller directly** — no bidding, no middleman.

This repository is a **presentation prototype**: a static Next.js site with fictional data and no backend. Everything that looks "smart" (the AI Cost Estimator, the listing import, alerts) is simulated in the browser.

Live demo (GitHub Pages): <https://lynxmindrepo.github.io/euro-asset/>

## What the demo shows

| Area | Where | What to look at |
|---|---|---|
| Search-first homepage | `/` | Search bar in the hero, live stats, categories, "Recommended for you", latest listings |
| Catalogue | `/listings` | Filters (category, country, availability, origin, price), sorting, grid / list / compact, "Save this search" |
| Listing page | `/listings/[id]` | Gallery, specifications, Disposal Partner card, "Contact the seller", **AI Cost Estimator** |
| AI Cost Estimator | on every listing | Transport, currency exchange, re-registration, customs — with an AI-style animation and follow-up questions |
| Currency & units | header | Prices in EUR, GBP, SEK, … (fixed ECB rates) and km/kg ↔ mi/lb, like airline fares |
| Saved searches & alerts | `/saved` | New-match badges, simulated email alerts when a matching listing is published |
| For buyers | `/buyers` | "Why buyers choose us" |
| For sellers | `/sell` | "Why list with us" (no prices), markets covered, partner registration |
| Partners & Resources | `/resources` | Logistics, currency, insurance, registration and escrow partners (fictional), "Coming soon" valuation |
| Disposal Partner area | `/partner` | Own listings with Edit / Mark as sold, buyer messages, **Import listing** with AI-style conversion, photo upload |
| Back office | `/admin` | Marketplace stats, all listings, buyer messages, partner registrations |

## Demo profiles

Use **Login** in the header — no password, nothing is created.

| Profile | Role | Use it to show |
|---|---|---|
| Rui Moreira — Atlas Participacoes | Buyer | Searching, saving searches, contacting sellers |
| Inês Carvalho — Tagus Recovery Partners | Disposal Partner | Importing a listing, editing, marking as sold, reading inquiries |
| Helena Duarte — Bridgeon Assets | Admin | The back office |

## A 5-minute demo script

1. **Homepage** — type "truck" in the hero search, or pick a category.
2. **Catalogue** — filter *Vehicles*, switch the header to **SEK** and **mi · lb**, then press **Save this search**.
3. **Listing** — open the Volvo truck, press **What's the total cost?** in the AI Cost Estimator, ask a follow-up, then follow **Get real quotes from our partners**.
4. **Contact** — send a message to the seller.
5. **Seller side** — log in as **Inês Carvalho**, open **My listings**, see the buyer message, then **Import a listing** → *Truck from a Swedish broker* → **Convert with AI** → add photos → **Publish to every market**.
6. **Alert** — the saved search from step 2 fires a "New match" notification and **Saved** shows a badge.
7. **Pitch pages** — finish on `/sell` and `/buyers`.

The demo state lives in the browser tab: a page refresh resets listings, messages and the login (preferences and saved searches are kept).

## What is simulated

- No backend, database, real authentication, payments or e-mail — forms show a confirmation and nothing is sent.
- No AI and no external APIs: the Cost Estimator and the import tool are rule-based and run in the browser.
- Exchange rates are fixed ECB reference rates (30 Sep 2026) stored in `data/currencies.ts`.
- Listings, Disposal Partners and service partners are fictional; partner websites point to `example.com`.
- Ten listings use illustrations instead of photos until real photos are available.
- Uploaded photos stay in the browser for the session.

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
npx tsc --noEmit   # type-check (no test suite or linter configured)
```

## Build and deploy

```bash
npm run build      # static export to out/ (+ scripts/fix-export-prefetch.mjs, see below)
```

- Every push to `main` deploys to GitHub Pages through `.github/workflows/deploy.yml`.
- Production builds are served under the `/euro-asset` base path (`next.config.ts`, `lib/site.ts`). To preview a build locally, serve `out/` so that it is reachable at `/euro-asset/` — serving it at the root breaks the asset paths. `npm start` does not work with a static export.
- `scripts/fix-export-prefetch.mjs` runs automatically after `npm run build`: it works around a Next 16 static-export naming mismatch for prefetch files that otherwise causes 404s on GitHub Pages.

## Tech

Next.js 16 (App Router, static export) · React 19 · TypeScript · Tailwind CSS 3. All state is in React context; per-visitor preferences use `localStorage`.

```text
app/          routes (listings, buyers, sell, resources, saved, partner, admin)
components/   UI, layout, listing, marketing and partner components
data/         fictional listings, partners, categories, users, rates and resources
features/     session, marketplace store, preferences, saved searches, filters
lib/          formatting, filters, Cost Estimator and import logic, helpers
public/       brand assets, listing photos and illustrations
scripts/      post-build fix for the static export
types/        TypeScript contracts
```

## Accessibility

WCAG 2.x AA is a requirement for every change: checked colour contrast (brand navy `#00183E` and orange `#FA6F06` are only used in combinations that pass), visible keyboard focus, labelled forms with announced errors, live regions for notifications and the simulated AI, reduced-motion support and layouts that work at 390 px.

## More documentation

- `toDo.md` — the client feedback turned into a task list, with what is done and what is open
- `contexto.md` — overview of the application (Portuguese)
- `CLAUDE.md` — technical guide for working on the code
