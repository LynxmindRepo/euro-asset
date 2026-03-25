# EuroAssets Demo

Visual Next.js prototype for a European marketplace focused on insolvency, liquidation, restructuring, and judicial sale processes. The current phase is a demo-ready MVP with local mock data, no backend, fixed `EUR` currency, and a design direction explicitly grounded in `design.md`.

## Documentation

- `design.md`: primary visual reference and mandatory design source
- `design-system-guide.md`: operational translation of the applied design system
- `mock-data-guide.md`: inventory of mock data and simulated flows
- `AGENTS.md`: short rules to preserve structural and visual consistency

## What Is Implemented

- public experience for browsing special situations processes across Europe
- homepage refined as a stronger institutional entry point with featured process emphasis
- header navigation refined around `Overview`, `Processes`, and `Dossier`
- mock login flow in the header for buyer/admin entry, switching, and logout
- `/auctions` catalogue with `Grid`, `List`, and `Compact` views
- catalogue sorting by latest, highest value, closing soon, and alphabetical order
- progressive catalogue loading via `Load more`
- catalogue cards and rows are clickable across `Grid`, `List`, and `Compact`
- catalogue filter bar refined into a clearer control surface with active-state feedback and reset
- process detail with legal, documentary, and operational context
- integrated opening gallery and stronger top-of-page case frame on process detail
- executive summary section for fast case reading
- detail layout reorganized for non-sticky proposal flow, with action/context grouped more coherently
- enriched hero processes for Lisbon, Milan, and Marseille to support stronger demo storytelling
- real process imagery mapped from `public/` for Lisbon, Valencia, Milan, and Marseille
- proposal flow from desktop side panel or mobile drawer
- proposal panel with value presets and reference impact
- proposal dossier with formal checklist and submitting-entity block
- visible flow steps across process, dossier, submission, and confirmation
- checkout with success and simulated error state
- mock login and role switching between `user` and `admin`
- admin dashboard with stronger backoffice hierarchy and in-memory process creation
- mock data for Portugal, Spain, Italy, and France
- single-language English UI aligned to insolvency, industrial buyers, and global traders
- institutional copy refined across home, catalogue, dossier, checkout, and admin flows
- stronger admin reading aligned with a lightweight institutional backoffice

## Applied Design Decisions

- premium institutional, editorial, restrained visual language
- `Manrope` for display and headline typography
- `Inter` for body copy, labels, and supporting data
- tonal surface separation instead of `1px` dividers
- primary CTAs using midnight blue gradients
- champagne/gold emphasis for value-led states
- low-aggression form styling
- generous breathing room and controlled architectural asymmetry

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- local in-memory state for mock session, proposal dossier, and process creation

## Run Locally

1. Install dependencies

```bash
npm install
```

2. Start development server

```bash
npm run dev
```

3. Open the app

```text
http://localhost:3000
```

4. Validate production build

```bash
npm run build
```

## Available User Journey

1. Enter the home page at `/`
   The homepage now foregrounds a featured process, institutional trust signals, category navigation, and additional live processes.
2. Explore processes at `/auctions`
   The catalogue supports multiple views, dropdown-based filters, sorting, progressive loading, and full-card click-through behavior.
3. Open a process at `/auctions/[id]`
   The detail page opens with an integrated gallery, executive summary, legal/commercial framing, and a desktop proposal rail that now scrolls naturally with the page.
4. Start a proposal from the panel or mobile drawer
5. Add it to the proposal dossier
6. Review and edit at `/cart`
7. Deliver formally at `/checkout`
8. Review confirmation at `/checkout/success`
9. Open the login modal from the header and switch to the `admin` profile
10. Open `/admin` and create a new process at `/admin/new`

## Mock Users

- `Helena Duarte` - `admin`
- `Rui Moreira` - `user`

The active profile is controlled from the mock login flow in the header.

## Included UX States

- global page loading
- local feedback in bidding and admin flows
- simple success and error toasts
- flow steps reinforcing journey progression
- empty states in restricted views, dossier, and admin access guard
- simulated error path in checkout
- artificial submission delay for demo realism
- active-state feedback in catalogue filters
- clickable catalogue rows/cards with keyboard support

## Main Structure

```text
app/                routes and pages
components/         reusable UI, layout, and feedback
data/               mock processes, categories, and users
features/           mock session and in-memory store
hooks/              helper hooks
lib/                utilities and label helpers
public/             local process imagery and fallback SVG assets
types/              TypeScript contracts
```

## Current Limitations

- no real backend
- no persistence after refresh
- no real authentication
- no payments
- no realtime
- no external API integration
- dossiers, submissions, and admin-created processes live only in client memory
- some visual tuning remains inherently subjective and may still benefit from manual demo-by-demo QA

## Recommended Next Steps

1. Persist processes, proposals, and submissions in a real backend.
2. Introduce real authentication and role-based authorization.
3. Connect process creation and proposal delivery to real APIs.
4. Add real uploads, a document room, and media management.
5. Evolve the proposal flow toward compliance, auditability, and persistent process history.
