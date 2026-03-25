# GBP Description Optimizer

An AI-powered tool that reviews your Google Business Profile description against Google's best practices and generates 3 optimized alternatives.

## Features

- **Google Places Autocomplete** — search for your business to give Claude extra context
- **7-point GBP analysis** — scores your current description against Google's criteria  
- **3 AI-generated alternatives** — professional, community-focused, and results-driven variants
- **250-char preview** — shows exactly what customers see before the "More" cutoff
- **Policy compliant** — AI is prompted to avoid URLs, phone numbers, and promotional language

---

## Local Development Setup

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/gbp-optimizer.git
cd gbp-optimizer
npm install
```

### 2. Get your API keys

#### Anthropic API Key
1. Go to https://console.anthropic.com
2. Navigate to **API Keys** → **Create Key**
3. Copy the key (starts with `sk-ant-...`)

#### Google Places API Key
1. Go to https://console.cloud.google.com
2. Go to **APIs & Services** → **Enable APIs** and enable:
   - **Places API (New)**
   - **Maps JavaScript API**
3. Go to **Credentials** → **Create Credentials** → **API Key**
4. Copy the key (starts with `AIza...`)
5. Restrict the key by HTTP referrer:
   - `localhost:3000/*` (dev)
   - `your-app.vercel.app/*` (prod — add after deploying)

### 3. Configure environment variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
ANTHROPIC_API_KEY=sk-ant-YOUR_KEY_HERE
NEXT_PUBLIC_GOOGLE_PLACES_API_KEY=AIzaYOUR_KEY_HERE
```

> `ANTHROPIC_API_KEY` is server-side only — never exposed to the browser.
> `NEXT_PUBLIC_GOOGLE_PLACES_API_KEY` is browser-accessible — always restrict it in Google Cloud Console.

### 4. Run locally

```bash
npm run dev
# Open http://localhost:3000
```

---

## GitHub Setup (New Repo)

### Option A: GitHub CLI (fastest)

```bash
gh auth login
gh repo create gbp-optimizer --public --source=. --remote=origin --push
```

### Option B: Manual

```bash
git init
git add .
git commit -m "feat: initial GBP optimizer"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/gbp-optimizer.git
git push -u origin main
```

---

## Vercel Deployment

### Option A: Vercel CLI

```bash
npm install -g vercel
vercel login
vercel        # first deploy + setup
vercel --prod # future deploys
```

### Option B: GitHub integration (auto-deploy on push)

1. Go to https://vercel.com/new
2. Import your `gbp-optimizer` GitHub repo
3. Add environment variables under **Settings → Environment Variables**:

| Name | Value |
|------|-------|
| `ANTHROPIC_API_KEY` | `sk-ant-...` |
| `NEXT_PUBLIC_GOOGLE_PLACES_API_KEY` | `AIza...` |

4. Deploy — every push to `main` auto-deploys from here on.

---

## Ongoing Workflow

```bash
# Standard feature workflow
git checkout -b feature/my-change
# make changes
git add . && git commit -m "feat: description of change"
git push origin feature/my-change
# → Vercel creates a preview URL automatically

# Merge to main → triggers production deploy
git checkout main && git merge feature/my-change && git push
```

---

## Project Structure

```
gbp-optimizer/
├── src/
│   ├── app/
│   │   ├── layout.js                   # Root layout
│   │   ├── page.js                     # Main optimizer UI
│   │   ├── globals.css                 # Global + Places dropdown styles
│   │   └── api/optimize/route.js       # Server-side Anthropic proxy
│   └── components/
│       └── PlacesAutocomplete.js       # Google Places search
├── .env.local.example
├── .gitignore
├── next.config.js
└── package.json
```

---

## Why descriptions must be pasted

The Google Places API does not return the owner-written GBP description — only a Google-generated editorial summary. The owner description requires the GBP Management API with OAuth + verified ownership. Places Autocomplete here is used only to fetch business name, type, and address as context for Claude.
