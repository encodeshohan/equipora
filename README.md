# Equipora (client)

**Rent smarter. Work better.** Equipora is an equipment rental marketplace. Owners list equipment, admins approve it, and customers browse, favorite, book and pay securely through Stripe.

- **Live site:** https://equipora-encodeshohan.vercel.app
- **Server repo:** https://github.com/encodeshohan/equipora-server
- **Server API:** https://equipora-server-encodeshohan.vercel.app

## Features

- **Public pages:** home (banner, categories, featured equipment, why choose us, how it works, about, reviews, contact), All Equipment, category pages, equipment details.
- **All Equipment:** search by name or location, filters (category, rental type, price range, availability), sorting (recently added, price low to high, price high to low) and pagination. Filtering and sorting run on the server in MongoDB.
- **Auth:** email and password registration with photo (imgbb upload or pasted link), login, Google login, role-based access (customer, owner, admin).
- **Customer:** book equipment (dates, quantity, contact, address), Stripe Checkout, My Rentals, Favorites, Profile.
- **Owner:** add, update and delete equipment, see paid rentals of their equipment, analytics, Profile.
- **Admin:** manage users (change role, suspend or restore), approve or reject equipment, see all rentals, analytics, Profile.
- **Design:** dark theme by default with a light alternative, a Sun/Moon toggle saved in `localStorage` (no flash on first load), Plus Jakarta Sans for headings and Inter for text, and all colors defined as CSS variables in `app/globals.css`.

## Tech stack

Next.js 16 (App Router), React 19, TypeScript (strict), Tailwind CSS v4, shadcn/ui (base-nova on `@base-ui/react`), lucide-react, Framer Motion, Recharts, better-auth with the MongoDB adapter, MongoDB.

## Roles and routes

| Role | Dashboard routes |
|---|---|
| Customer | `/dashboard/customer`, `/rentals`, `/favorites`, `/profile` |
| Owner | `/dashboard/owner`, `/equipment`, `/equipment/new`, `/equipment/[id]/edit`, `/rentals`, `/profile` |
| Admin | `/dashboard/admin`, `/users`, `/equipment`, `/equipment/[id]/edit`, `/rentals`, `/profile` |

Public routes: `/`, `/equipment`, `/equipment/[id]` (login required), `/category/[slug]`, `/signin`, `/signup`, `/checkout/success`, `/unauthorized`.

Role checks run on the server (`requireRole` in each dashboard layout) and again on the API for every request.

## Getting started

Requirements: Node.js 20 or newer, a MongoDB Atlas database, and the [server](https://github.com/encodeshohan/equipora-server) running.

```bash
git clone https://github.com/encodeshohan/equipora.git
cd equipora
npm install
cp .env.example .env.local   # then fill in the values
npm run dev
```

Open http://localhost:3000.

### Environment variables

Create `.env.local` (never commit it):

| Key | Purpose |
|---|---|
| `MONGODB_URI` | Atlas connection string. **Must be the same database as the server (`equiporadb`).** |
| `BETTER_AUTH_SECRET` | Random secret, for example `node -p "require('crypto').randomBytes(32).toString('hex')"` |
| `BETTER_AUTH_URL` | The exact URL of this app (`http://localhost:3000` locally, the live `https://...` URL in production, no trailing slash) |
| `NEXT_PUBLIC_API_BASE_URL` | URL of the Express server (`http://localhost:5000` locally) |
| `NEXT_PUBLIC_IMGBB_API_KEY` | imgbb key for image uploads (https://api.imgbb.com/). Without it, pasting an image link still works |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | Google OAuth credentials. Optional: Google login is hidden from working order without them |
| `TRUSTED_ORIGINS` | Optional comma-separated extra origins allowed for auth requests |

Google OAuth setup: create a Web application client at https://console.cloud.google.com, then add `<BETTER_AUTH_URL>` as an authorized JavaScript origin and `<BETTER_AUTH_URL>/api/auth/callback/google` as an authorized redirect URI.

### Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` / `npm start` | Production build and server |
| `npm run typecheck` | TypeScript check |
| `npm run lint` | ESLint |
| `npm run format` | Prettier |

## How auth works

better-auth runs inside this app (`/api/auth/*`) and stores users and sessions in MongoDB. The session token is sent to the Express server as `Authorization: Bearer <token>`, and the server verifies it against the same `session` collection. Registration allows only the `customer` and `owner` roles. A server-side hook forces anything else, including `admin`, to `customer`. Passwords need an uppercase letter, a lowercase letter and at least 6 characters, checked in the form and again on the server.

## Payments

Checkout is created by the Express server, which recomputes the total from the stored price, checks availability and creates a Stripe Checkout Session with the amount (no fixed price IDs). After payment, the success page asks the server to verify the session, and the booking becomes **Paid** and **Confirmed**. Test with card `4242 4242 4242 4242`, any future expiry and any CVC.

## Folder structure

```
app/                 routes: (site) public pages, (auth), dashboard/{customer,owner,admin}, api/auth
components/          ui/ (shadcn), shared/, layout/, home/, equipment/, dashboard/, auth/
lib/                 api/ (server reads), actions/ (server mutations), core/server.ts, types/, validators
```

## Known limitations

- Bookings are not moved to **Completed** automatically after their end date (the optional cron job is not built), so "Completed rentals" on the dashboards stays at 0.
- Payment confirmation happens on the success page. If a customer pays but closes the tab first, **My Rentals → Check payment** confirms it. Stripe webhooks are not set up.
- Customer reviews on the home page are static sample content.
- Email notifications are not implemented.

## Deployment (Vercel)

Import the repo, set the environment variables above (the `NEXT_PUBLIC_*` values are read at build time, so set them before the first build), and set `BETTER_AUTH_URL` to the final production URL. Then add the production origin and callback URL in Google Console.