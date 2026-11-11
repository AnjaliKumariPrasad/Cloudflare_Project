# Todo App: 3-tier on Cloudflare (Workers + Static Assets + D1)

A full-stack Todo app with Create, Read, Update and Delete, deployed as a single Cloudflare Worker with an automated GitHub Actions pipeline.

| Tier | Tech | Where |
|------|------|-------|
| Presentation | React + Vite, served by Workers Static Assets | `frontend/` |
| Application | Hono API on a Cloudflare Worker (`/api/*`) | `api/` |
| Data | Cloudflare D1 (SQLite) | `api/src/db/schema.sql` |

Based on [ksjitendra18/d1-workers-crud](https://github.com/ksjitendra18/d1-workers-crud) (React frontend + Hono + D1 CRUD API). Changes made here: one-Worker deployment with Static Assets and `/api` routing, a non-destructive schema (no `DROP TABLE`), proper HTTP status codes on create, and the GitHub Actions CI/CD pipeline.

## API
| Method | Path | Action |
|--------|------|--------|
| GET | `/api/todos` | List todos |
| POST | `/api/todos` | Create (`{ "todo": "..." }`) |
| PATCH | `/api/todos/:id` | Update (`{ "todoStatus": true }`) |
| DELETE | `/api/todos/:id` | Delete |
| GET | `/api/health` | Health check |

## Setup
```bash
npm install
npx wrangler login
npx wrangler d1 create todos-db
```
Paste the printed `database_id` into `wrangler.toml`, then:

```bash
npm run db:remote   # create the table in production D1
npm run deploy      # build frontend + deploy Worker and static assets
```

## Local development
```bash
npm run db:local
npm run build       # builds frontend/dist (needed once so wrangler can serve assets)
npm run dev         # API + built frontend at http://localhost:8787
```
For hot reload, also run `npm run dev:frontend` in a second terminal and use http://localhost:5173 (it proxies `/api` to the Worker).

## CI/CD (GitHub Actions)
`.github/workflows/deploy.yml`:
- Every push and pull request: install, typecheck and build the frontend, and verify the Worker bundles (`wrangler deploy --dry-run`).
- Push to `main`: apply the D1 schema, then deploy the Worker and static assets.

One-time setup:
1. Cloudflare dashboard, My Profile, API Tokens: create a token from the "Edit Cloudflare Workers" template and add D1 Edit permission.
2. GitHub repo, Settings, Secrets and variables, Actions: add `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`.
3. Push to `main` and check the Actions tab for a green run.

Run `npm install` locally once and commit the generated `package-lock.json`.
