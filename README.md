# Node CRUD + Supabase + Docker

This folder contains a small Express product CRUD application and the Docker files for the activity.

## 1. Configure Supabase

Create a Supabase project. In the SQL Editor, run:

```sql
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  price numeric(10, 2) not null default 0,
  created_at timestamptz not null default now()
);

alter table public.products enable row level security;

create policy "Allow demo CRUD with anon key"
on public.products
for all
to anon
using (true)
with check (true);
```

This policy is intentionally permissive for a classroom demonstration. Do not use it for a production application. For production, use authentication and restrictive Row Level Security policies.

Copy `.env.example` to `.env`, then fill in your Supabase Project URL and anon/publishable key. Never put a `service_role` key in a browser app or commit secrets to GitHub.

## 2. Run without Docker (optional)

```bash
npm install
npm start
```

Open http://localhost:3000.

## 3. Build and run with Docker

Run these commands from this folder, where the Dockerfile is located:

```bash
docker build -t node-crud-app .
docker run --rm -p 3000:3000 --env-file .env node-crud-app
```

Open http://localhost:3000. Add, edit, and delete products.

Stop the container with Ctrl+C.

## 4. Run with Docker Compose

```bash
docker compose up --build
```

Stop with Ctrl+C, then clean up the container with:

```bash
docker compose down
```

## 5. Push to GitHub

Make sure `.env` is not tracked. The `.gitignore` file excludes it.

```bash
git status
git add .
git commit -m "Add Docker support"
git push origin main
```

## Included files

- `Dockerfile` — image build instructions
- `docker-compose.yml` — repeatable container configuration
- `.dockerignore` — files excluded from the Docker build context
- `.gitignore` — prevents secrets and dependencies from being committed
- `.env.example` — safe environment-variable template
- `package.json`, `server.js`, `public/index.html` — example CRUD application
