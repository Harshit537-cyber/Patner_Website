# AstroNarhari Partner

A React + Vite web app for astrologers to apply as AstroNarhari partners and
manage their practice — consultations, calendar, customers, earnings and
withdrawals — from a single dashboard.

## Flow

```
Public website → Become a Partner → Register → OTP verification
  → Onboarding (Personal, Professional, KYC, Documents, Bank)
  → Application submitted → Admin verification
      → Approved   → Partner Dashboard
      → Rejected   → Re-submit KYC
```

Once approved, partners get access to:
Dashboard · Consultations · Calendar · Customers · Chat · Earnings ·
Withdrawals · Reviews · Profile · Notifications · Settings

## Tech stack

- React 19 + Vite
- React Router v6 for routing (`src/routes`)
- Recharts for dashboard charts
- lucide-react for icons
- Plain CSS with a token-based theme (`src/styles/theme.css`)

## Getting started

```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

To reach the dashboard directly in local development:
1. Go to `/register` (or `/login`) and submit the form
2. On the OTP screen, enter any 6 digits
3. You'll land on the onboarding wizard — this sets a mock authenticated
   session so subsequent visits to `/dashboard` won't redirect to login

## Project structure

```
src/
├── components/     Reusable UI grouped by domain (common, website, dashboard, ...)
├── pages/          Route-level pages (Website, Auth, Onboarding, Dashboard)
├── context/        AuthContext (session) and PartnerContext (onboarding/profile data)
├── hooks/          useAuth, usePartner, useDashboard, useNotifications
├── services/       Mocked API calls — swap for real endpoints via VITE_API_BASE_URL
├── routes/         AppRoutes, ProtectedRoute, PublicRoute
├── utils/          constants, validators, formatters, storage
└── styles/         theme.css (design tokens), globals.css, responsive.css
```

## Design tokens

Colors, radii and shadows are defined once in `src/styles/theme.css` as CSS
custom properties (`--color-primary`, `--color-accent-gold`, etc.) and used
throughout components — update them there to re-theme the whole app.

## Notes

- `src/services/*.js` currently return mocked, delayed data so the UI is
  fully interactive without a backend. Replace the internals with `api.get` /
  `api.post` calls (see `src/services/api.js`) once your backend is ready.
- Auth state persists to `localStorage` under the `astronarhari_partner_`
  prefix (see `src/utils/storage.js`) purely for demo continuity — swap for
  real token-based auth for production.
