# Project Context — AUTOMOBILE RENNAIS

## Stack
- **Frontend:** React 19, Vite 8, Tailwind 3.4, Framer Motion 12
- **Routing:** react-router-dom 7 (client-side SPA)
- **Email:** EmailJS (browser-based, no backend SMTP)
- **Storage:** localStorage (inventory overrides, reservations, auth)
- **Data source:** `inventory.json` bundled at build time

## Deployment Architecture
- **Host:** Vercel (SPA with `vercel.json` rewrite all → index.html)
- **Build output:** `dist/` (static files only)
- **Environment variables:** Vercel env vars for VITE_* prefixed config
- **No backend, no database, no API server**

## Business Goals
- French luxury auto dealership (Bretagne)
- Zero-maintenance public inventory site
- Staff-admin panel for daily inventory edits without git
- Mobile-first customer experience
- WhatsApp/phone-driven lead generation

## Stabilization Philosophy
- **Zero-backend architecture** — no server to maintain, no DB to migrate, no API to keep alive
- **JSON-as-source-of-truth** — inventory lives in a git-versioned JSON file; admin edits go to localStorage with a JSON export for permanent deployment
- **Dead-simple auth** — environment-variable credentials checked in-memory, no session management
- **Graceful degradation** — EmailJS is optional; forms fall back to mailto: links when unconfigured
- **Minimal dependencies** — only react, router, animation, email, and Tailwind

## Budget Constraints
- **$0 monthly operating cost** — Vercel Hobby tier, no DB, no API
- **200 free EmailJS sends/month** — sufficient for a small dealership
- **12-file core component tree** — keep surface area small for maintenance
- **No backend budget** — if a feature requires a server, it doesn't ship

## Future AI-Agent Compatibility Goals
- **Flat import structure** — hooks (`useInventory`, `useAdminInventory`) are the only data access layer
- **Single service boundary** — `inventoryService.js` encapsulates all data logic; swapping localStorage for Supabase/Firebase requires changing one file
- **No prop drilling beyond one level** — all state lives at the App or hook level
- **French locale built-in** — all UI text is French; no i18n needed
- **Predictable file naming** — components by role (`sections/`, `ui/`, `layout/`, `admin/`), services by domain (`inventory/`, `config/`)
- **No class components, no legacy patterns** — all functional with hooks
