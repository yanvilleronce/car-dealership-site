# Template Guide — React SPA Starter for Small Businesses

This document describes how to reuse this project as a base template for future
zero-backend websites. It is architecture documentation only — it does not change
any code.

---

## 1. Folder Structure

```
├── index.html              Entry HTML — meta tags, OG, Schema.org, fonts, sitemap link
├── vite.config.js          Vite config — manual chunk splitting, dev server port
├── tailwind.config.js      Tailwind theme — brand colors, fonts, spacing, animations
├── vercel.json             SPA rewrite rule — all routes → index.html
├── postcss.config.js       PostCSS with Tailwind + Autoprefixer
├── eslint.config.js        ESLint flat config — React hooks + Refresh rules
│
├── public/
│   ├── favicon.svg         SVG favicon (replace with brand icon)
│   ├── icons.svg           SVG icon sprites (optional, replace as needed)
│   ├── sitemap.xml         Static sitemap — 6 URLs, update domain per project
│   └── robots.txt          Allows all crawlers, points to sitemap
│
├── src/
│   ├── main.jsx            Entry point — StrictMode + BrowserRouter mount
│   ├── App.jsx             Route definitions + auth state + PublicLayout wrapper
│   ├── index.css           Tailwind directives + component classes + custom scrollbar
│   ├── constants.js        Brand contact info — name, phone, email, address
│   │
│   ├── pages/              One file per route target
│   │   ├── Home.jsx
│   │   ├── InventoryPage.jsx
│   │   ├── VehicleDetail.jsx
│   │   ├── MentionsLegales.jsx
│   │   └── PolitiqueConfidentialite.jsx
│   │
│   ├── components/
│   │   ├── layout/         Structural wrappers (Navbar, Footer)
│   │   ├── ui/             Primitives (VehicleCard, MobileCTA, SectionHeading)
│   │   ├── sections/       Page-section composites (Hero, InquiryForm, etc.)
│   │   └── admin/          Admin-only (AdminPanel, VehicleForm, CSVUploader, etc.)
│   │
│   ├── inventory/          Domain logic — data service, JSON seed, auth, CSV, reservations
│   ├── config/             Third-party config (EmailJS)
│   ├── hooks/              React hooks (useInventory — single data access layer)
│   └── utils/              Utilities (track.js — analytics abstraction)
│
├── PROJECT_CONTEXT.md      Decision log, architecture rationale, budget constraints
└── TEMPLATE_GUIDE.md       This file — reuse instructions
```

### Directory Roles

| Directory | Purpose | Changes needed for new project |
|---|---|---|
| `src/pages/` | Page-level route targets | Replace content, keep or discard routes |
| `src/components/layout/` | Persistent page wrappers | Keep structure, replace logo/nav links |
| `src/components/ui/` | Generic primitives (cards, buttons, headings) | Keep — they are already generic |
| `src/components/sections/` | Page-section composites (Hero, InquiryForm) | Replace copy, keep interaction patterns |
| `src/components/admin/` | Admin panel for staff inventory editing | Keep if admin needed; discard if not |
| `src/inventory/` | Data layer — service, JSON, auth, CSV, reservations | Swap JSON schema + constants |
| `src/config/` | EmailJS integration | Keep with different env vars; or delete |
| `src/hooks/` | Reactive data hook | Keep — adapt `inventoryService.js` for new domain |
| `src/utils/` | Tracking | Keep — swap event names per domain |

---

## 2. Reusable Modules

### 2.1 Inventory System

**Location:** `src/inventory/`

**Files (5):**

| File | What it does | Reusable as-is? |
|---|---|---|
| `inventoryService.js` | CRUD + queries + filtering + formatting + price/mileage formatters | ✅ Logic is generic — replace `inventory.json` schema, update constants |
| `inventory.json` | Seed data — vehicle catalog | 🔄 Replace schema and data for any product/service catalog |
| `auth.js` | 19-line env-var credential check | ✅ Drop-in for any project needing dead-simple auth |
| `csvUtils.js` | CSV import/export for staff bulk edits | ✅ Generic — CSV column config is per-entity |
| `reservationService.js` | Lead/appointment CRUD in localStorage | ✅ Generic — works for any "book this item" flow |

**What makes it reusable:**

- All data access goes through a single service.
- All component data access goes through a single hook (`useInventory`).
- localStorage provides runtime overrides without a backend.
- JSON file is the deployed source of truth — version-controlled, no database.

**To reuse for a new domain (e.g., real estate, rentals, products):**

1. Replace `inventory.json` schema and seed data.
2. Update `VEHICLE_STATUSES`, `VEHICLE_TYPES`, `STATUS_LABELS`, and similar constants in the `inventoryService.js` to match the new domain.
3. Update `filterVehicles()` query fields to match the new schema.
4. Rename routes (e.g., `/inventaire` → `/catalog`, `/vehicule/:id` → `/item/:id`).

### 2.2 Tracking System

**Location:** `src/utils/track.js`

**Files (1):** `track.js` — 6 lines, zero dependencies.

```js
export function track(event, data) {
  console.log(`[ar_track] ${event}`, data)
  window.dispatchEvent(new CustomEvent('ar_track', { detail: { event, data } }))
}
```

**Architecture:** Fires a `CustomEvent` on `window` and logs to console. Future analytics (GA4, Plausible, etc.) listens for `ar_track` events — no component code changes needed.

**To reuse:** Copy `track.js`. Optionally prefix event names per domain. To integrate GA4, add
a one-time listener in `main.jsx`:

```js
window.addEventListener('ar_track', (e) => {
  gtag('event', e.detail.event, e.detail.data)
})
```

**Currently wired events (6 total, in 4 components):**

| Component | Events |
|---|---|
| `VehicleCard` | `view_vehicle` |
| `MobileCTA` | `click_phone` |
| `InquiryForm` | `submit_inquiry` |
| `ReservationModal` | `reserve_vehicle`, `request_financing`, `schedule_test_drive` |

### 2.3 CTA / Lead Capture System

**Location:** `src/components/sections/` (4 files) + `src/components/ui/` (1 file)

| File | Pattern | What it captures |
|---|---|---|
| `ReservationModal.jsx` | Modal form → localStorage + EmailJS + mailto fallback | Reservation requests, financing inquiries, test drive scheduling |
| `InquiryForm.jsx` | Contact form → EmailJS + mailto fallback | General inquiries with phone + message |
| `FinancingCTA.jsx` | Benefits grid + inline form → mailto | Financing application inquiries |
| `MobileCTA.jsx` | Sticky bottom bar with phone link, 30-min dismiss cooldown | Phone calls (tracks click) |

**Architecture pattern:** All forms share:
- EmailJS as primary delivery with gracefil mailto fallback.
- localStorage for offline resilience.
- `utils/track.js` for analytics.
- Validation handled per-form.

**To reuse:** Replace copy and validation rules. The EmailJS integration should be reconfigured with new templates. If EmailJS is not desired, forms fall back to `mailto:` links automatically when env vars are unset.

### 2.4 Constants System

**Location:** `src/constants.js`

**Files (1):** `constants.js` — 5 lines, zero dependencies.

Exports:
- `PHONE_NUMBER` — raw dial string (e.g., `+33780940002`)
- `PHONE_DISPLAY` — human-readable (e.g., `+33 7 80 94 00 02`)
- `EMAIL` — contact address
- `ADDRESS` — physical address
- `DEALERSHIP_NAME` — business name

**Consumed by:** `Navbar`, `Footer`, `MobileCTA`, `InquiryForm`, `FinancingCTA`, and re-exported from `inventoryService.js`.

**To reuse:** Edit the 5 string values. No other file needs changing.

### 2.5 Email / Lead System

**Location:** `src/config/emailjs.js`

**Files (1):** `emailjs.js` — 102 lines.

**Architecture:**
- Reads 4 env vars (`VITE_EMAILJS_*`) — EmailJS service ID, dealer template, customer template, public key.
- `EMAILJS_CONFIGURED` boolean gates all sends — if env vars are unset, degrades silently.
- `sendDealerNotification()` + `sendCustomerConfirmation()` — build and send parameterized emails.
- All send functions return `{ success, error }`; callers handle fallback (e.g., opening `mailto:`).

**Template parameters built per function:**
- `buildDealerParams(vehicle, form)` — vehicle details + customer contact + financing/discovery preferences.
- `buildCustomerParams(vehicle, form)` — vehicle info + next-step instructions.

**To reuse:** Create new EmailJS templates matching the parameter shapes, set 4 env vars in Vercel. To use a different email provider (SendGrid, Resend, etc.), replace the send functions in this file — component callers don't change.

---

## 3. Deployment Workflow

### Hosting: Vercel (Hobby tier — $0/mo)

**Files involved:**

| File | Role |
|---|---|
| `vercel.json` | SPA rewrite rule: `{"rewrites": [{"source": "/(.*)", "destination": "/index.html"}]}` |
| `vite.config.js` | Manual chunk splitting (`react-vendor`, `router`, `motion`) + dev port 3005 |

**First-time Vercel deploy:**

```
npm install -g vercel        # or npx vercel
vercel login
vercel                       # link project, auto-detects Vite
vercel --prod                # first production deploy
```

**Environment variables (set in Vercel dashboard → Project → Settings → Environment Variables):**

| Variable | Required | Purpose |
|---|---|---|
| `VITE_EMAILJS_SERVICE_ID` | No (graceful fallback) | EmailJS service identifier |
| `VITE_EMAILJS_TEMPLATE_DEALER` | No | Template sent to dealer on form submit |
| `VITE_EMAILJS_TEMPLATE_CUSTOMER` | No | Template sent to customer on form submit |
| `VITE_EMAILJS_PUBLIC_KEY` | No | EmailJS account public key |
| `VITE_ADMIN_EMAIL` | Yes (auth) | Admin panel login email |
| `VITE_ADMIN_PASSWORD` | Yes (auth) | Admin panel login password |

Admin auth is checked in-memory (no session, no DB). Credentials are never exposed to clients.

### Domain: Namecheap (or any DNS provider)

| Step | Detail |
|---|---|
| 1. Buy domain | Namecheap (or existing registrar) |
| 2. Add domain in Vercel | Vercel dashboard → Project → Domains → enter domain |
| 3. Update DNS | Point apex (`@`) to Vercel's nameservers or add a CNAME to `cname.vercel-dns.com` |
| 4. SSL | Vercel provisions automatic Let's Encrypt certificates |
| 5. Update sitemap.xml | Replace `https://automobile-rennais.fr` with new domain |
| 6. Update robots.txt | Replace sitemap URL |
| 7. Update index.html | Replace canonical URL, OG URLs, Schema.org URLs |

**Build & deploy (after DNS + first deploy are set):**

```
npm run build                # → dist/
git push                     # Vercel auto-deploys from linked git branch
```

Or deploy manually:
```
vercel --prod                # deploys current directory
```

---

## 4. Rules for Safe Cloning

These rules prevent common mistakes when forking this project for a new website.

### 4.1 Search-and-Replace Checklist

Before modifying any component logic, run through this list:

```
Search in src/ for:          Replace with:
─────────────────────────────────────────────────
automobile-rennais.fr       <new-domain>
AUTOMOBILE RENNAIS          <new-business-name>
Parthenay-de-Bretagne       <new-city>
35850                       <new-postal-code>
7 Rue des Sillons           <new-address>
+33 7 80 94 00 02           <new-phone>
+33780940002                <new-phone-raw>
contact@automobile-rennais  <new-email>
```

Files to update specifically:

| File | What to update |
|---|---|
| `src/constants.js` | All 5 values (phone, email, address, name) |
| `index.html` | Title, meta description, OG tags, Twitter Card, Schema.org JSON, hreflang, canonical |
| `public/sitemap.xml` | Domain in all `<loc>` elements |
| `public/robots.txt` | Sitemap URL |
| `src/components/layout/Footer.jsx` | Business name, address lines, phone, email |
| `src/components/sections/FinancingCTA.jsx` | Email reference (if email is used as mailto fallback) |
| `src/components/sections/InquiryForm.jsx` | Email fallback in form error handling |
| `src/inventory/auth.js` | `VITE_ADMIN_EMAIL` and `VITE_ADMIN_PASSWORD` env var names (keep unless renaming) |

### 4.2 What NOT to Touch

- **`src/inventory/inventoryService.js`** — The service is domain-agnostic. Only change the `VEHICLE_STATUSES`, `VEHICLE_TYPES`, and schema-related constants. The CRUD functions (`getAllVehicles`, `addVehicle`, `updateVehicle`, etc.) are generic.
- **`src/hooks/useInventory.js`** — The hook is generic. It calls `inventoryService` functions and syncs cross-tab state via `storage` event. No changes needed unless renaming the data domain.
- **`src/utils/track.js`** — No changes needed unless renaming the custom event.
- **`tailwind.config.js`** — The theme is designed to be swapped by changing color values and font families. The component classes in `index.css` reference these tokens by name.
- **`src/components/ui/`** — `SectionHeading.jsx` and the `btn-*`, `card-base`, `input-base` classes are fully generic.
- **`vercel.json`** — No changes needed (universal SPA rewrite rule).

### 4.3 What to Consider Keeping vs Deleting

| Module | Keep if... | Delete if... |
|---|---|---|
| Admin panel (`components/admin/` + `inventory/auth.js`) | Staff needs to edit data without git | No admin use case, or using a CMS backend |
| CSV import (`csvUtils.js` + `CSVUploader.jsx`) | Staff needs to bulk-import data | Only manual data entry |
| Reservation system (`ReservationModal.jsx`, `reservationService.js`) | Site needs "book this item" flow | Only informational listing |
| Email notifications (`config/emailjs.js`) | Want email alerts on form submissions | Using a different notifiation channel (Slack, webhook, etc.) |
| Financing CTA (`FinancingCTA.jsx`) | Selling high-value items with financing options | Simple checkout or flat-rate pricing |
| Legal pages (`MentionsLegales.jsx`, `PolitiqueConfidentialite.jsx`) | Operating in France / EU (RGPD required) | Outside EU jurisdiction (but still recommended) |

### 4.4 Testing After Cloning

1. `npm install` — installs all dependencies.
2. `npm run dev` — starts dev server, verify all routes render.
3. `npm run build` — verify production build succeeds (check chunk output).
4. `npm run lint` — verify no lint errors.
5. Test admin panel: navigate to `/admin`, login with env-var credentials.
6. Test form submission: submit InquiryForm and ReservationModal (with or without EmailJS configured — forms fall back to `mailto:`).
7. Test tracking: open browser console, trigger an event (click phone, submit form), verify `[ar_track]` log line.
8. Test mobile: verify `MobileCTA` sticky bar appears on narrow viewport, test dismiss cooldown.
9. Test Inventory feature: verify data loads from `inventory.json`, verify admin panel edits persist in localStorage across page reloads.

### 4.5 Data Migration

This template uses `inventory.json` as the deployed data source. If you are cloning for a different domain (e.g., real estate instead of cars):

1. Replace the schema in `inventory.json` with your new data structure.
2. Update the constants at the top of `inventoryService.js`:
   - `VEHICLE_STATUSES` → e.g., `LISTING_STATUSES`
   - `VEHICLE_TYPES` → e.g., `PROPERTY_TYPES`
   - `FUEL_OPTIONS` → e.g., `PROPERTY_FEATURES`
   - `TRANS_OPTIONS` → remove entirely or replace
3. Update `filterVehicles()` to match the new schema fields.
4. Update `createEmptyVehicle()` to match the new object shape.
5. Update formatters (`formatPrice`, `formatMileage` → `formatSquareMeters`, etc.) — or keep price formatting if the new domain also deals in EUR amounts.

If you are keeping the inventory system but only changing the data (e.g., different car dealership), you only need to replace `inventory.json` and update `src/constants.js`.
