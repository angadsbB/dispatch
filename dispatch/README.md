# Dispatch

Dispatch is a sales gifting dashboard. It turns a funding signal into a gift request, an approval, a shipment, and a pipeline outcome — without anyone losing the address or the budget.

Seeded SQLite mock data, no auth, no API keys.

## Run it locally

```bash
npm install
npm run dev
```

Open [http://127.0.0.1:43123](http://127.0.0.1:43123). The database is created and seeded on first boot (`data/dispatch.db`).

To reset the demo, delete `data/dispatch.db` (and any `-wal`/`-shm` files) and restart.

## Deploy on GitHub + Vercel

Do this in order. You need a GitHub account and a Vercel account (the free Hobby plan is enough). No env vars.

### 1. Put the code on GitHub

This project is not on GitHub until you create a repo.

**In Cursor:** click **Create repo** and choose GitHub if that pill is available.

**On github.com:**

1. Go to [https://github.com/new](https://github.com/new).
2. Owner: your user or org.
3. Repository name: `dispatch` (any name is fine).
4. Public or Private — either works with Vercel.
5. Leave **Add a README**, **.gitignore**, and **license** unchecked (the project already has these).
6. Click **Create repository**.

Then, from this project folder, push the current branch to GitHub as `main`:

```bash
git remote add github https://github.com/YOUR_GITHUB_USER/dispatch.git
git push -u github HEAD:main
```

Replace `YOUR_GITHUB_USER/dispatch` with the repo you just created. If GitHub asks you to sign in, use a personal access token or GitHub CLI (`gh auth login`).

If `github` is already `origin` after using Create repo:

```bash
git push -u origin HEAD:main
```

### 2. Import the repo in Vercel

1. Go to [https://vercel.com/new](https://vercel.com/new).
2. Sign in with **Continue with GitHub** if you are not already.
3. If Vercel asks to install the GitHub app, install it for the account that owns `dispatch` and grant access to that repository.
4. Under **Import Git Repository**, select `dispatch`.
5. Leave the defaults:
   - Framework Preset: **Next.js**
   - Root Directory: `./`
   - Build Command: `next build` (from `package.json`)
   - Output Directory: leave default
   - Install Command: `npm install`
6. **Do not add environment variables.**
7. Click **Deploy**.

Vercel will build on every push to `main`. Preview deployments are created for other branches and pull requests.

### 3. Open the site

When the first deploy is green, Vercel shows a `*.vercel.app` URL. That is the live app. You can attach a custom domain later under Project → Settings → Domains.

### What is different in production

Vercel serverless functions cannot write the repo filesystem. On Vercel, SQLite lives in `/tmp` and is re-seeded on a cold start. The demo still boots fully clickable. Edits (approvals, sends, outcomes) can reset when a new instance starts. Local `npm run dev` still persists to `data/dispatch.db`.

If you later want durable hosted data, swap SQLite for [Turso](https://turso.tech) or Vercel Postgres — not required to get the demo live.

## What you can do in the app

1. **Signal feed** — filter funding events and draft a gift (picker, recipient, HQ address, generated note).
2. **Approvals** — approve or reject pending sends. October is seeded close to the $2,500 cap so the steak and merch requests warn before they go over.
3. **Sends** — mark approved gifts shipped (fake tracking), mark shipped gifts delivered, log outcomes.
4. **Impact** — spend, reply rate, meetings, pipeline, and which gift type actually converts.
