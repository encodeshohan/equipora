# 🚜 EQUIPORA — Equipment Rental Marketplace

Rent smarter. Work better.

Equipora is an equipment rental marketplace. Owners list their equipment, admins approve it, and customers browse, favorite, book and pay securely through Stripe.

🌐 **Live Demo:** [Equipora](https://equipora-encodeshohan.vercel.app/)<br>
📦 **Frontend Repository:** [encodeshohan/equipora](https://github.com/encodeshohan/equipora)<br>
🖥️ **Backend Repository:** [encodeshohan/equipora-server](https://github.com/encodeshohan/equipora-server)

---

## 🌐 Project Overview

**Equipora** is a full-stack web application that connects people who own equipment with people who need it for a day, a week or a month.

Equipment is organised by category:

- Construction Equipment
- Photography Equipment
- Vehicles & Transportation
- Agriculture Equipment
- Electronics
- Event Equipment

Visitors can browse approved equipment without an account. After signing in, customers can book and pay, owners can list and manage equipment, and admins can approve listings and manage the whole platform.

This repository is the **frontend**. It talks to the [equipora-server](https://github.com/encodeshohan/equipora-server) API for all equipment, booking and payment data.

---

## 🛠️ Technologies Used

### Frontend

- ⚛️ **Next.js 16** — App Router, server components and server actions
- ⚛️ **React 19** — Component-based user interface
- 🔷 **TypeScript** — Strict type safety and maintainable code
- 🎨 **Tailwind CSS 4** — Responsive styling, with every color defined as a CSS variable
- 🧱 **shadcn/ui (Base UI)** — Accessible UI components
- 🔤 **Plus Jakarta Sans and Inter** — Typography using `next/font`

### Libraries

- 🔐 **Better Auth** — Authentication, sessions, Google login and JWT issuing
- 🍃 **MongoDB** — Stores authentication data (users and sessions)
- 🎞️ **Framer Motion** — Scroll reveal animations
- 📊 **Recharts** — Monthly bookings and revenue charts
- 🌙 **next-themes** — Dark and light theme
- 🎯 **lucide-react** — Icons
- 🖼️ **imgbb** — Image uploads (optional, pasted links also work)

### Data

- 🌐 **Equipora API** — Equipment, bookings, favorites and payments from [equipora-server](https://github.com/encodeshohan/equipora-server) (Express 5, MongoDB and Stripe)

---

## ✨ Features

### 1. 🔎 Discover Equipment

- Home page with banner, categories, featured equipment, why choose us, how it works, about, reviews and contact
- All Equipment page and a page for every category
- Server-side search by name or location
- Filter by category, rental type, price range and availability
- Sort by recently added, price low to high or price high to low
- Pagination, with clear empty states when nothing matches

### 2. 📅 Book and Pay Securely

- Equipment details page with price, condition, quantity, terms and owner
- Book Now form with dates, quantity, contact number, delivery address and notes
- Live estimated total, with the final total always calculated by the server
- Stripe Checkout payment, and the booking is confirmed only after the payment is verified
- Payment canceled and payment not found states are handled
- **Check payment** button in My Rentals for customers who closed the tab before returning

### 3. ❤️ Favorites and My Rentals

- Save equipment with one click and remove it any time
- Favorites table with availability and quick links
- My Rentals shows dates, totals, payment status and booking status
- Dashboard with total, completed and spent stats, plus monthly rentals and monthly spending charts

### 4. 🛠️ Owner Dashboard

- Add, update and delete equipment with image upload or pasted link
- New and edited listings go to admin review before they appear publicly
- My Equipment table with search, status filter and approval status
- My Equipment Rental shows paid bookings with customer contact details
- Analytics: listed equipment, paid rentals, gross earnings and monthly charts

### 5. 🛡️ Admin Dashboard

- Approve or reject equipment, edit any listing and delete equipment
- All Users table: search, filter by role, change roles, suspend or restore accounts
- All Rentals table with payment and booking status filters
- Cancel a rental, or mark a paid rental as completed, with a confirmation step
- Cancelling an unpaid rental also closes its Stripe checkout
- Platform analytics: users, equipment, paid bookings, pending approvals and gross revenue

### 6. 🔐 Authentication and Role-Based Access

- Register as a customer or an owner, with a profile photo upload or link
- Live password rules (uppercase, lowercase and at least 6 characters)
- Log in with email and password or continue with Google
- Three roles: customer, owner and admin, checked on the server in every dashboard layout and again on the API
- Equipment details are private, so logged-out visitors are sent to login and return afterwards
- Admin accounts cannot be created through registration

### 7. 👤 Profile Management

- View your name, email, role and member-since date
- Update your name, photo, phone and address

### 8. 📱 Responsive Design and User Experience

- Dark theme by default with a Sun and Moon toggle, saved in the browser with no flash on first load
- Fully responsive layout for mobile, tablet and desktop, with a collapsible dashboard sidebar
- Loading, custom 404, error and unauthorized pages
- Toast messages for every action
- Labelled form fields, screen-reader tables behind every chart and reduced-motion support

---

## 📂 Project Structure

```
equipora/
├── app/
│   ├── (auth)/
│   │   ├── signin/                # Login
│   │   └── signup/                # Register
│   ├── (site)/
│   │   ├── page.tsx               # Home page
│   │   ├── equipment/             # All equipment and details
│   │   ├── category/[slug]/       # Category pages
│   │   └── checkout/success/      # Payment confirmation
│   ├── api/
│   │   └── auth/[...all]/         # Better Auth API handler
│   ├── dashboard/
│   │   ├── customer/              # Rentals, favorites, profile
│   │   ├── owner/                 # Equipment, rentals, profile
│   │   └── admin/                 # Users, equipment, rentals, profile
│   ├── unauthorized/
│   ├── error.tsx
│   ├── loading.tsx
│   ├── not-found.tsx
│   ├── layout.tsx
│   └── globals.css
│
├── components/
│   ├── auth/                      # Sign in, sign up, Google and sign out
│   ├── dashboard/                 # Sidebar, forms, charts and action buttons
│   ├── equipment/                 # Card, filters, favorite button, booking modal
│   ├── home/                      # Banner, categories, reviews, contact
│   ├── layout/                    # Navbar and footer
│   ├── shared/                    # Field, pagination, logo, avatar and more
│   └── ui/                        # shadcn/ui components
│
├── lib/
│   ├── api/                       # Server-side reads from the API
│   ├── actions/                   # Server actions for changes
│   ├── core/server.ts             # Session helpers and requireRole
│   ├── types/                     # TypeScript types
│   ├── auth.ts                    # Better Auth server configuration
│   ├── auth-client.ts             # Better Auth client
│   ├── booking.ts                 # Rental price helpers
│   ├── validators.ts              # Shared form validation
│   └── formatters.ts              # Date and money formatting
│
└── hooks/
    └── use-mobile.ts
```

---

## ⚙️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 20 or later
- npm
- A MongoDB database, such as a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster
- The [equipora-server](https://github.com/encodeshohan/equipora-server) API running locally or deployed
- Google OAuth credentials if you want Google login
- An [imgbb](https://api.imgbb.com/) API key if you want image uploads

### 1. Clone the repository

```bash
git clone https://github.com/encodeshohan/equipora.git
cd equipora
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root:

```env
# MongoDB (use the same database as the API)
MONGODB_URI=your_mongodb_connection_string

# Better Auth
BETTER_AUTH_SECRET=your_long_random_secret
BETTER_AUTH_URL=http://localhost:3000

# API server (no trailing slash)
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000

# Image uploads (optional)
NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_api_key

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Extra allowed origins for auth requests (optional, comma separated)
TRUSTED_ORIGINS=
```

| Name | Description |
|---|---|
| `MONGODB_URI` | MongoDB connection string. Must be the same database as the API (`equiporadb`) |
| `BETTER_AUTH_SECRET` | Long random secret used by Better Auth |
| `BETTER_AUTH_URL` | Public URL of this app, no trailing slash. Must match `CLIENT_URL` on the API |
| `NEXT_PUBLIC_API_BASE_URL` | Public URL of the API server, no trailing slash |
| `NEXT_PUBLIC_IMGBB_API_KEY` | imgbb key for image uploads (optional) |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | Google OAuth credentials (optional) |
| `TRUSTED_ORIGINS` | Extra origins allowed for auth requests (optional) |

You can generate a secret with:

```bash
node -p "require('crypto').randomBytes(32).toString('hex')"
```

**Important:** never commit your `.env.local` file or expose your secrets publicly.

### 4. Configure the Google callback URL

For local development, register this in your Google OAuth app (Web application):

```
Authorized JavaScript origin:  http://localhost:3000
Authorized redirect URI:       http://localhost:3000/api/auth/callback/google
```

For production, replace `http://localhost:3000` with your deployed origin.

### 5. Start the API server

Follow the setup steps in the [equipora-server README](https://github.com/encodeshohan/equipora-server), then keep it running.

### 6. Run the development server

```bash
npm run dev
```

Open <http://localhost:3000> in your browser.

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Next.js development server |
| `npm run build` | Build the application for production |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Type-check the project |
| `npm run format` | Format the code with Prettier |

---

## 🔐 How Authentication Works

Better Auth signs users in and issues a short-lived JWT. The client sends it as `Authorization: Bearer <token>`, and the API verifies it against this app's public keys at `/api/auth/jwks`. The API then loads the user from MongoDB, so roles and suspensions are always current.

Registration allows only the `customer` and `owner` roles. A server-side hook forces anything else, including `admin`, to `customer`.

Dashboard pages are protected by `requireRole` in each role's layout, and the API checks the role again on every request.

---

## 💳 How Payments Work

1. The customer fills in the booking form.
2. The API recomputes the total from the stored price, checks availability and creates a Stripe Checkout Session.
3. After paying, Stripe sends the customer to `/checkout/success`, which asks the API to verify the session.
4. The booking becomes **Paid** and **Confirmed**.

Test with card `4242 4242 4242 4242`, any future expiry and any CVC.

---

## 🚀 Deployment

Equipora is deployed on [Vercel](https://vercel.com/).

1. Push your code to GitHub.
2. Import the `equipora` repository into Vercel.
3. Add all environment variables in the project settings. `NEXT_PUBLIC_*` values are read at build time, so add them before the first build.
4. Set `BETTER_AUTH_URL` to your deployed origin, and set `NEXT_PUBLIC_API_BASE_URL` to your deployed API URL.
5. Register the production callback URL in Google Cloud.
6. Make sure `CLIENT_URL` on the API server matches `BETTER_AUTH_URL` exactly.
7. Deploy and test login, booking, payment and the dashboards.

---

## 📝 Notes

- Dates are handled in Bangladesh time (Asia/Dhaka).
- Prices are in Bangladeshi taka (৳).
- Revenue, earnings and spending charts are calculated from verified payments.
- Cancelling a paid rental does not refund it automatically. Refund the payment in the Stripe dashboard.
- Customer reviews on the home page are static sample content.
- Bookings are marked as Completed automatically once their end date has passed.

---

## 📌 Future Improvements

- 🪝 Stripe webhooks, so payments confirm even if the customer closes the tab
- 📧 Email notifications for bookings and approvals
- ⭐ Real customer reviews and ratings
- 🗺️ Map view of equipment near you
- 🌐 Bangla language support

---

## 👨‍💻 Author

**MD. SHOHANUR RAHMAN SHOHAN**

GitHub: [@encodeshohan](https://github.com/encodeshohan)

Built with ❤️ using Next.js, React, TypeScript, and Tailwind CSS.