# YouTabbed

YouTabbed is a portable, local-first workspace for organizing browser tabs and saving useful team references. It works immediately after cloning: no database, account, API key, or browser extension is required for the core dashboard.

> **Important:** The current repository contains a working standalone dashboard. Browser-extension synchronization and multi-user realtime collaboration are optional integrations, not prerequisites for running the app.

## What works out of the box

The app ships with a starter workspace so a new installation is never blank or broken. Search and filtering work in the browser, tab groups can be expanded and collapsed, tabs can be saved or closed, tasks can be created, and Team Space favorites can be added and filtered. Changes to the active view, collapsed groups, saved tabs, closed tabs, project filter, and team favorites persist in the browser with `localStorage`.

The settings control in the left rail restores the starter workspace. This is useful when testing a deployment or handing the project to a new person.

## Privacy boundary

The standalone mode stores workspace state only in the current browser profile. It does not send tabs, history, cookies, passwords, form contents, or signed-in sessions to a server. The included `supabase/schema.sql` is an optional foundation for a future authenticated collaboration mode and is not required by the current app.

## Requirements

You need Node.js 22 or newer and npm. The project is a standard Next.js App Router application and can run locally, on Netlify, or on another Node-compatible hosting platform.

## Run from a fresh download

```bash
git clone https://github.com/xtermigator/you-tabbed.git
cd you-tabbed
npm install
npm run dev
```

Open the local URL printed by Next.js, normally `http://localhost:3000`.

For a production check, use:

```bash
npm run lint
npm run build
npm run start
```

## Deploy on Netlify

Create a new Netlify site from this repository and use the existing `netlify.toml`. The build command is `npm run build`, the Node version is 22, and the Next.js Netlify plugin is already configured. No environment variables are needed for standalone mode.

## Optional Supabase configuration

Supabase is not currently required for the core app. If authenticated team collaboration is added later, create `.env.local` from `.env.example` and provide the public project URL and anon key. Never expose a Supabase service-role key in browser code.

## Project structure

- `app/page.tsx` contains the interactive dashboard and local persistence layer.
- `app/globals.css` contains the visual system and responsive layout.
- `supabase/schema.sql` contains the optional collaboration schema.
- `netlify.toml` contains the portable deployment configuration.

## Current release

This release is a functional standalone dashboard rather than a static visual prototype. The next product integration would be a browser extension that supplies real Chrome, Edge, Firefox, or Safari tab data; the dashboard is intentionally usable without that extension so a fresh download has a working experience immediately.
