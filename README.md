## ALX Polly

ALX Polly is a polling application built with Next.js App Router and Supabase. Users can register/login, create polls with multiple options, vote, and view results via an accessible chart component.

### Tech Stack
- Next.js (App Router, Server Components, Server Actions)
- Supabase (Postgres, Auth, RPC)
- shadcn/ui + Tailwind CSS
- Vitest + React Testing Library

### Quick Start
1) Install dependencies:
```bash
npm install
```
2) Configure environment variables in `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
# Optional server-only key if using server-side Supabase operations
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```
3) Run migrations (if using local Supabase):
```bash
# Ensure your Supabase project has the schema from supabase/migrations
# Apply 0001_create_polls.sql to create tables and RPCs
```
4) Start the dev server:
```bash
npm run dev
```
Open `http://localhost:3000`.

### NPM Scripts
- `dev`: Run Next.js in development mode
- `build`: Build the app
- `start`: Start the production server
- `test`: Run unit tests with Vitest
- `test:watch`: Watch tests

### Environment and Secrets
Environment variables are read from `.env.local`. Never commit secrets. Restart the dev server after changes.

### Project Structure
- `app/` — Route handlers and pages using App Router
  - `app/polls/` — Poll listing, creation, view, and edit pages
  - `app/auth/` — Login and registration pages and client context
- `components/` — Reusable UI and `PollResultChart`
- `lib/` — Domain logic, Supabase clients, validation, and types
- `tests/` — Unit and component tests
- `supabase/` — SQL migrations

### Key Modules
- `lib/pollService.ts` — Supabase operations for create/update/delete polls (via SQL tables and RPC)
- `app/polls/actions.ts` — Server Actions wrapping validation, auth, mutations, and cache revalidation
- `components/PollResultChart.tsx` — Client component to display results as bar/pie

### Database
Tables: `polls`, `poll_options`, and views such as `poll_vote_counts`.
RPC: `create_poll_with_options(question text, options text[])` used by `lib/pollService.ts`.

### Testing
```bash
npm run test
```
Vitest configuration lives in `vitest.config.ts`. Tests are in `tests/`.

### Deployment
You can deploy to any Next.js-compatible platform. Ensure env vars are configured. For Vercel, set project environment variables to match `.env.local` (without committing secrets).

### Accessibility & UX
- Keyboard navigable components
- Color-contrast friendly chart palette
- Server-rendered pages for fast initial loads

### Contributing
1. Create a feature branch
2. Add tests for changes
3. Run `npm run lint` and `npm test`
4. Open a PR

### Maintenance Notes
- Avoid committing the `coverage/` directory from local test runs
- Example/demo files should live under clearly named paths or be removed if unused
