# SebayBD MVP

Scalable problem-to-solution service marketplace for Bangladesh built with Next.js App Router, TypeScript, Tailwind, Prisma, and NextAuth.

## Core Stack

- Frontend: Next.js App Router + TypeScript + Tailwind CSS
- Backend: Next.js Route Handlers + Server Actions
- ORM + DB: Prisma + MongoDB
- Auth: NextAuth (Google + Email Credentials baseline, phone OTP schema ready)
- State: Zustand
- Deployment target: Vercel

## Roles

- Customer
- Service Provider
- Admin

## Implemented MVP Modules

- Authentication foundation with NextAuth config and role propagation
- Problem-based search utility to infer category and suggest services/providers
- Category and subcategory-ready data model
- Provider dashboard, user dashboard, and admin overview page
- Booking flow API and server action scaffold
- Rating/review validation (completed booking required)
- Basic chat/message storage API and UI
- Bangladesh location structure with division/district/area support
- Near-me filtering support in services API using lat/lng and radius
- SEO basics: dynamic service metadata, JSON-LD service schema, sitemap

## Project Structure

- app/: routes, API handlers, server actions, sitemap
- components/: reusable layout, cards, and search widgets
- lib/: sample data, problem matcher, geo utility, prisma client
- prisma/: schema and seed placeholder
- stores/: Zustand state
- types/: domain typings and NextAuth module augmentation

## Setup

1. Copy .env.example to .env and fill credentials.
2. Install dependencies:

```bash
npm install
```

3. Generate Prisma client and sync schema:

```bash
npm run db:generate
npm run db:push
```

4. Start development server:

```bash
npm run dev
```

## API Endpoints (MVP)

- GET /api/problem-search?q=My%20AC%20is%20not%20cooling
- GET, POST /api/bookings
- POST /api/reviews
- GET, POST /api/messages
- GET /api/categories
- GET /api/services?division=Dhaka&lat=23.8&lng=90.4&radiusKm=20

## Extend Next

1. Replace sample data with Prisma queries in all API routes.
2. Add real OTP provider integration (Twilio/Firebase/etc.).
3. Add provider approval and admin moderation workflows.
4. Add payment flow and invoice records.
5. Add i18n routing for Bangla + English.
