# GBP Description Optimizer

An AI-powered tool that analyzes your Google Business Profile description and generates 3 optimized alternatives — scored against Google's 7 best-practice criteria.

## Features

- **Google Places Autocomplete** — search for your business to auto-fill name, address, and category
- **AI Analysis** — scores your current description against 7 GBP optimization criteria
- **3 Optimized Suggestions** — each under 750 characters with distinct strategic approaches
- **Preview Mode** — shows exactly what users see before the "More" cutoff at 250 characters

---

## Local Development

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/gbp-optimizer.git
cd gbp-optimizer
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy the example file and fill in your keys:

```bash
cp .env.local.example .env.local
```

Then edit `.env.local`:

```
ANTHROPIC_API_KEY=sk-ant-...
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIza...
```

**Getting your API keys:**

- **Anthropic**: [console.anthropic.com](https://console.anthropic.com) → API Keys
- **Google Maps**: [console.cloud.google.com](https://console.cloud.google.com) → Enable **Maps JavaScript API** and **Places API (New)**

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Deploying to Vercel

### Option A: Vercel CLI (recommended)

```bash
npm i -g vercel
vercel
```

Follow the prompts — Vercel auto-detects Next.js.

### Option B: GitHub Integration

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → **Add New Project**
3. Import your GitHub repo
4. Add environment variables in the Vercel dashboard:
   - `ANTHROPIC_API_KEY`
   - `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
5. Deploy

Every push to `main` will trigger an automatic redeploy.

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `ANTHROPIC_API_KEY` | ✅ | Server-side only. Powers the description analysis. |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | ✅ | Client-side. Powers Places Autocomplete. Prefix `NEXT_PUBLIC_` exposes it to the browser. |

> **Security note:** `ANTHROPIC_API_KEY` is only used in `/app/api/optimize/route.js` (server-side). It is never sent to the browser. Restrict your Google Maps key to your domain in Google Cloud Console.

---

## Project Structure

```
gbp-optimizer/
├── app/
│   ├── api/
│   │   └── optimize/
│   │       └── route.js        # Anthropic API proxy (server-side)
│   ├── components/
│   │   ├── PlacesSearch.jsx    # Google Places Autocomplete
│   │   ├── DescriptionInput.jsx
│   │   ├── AnalysisCard.jsx
│   │   └── SuggestionTabs.jsx
│   ├── globals.css
│   ├── layout.js
│   └── page.js                 # Main page
├── .env.local.example
├── .gitignore
├── next.config.js
├── package.json
└── README.md
```

---

## How It Works

1. User searches for their business via Google Places Autocomplete
2. Business name, address, and category are pre-filled as context
3. User pastes their current GBP description (the Places API does not expose owner-written descriptions)
4. Request hits `/api/optimize` — a Next.js Route Handler that calls Anthropic server-side
5. Claude reviews the description against 7 optimization criteria and returns 3 alternatives
6. Results display with score, strengths/weaknesses, and copyable suggestions
