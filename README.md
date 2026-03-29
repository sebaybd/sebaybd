# SebayBD

SebayBD is a Bangladesh-focused service marketplace built with Next.js, TypeScript, Prisma, MongoDB, and NextAuth. It supports customer, provider, and admin roles with role-based dashboards, service discovery, booking flows, messaging, and moderation features.

## Highlights

- Role-based authentication with email/password and optional Google sign-in
- Customer, provider, and admin dashboards
- Provider profile management and approval flow
- Service browsing and service detail pages
- Booking API and booking UI
- Reviews and message APIs
- Bangladesh location-aware service data
- Sample-data fallback for local development when a real database is not configured

## Tech Stack

- Next.js App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Prisma
- MongoDB
- NextAuth v5 beta
- Zustand
- Zod

## User Roles

- Customer
- Provider
- Admin

## Key Routes

- `/` landing page
- `/search` service discovery
- `/services/[slug]` service details
- `/signin` sign in
- `/signup` sign up
- `/dashboard` role-aware dashboard entry
- `/dashboard/user` customer dashboard
- `/dashboard/provider` provider dashboard
- `/dashboard/admin` admin dashboard
- `/bookings` bookings page
- `/messages` messages page

## API Routes

- `GET, POST /api/bookings`
- `GET, POST /api/messages`
- `POST /api/reviews`
- `GET /api/categories`
- `GET, POST /api/services`
- `GET /api/problem-search`
- `GET /api/essential-problems`
- `POST /api/auth/register`
- `GET /api/auth/provider-status`
- `PATCH /api/admin/providers/[providerProfileId]`

## Project Structure

- `app/` pages, route handlers, and server actions
- `components/` UI, dashboard, layout, auth, and service components
- `lib/` data helpers, Prisma client, sample data, and utilities
- `prisma/` schema and seed script
- `stores/` Zustand store
- `types/` app and auth types
- `data/` static data assets

## Environment Variables

Create a `.env` file in the project root with these values:

```env
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

Notes:

- `DATABASE_URL` should point to your MongoDB database.
- If `DATABASE_URL` is missing or still looks like a placeholder, the app falls back to sample data in some flows.
- Google sign-in is only enabled when both Google env vars are present.

## Local Development

Install dependencies:

```bash
npm install
```

Generate Prisma client:

```bash
npm run db:generate
```

Push the Prisma schema to MongoDB:

```bash
npm run db:push
```

Optionally seed local data:

```bash
npm run db:seed
```

Start the dev server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
npm run start
```

## Authentication Notes

- Sessions are JWT-based.
- Provider sign-in through credentials is blocked until the provider profile is approved.
- `/dashboard` redirects users to the correct dashboard based on their role.

## Deployment

This project is suitable for Vercel deployment.

Before deploying, make sure you configure:

- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`

Recommended deployment checks:

- `npm run build` passes locally
- MongoDB is reachable from the deployment environment
- OAuth callback URLs are configured for your production domain

## Current Status

The repository already includes:

- Dashboard UI for all three roles
- Profile pages for customers and providers
- Header session state and logout menu
- Booking form component and bookings API
- Admin provider moderation surface

Some flows still use sample/mock data alongside Prisma-backed APIs, so the app is in a mixed MVP state rather than a fully production-hardened release.

## Next Improvements

1. Add a real `.env.example` file for onboarding.
2. Replace remaining mock-store reads with database queries.
3. Complete provider and customer profile persistence.
4. Add payment handling and booking lifecycle actions.
5. Tighten validation and test coverage across route handlers.
