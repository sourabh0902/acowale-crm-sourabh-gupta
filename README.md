# Acowale CRM — Machine Test by Sourabh Gupta

A lightweight customer feedback platform where users submit feedback and admins analyse trends through a dashboard.

## Live Application

- Frontend (Vercel): https://acowale-crm-fe.vercel.app
- Backend (Render): https://acowale-crm-api-tjds.onrender.com

The backend is on Render's free tier. If the first request is slow (~30-60 seconds), the server is waking up from idle. Subsequent requests are fast.

## Admin Credentials

- Email: `admin@acowale.com`
- Password: `Acowale@2026`

Use these to access the admin dashboard at `/login`.

## Features

Anyone can submit feedback through the public form — pick a category, write your message, optionally leave an email. No login required.

Admins log in to a protected dashboard showing total feedback count, a category distribution pie chart, and a filterable/searchable feedback table with category and date range filters.

## Tech Stack

- Frontend: Next.js 16, TypeScript, Tailwind CSS v4, Recharts
- Backend: Express.js, TypeScript, MongoDB Atlas, Mongoose, JWT auth, Zod validation

## Project Structure

```
/
├── client/                 # Next.js frontend (deployed to Vercel)
│   └── src/
│       ├── app/            # Pages: /, /login, /dashboard
│       ├── components/     # Dashboard components (chart, table, filters, sidebar)
│       └── lib/            # API client, auth helpers, types, utilities
├── server/                 # Express backend (deployed to Render)
│   ├── src/
│   │   ├── config/         # Environment validation, DB connection
│   │   ├── controllers/    # Route handlers (auth, feedback)
│   │   ├── middleware/     # Auth, validation, rate limiting, error handling
│   │   ├── models/         # Mongoose schemas (Feedback, User)
│   │   ├── routes/         # API route definitions
│   │   ├── validators/     # Zod schemas for request validation
│   │   └── types/          # TypeScript type extensions
│   └── scripts/            # Database seed script
└── decisions.md            # Engineering decision log (11 questions answered)
```

## Local Development

Prerequisites: Node.js 18+, npm, a MongoDB Atlas cluster (or local MongoDB).

Backend:

```
cd server
npm install
cp .env.example .env
# Fill in MONGODB_URI, JWT_SECRET (min 32 chars), CORS_ORIGIN=http://localhost:3000
npm run seed          # Populates DB with 28 feedback entries + admin user
npm run dev           # Starts on http://localhost:3001
```

Frontend:

```
cd client
npm install
cp .env.example .env
# Set NEXT_PUBLIC_API_URL=http://localhost:3001/api
npm run dev           # Starts on http://localhost:3000
```

Both servers need to be running simultaneously.

## API Endpoints

| Method | Endpoint            | Description                                                              |
|--------|----------------------|---------------------------------------------------------------------------|
| POST   | `/api/auth/login`   | Admin login, returns JWT                                                  |
| POST   | `/api/feedback`     | Public, submit feedback (rate-limited: 5/min per IP)                     |
| GET    | `/api/feedback`     | Protected, fetch feedback with optional filters (`?category=`, `&range=`, `&search=`) |

## Environment Variables

Backend (`server/.env`):

- `PORT` — server port (default: 3001)
- `MONGODB_URI` — MongoDB Atlas connection string
- `JWT_SECRET` — signing key for JWTs (min 32 characters)
- `CORS_ORIGIN` — frontend URL (`http://localhost:3000` locally, Vercel URL in production)
- `NODE_ENV` — `development` or `production`
- `SEED_ADMIN_EMAIL` — admin email for the seed script
- `SEED_ADMIN_PASSWORD` — admin password for the seed script

Frontend (`client/.env`):

- `NEXT_PUBLIC_API_URL` — backend API base URL including `/api` suffix

## Deployment

Frontend is deployed to Vercel with root directory set to `client`. Backend is deployed to Render with root directory set to `server`, build command `npm install && npm run build`, start command `npm start`. After both are live, update `CORS_ORIGIN` on Render to the Vercel URL and `NEXT_PUBLIC_API_URL` on Vercel to the Render URL.

The Render free tier spins down after 15 minutes of inactivity — the first request after that takes 30-60 seconds.

## Database Seeding

```
cd server
npm run seed
```

Populates the database with 28 realistic feedback entries and one admin user. Destructive — wipes existing data before inserting. Run once after setting up your `.env`.

See `decisions.md` for detailed answers to all 11 evaluation questions.

Built by Sourabh Gupta for the Acowale Engineering Machine Test (Batch ID: 6783).
