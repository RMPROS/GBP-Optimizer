# Setup Guide — GBP Optimizer

Step-by-step instructions to go from zero to live on Vercel with GitHub CI/CD.

---

## 1. Get Your API Keys

### Anthropic API Key
1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Navigate to **API Keys** → **Create Key**
3. Copy the key (starts with `sk-ant-...`)

### Google Maps API Key
1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a new project (or use an existing one)
3. Go to **APIs & Services** → **Enable APIs and Services**
4. Enable both:
   - **Maps JavaScript API**
   - **Places API** (the original one — the JS SDK uses this)
5. Go to **APIs & Services** → **Credentials** → **Create Credentials** → **API Key**
6. Click **Edit** on your new key and under **API restrictions**, restrict it to:
   - Maps JavaScript API
   - Places API
7. Under **Website restrictions**, add your domains:
   - `localhost` (for local dev)
   - `your-app.vercel.app` (after deploy)
   - Your custom domain if you have one

---

## 2. Push to GitHub

```bash
# In your project folder
git init
git add .
git commit -m "Initial commit"

# Create a new repo on github.com, then:
git remote add origin https://github.com/YOUR_USERNAME/gbp-optimizer.git
git branch -M main
git push -u origin main
```

---

## 3. Deploy to Vercel

### Option A: Vercel Dashboard (easiest)
1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **Add New Project**
3. Import your `gbp-optimizer` repo
4. In the **Environment Variables** section, add:
   - `ANTHROPIC_API_KEY` = your Anthropic key
   - `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` = your Google Maps key
5. Click **Deploy**

Vercel auto-detects Next.js — no build configuration needed.

### Option B: Vercel CLI
```bash
npm i -g vercel
vercel login
vercel

# Add env vars
vercel env add ANTHROPIC_API_KEY
vercel env add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

# Deploy to production
vercel --prod
```

---

## 4. Connect GitHub Actions CI/CD

The workflow files in `.github/workflows/` will:
- **On every PR**: Run lint + build check, deploy a preview URL
- **On merge to main**: Auto-deploy to production

### Required GitHub Secrets
Go to your GitHub repo → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

Add these secrets:

| Secret Name | How to get it |
|---|---|
| `ANTHROPIC_API_KEY` | From Anthropic console |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | From Google Cloud Console |
| `VERCEL_TOKEN` | vercel.com → Settings → Tokens → Create |
| `VERCEL_ORG_ID` | Run `vercel env ls` locally and check `.vercel/project.json`, or find in Vercel dashboard URL |
| `VERCEL_PROJECT_ID` | Same as above — in `.vercel/project.json` after running `vercel` once |

### Getting VERCEL_ORG_ID and VERCEL_PROJECT_ID
After running `vercel` once locally, a `.vercel/project.json` file is created:
```json
{
  "orgId": "team_xxxx",       <- VERCEL_ORG_ID
  "projectId": "prj_xxxx"    <- VERCEL_PROJECT_ID
}
```

> Note: `.vercel/` is gitignored so your IDs stay private. Only add them as GitHub secrets.

---

## 5. Local Development

```bash
cp .env.local.example .env.local
# Fill in your keys in .env.local

npm install
npm run dev
# Open http://localhost:3000
```

---

## Workflow After Setup

```
You edit code locally
       ↓
git push origin feature/my-change
       ↓
Open a PR → GitHub Actions runs lint + build, Vercel posts a preview URL
       ↓
Merge to main → GitHub Actions deploys to production automatically
```
