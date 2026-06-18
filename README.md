# SerpApi FASB Standards Tracker

A private GAAP compliance tracker for SerpApi LLC — private SaaS company, first accrual year FY2026.

## Features

- **Standards Tracker** — 12 pre-loaded ASUs organized by tier (Foundation / Operational / Monitor), each with SerpApi-specific impact analysis and action items. Mark reviewed with persistent state.
- **Ask AI** — Multi-turn chat powered by Claude, pre-loaded with SerpApi's company profile. Ask any GAAP question and get answers in the context of your specific situation.
- **Live ASU Feed** — Pulls the FASB RSS feed and lets you analyze any new ASU for SerpApi relevance with one click.

---

## Deploy to Vercel (10 minutes)

### Step 1 — Get an Anthropic API key

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Create an account (or log in)
3. Go to **API Keys** → **Create Key**
4. Copy the key — you'll need it in Step 3

### Step 2 — Push to GitHub

```bash
# From this folder:
git init
git add .
git commit -m "Initial commit"

# Create a new repo at github.com, then:
git remote add origin https://github.com/YOUR_USERNAME/fasb-tracker.git
git push -u origin main
```

### Step 3 — Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import your GitHub repo
3. Under **Environment Variables**, add:
   - Key: `ANTHROPIC_API_KEY`
   - Value: your key from Step 1
4. Click **Deploy**

That's it. Vercel gives you a URL like `fasb-tracker.vercel.app`.

---

## Run locally

```bash
# Install dependencies
npm install

# Create your local env file
cp .env.example .env.local
# Edit .env.local and add your ANTHROPIC_API_KEY

# Start dev server
npm run dev
# Open http://localhost:3000
```

---

## Ongoing Maintenance

### Adding new standards
Edit `lib/standards.ts` — add a new object to the `STANDARDS` array following the existing shape. Commit and push; Vercel redeploys automatically.

### Quarterly ASU review workflow
1. Open the **Live ASU Feed** tab
2. Click **Analyze All for SerpApi**
3. Review any flagged as relevant
4. If material, add to `lib/standards.ts` as a new Tier 1 or 2 standard

### Updating company profile
Edit the `COMPANY_PROFILE` object in `lib/standards.ts` and the `SYSTEM_PROMPT` string to reflect any changes (e.g., if SerpApi adds debt, leases new space, adopts crypto, raises a round).

---

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Anthropic Claude** (`claude-sonnet-4-6`) via API
- **Vercel** for hosting (free tier is sufficient)

No database — reviewed state is stored in browser localStorage. If you want shared state across multiple users/devices, swap localStorage for a simple KV store (Vercel KV, Upstash, or a Supabase table).
