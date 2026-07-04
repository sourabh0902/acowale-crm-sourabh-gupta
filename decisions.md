# Technical Decisions

## 1. Why did you choose this technology stack?

Next.js and Tailwind are what I use daily at work, so I'm fastest with them. TypeScript on both sides because catching bugs at compile time is worth the small overhead.

For the backend I went with standalone Express instead of Next.js API routes. The assignment asks for backend APIs, and I wanted to show I can structure a backend myself — models, middleware, validation, auth — not just use a framework's built-in layer.

Zod handles validation on both frontend and backend. Same library, same error shapes, less context-switching.

Auth is custom JWT with bcryptjs and jsonwebtoken. For a single-admin app, building it from scratch is simpler than configuring Auth0, and it shows I understand the actual flow — hashing, signing, verifying — not just how to plug in a provider.

## 2. Why did you choose this database?

As this project required MERN expertise, I preferred MongoDB because its output is simpler to handle in JavaScript and it completely fits in.

MongoDB with Mongoose. Feedback entries are documents with no joins, no relations. A document database fits naturally here.

Atlas M0 is free, and works with Render via a single connection string. Zero infrastructure overhead.

I'm aware that if this grew to include relational data (users, teams, projects linked to feedback), PostgreSQL would be the better choice. For a flat feedback collection with one admin user, Mongo is the right fit.

## 3. Why did you structure your application this way?

Monorepo with `/client` and `/server`. One repo to clone, easy to review, but frontend and backend deploy independently to Vercel and Render. One PR tells the whole story. In separate repos, that's two commits in two places with no visible link between them.

On the backend, I started with a full routes and controllers layering and simplified it during development. Controllers talk to Mongoose directly and handle their own errors with try/catch. I know the service pattern and would add it when there's actually shared logic to extract.

On the frontend, the dashboard layout is a server component. Interactive pieces — filters, charts, the data-fetching functions — are client components. One API call drives the entire dashboard: stat card, chart, and table all render from the same response. No separate data paths, no client-side filtering.

Auth uses localStorage with a client-side guard that checks for a token before rendering the dashboard. I chose this over httpOnly cookies because the cross-origin cookie setup between Vercel and Render adds real configuration complexity for a time-bounded submission. Documented as a known trade-off.

## 4. What trade-offs did you make due to time constraints?

Currently the dashboard is protected by a client-side `isLoggedIn()` check in `DashboardClient`. It works, but runs after the browser already received the page HTML — causing a brief flash before redirect for unauthenticated users.

The proper fix is a Next.js `middleware.ts` that intercepts requests to `/dashboard/*` on the server before any HTML is sent. Zero flash, cleanest UX.

Why I didn't build it: middleware can't read `localStorage` (browser-only API). It can only read cookies. Switching to httpOnly cookies would require changing the backend login response, updating CORS config, and wiring `credentials: 'include'` on every fetch — meaningful scope for a time-boxed submission.

Given a week I'd make that switch. httpOnly cookies are also more XSS-resistant than localStorage, so it's a security improvement, not just a UX one.

## 5. What would you improve if you had one more week?

I would have especially added a dedicated page to show all of the feedback on a different page. For example its route can be `/dashboard/feedback` because currently on the overview page of the dashboard it's very cluttered to show all of the feedback.

Currently our category selection drop-down is single-select and if I would have time, I would create it multi-select — but in the very first place I didn't create it multi-select because multi-select adds complexity (checkbox popover, tag pills, clearing individual selections) that isn't worth it for MVP.

## 6. What was the most difficult technical challenge you faced?

After wiring the real login API, wrong credentials would flash an error banner and immediately reload the page — the banner never stayed visible.

The cause was subtle: the 401 auto-redirect in `api.ts` was written for expired sessions, but it fired on *every* 401 — including wrong passwords. So the login form would correctly set the error state, then `api.ts` would immediately do `window.location.href = '/login'`, wiping all React state and reloading the page.

The fix was one line:

```ts
if (res.status === 401 && auth)
```

Auto-redirect now only fires for authenticated requests (expired session). The login call uses `auth: false`, so its 401 flows through as a normal error the form displays inline. Dashboard fetches with an expired token still redirect as expected.

## 7. Which AI tools did you use?

Claude for planning, architecture discussions, and thinking through decisions — stack choices, folder structure, filter behavior, auth approach, trade-offs. Basically used it as a senior engineer to bounce ideas off.

## 8. Share one instance where AI helped you.

I collaborated with Claude to design dashboard filters and search behavior. Initially, we split them: category/date filters updated everything, while search only filtered the table. This logically separated scoping from finding specific items.

However, implementation revealed a messy architecture requiring dual API calls and state variables.

Revisiting this with Claude, we consolidated everything into a single API call. This simplified the code and improved the UX, as search results now reflect across the entire dashboard.

This highlighted the true value of AI: pressure-testing design decisions and providing the clarity to pivot when implementation costs outweighed the theoretical benefits.

## 9. Share one instance where you disagreed with AI and why.

So simply as you can see, we also have a login page and it's routed `/login`. It is completely associated and tied only with the dashboard. Initially when I asked AI to create a structure — the folder structure from the UI/UX perspective — the AI created it as `/dashboard/login`. This actually sounds good on paper but it isn't a flexible way to use a login page. Here are the few reasons that I didn't choose this way forward for the routing:

- From the middleware perspective, if we directly have the `/login` route, it will be very easy in the middleware to handle the functionality and make the checks.
- Mental model for future auth surfaces. If you ever add `/forgot-password`, `/reset-password`, `/verify-email` — those aren't "part of the dashboard" either. They're auth flows. Keeping them all at root (`/login`, `/forgot-password`, etc.) groups them naturally.
- This is common in most SaaS apps.

## 10. What would break first if this application suddenly had 100,000 users?

The `GET /api/feedback` endpoint. Right now it returns every matching row to the frontend in one response. At 100k entries, that's a massive JSON payload on every dashboard load — slow response, high memory usage on both server and client, and the browser would struggle to render that many table rows.
