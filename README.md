# YouTabbed

YouTabbed is a local-first browser dashboard that organizes open tabs and lets teams share approved favorites by project.

## Privacy boundary

Open tabs, browser history, cookies, passwords, form contents, and signed-in browser sessions stay on the member's computer. Supabase stores only team-approved records such as projects, shared favorites, notes, tags, contributors, and timestamps.

## Stack

- Next.js App Router
- Netlify hosting and continuous deployment
- Supabase Auth, Postgres, Row Level Security, and Realtime
- Chrome and Edge Manifest V3 extensions in the next implementation phase
- Local companion application for private cross-browser tab consolidation

## Local development

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env.local` when the Supabase project is ready.

## Netlify

Connect this repository from the Netlify dashboard. Netlify detects Next.js automatically. The production build command is `npm run build`.

## Current status

The dashboard and Team Space are an interactive prototype using demonstration data. The Supabase schema is in `supabase/schema.sql`; live authentication and realtime subscriptions are the next phase.
