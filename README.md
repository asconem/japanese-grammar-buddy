# 🇯🇵 Japanese Grammar Buddy

AI-powered Japanese grammar companion — translate, explore, and understand Japanese phrases. Built as a learning tool to pair with Duolingo.

## Features

- **Translate** — Paste or type Japanese text, get instant English translations via Claude
- **Word Breakdown** — Morpheme-level analysis with furigana readings (ruby text), English meanings, and parts of speech
- **Grammar Chat** — Ask follow-up questions about grammar, particles, conjugation, usage
- **Pronunciation** — Listen to native Japanese pronunciation via Google Cloud TTS
- **Screenshot OCR** — Upload a Duolingo screenshot, pick a phrase to explore
- **Save & Sync** — Bookmark phrases with full chat history, synced via Redis across devices
- **Login + Guest** — Password-protected user accounts plus open guest mode

## Tech Stack

- **Next.js 14** (App Router) on **Vercel**
- **Anthropic Claude Sonnet** for translation, grammar chat, word breakdown, and screenshot OCR
- **Google Cloud Text-to-Speech** for Japanese pronunciation
- **Upstash Redis** for per-user saved phrase history

## Setup

### 1. Clone & Install

```bash
git clone https://github.com/YOUR_USER/japanese-grammar-buddy.git
cd japanese-grammar-buddy
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env.local` and fill in your keys:

```bash
cp .env.example .env.local
```

Required variables:

| Variable | Description |
|----------|-------------|
| `ANTHROPIC_API_KEY` | Claude API key from console.anthropic.com |
| `GOOGLE_API_KEY` | Google Cloud API key with Text-to-Speech enabled |
| `KV_REST_API_URL` | Upstash Redis REST URL |
| `KV_REST_API_TOKEN` | Upstash Redis REST token |
| `USER_[NAME]_PASSWORD` | One per user (e.g., `USER_MATT_PASSWORD=secret123`) |

### 3. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 4. Deploy to Vercel

```bash
# Connect to Vercel
npx vercel

# Set env vars in Vercel dashboard or via CLI
npx vercel env add ANTHROPIC_API_KEY
# ... etc

# Deploy
git push  # auto-deploys if connected to GitHub
```

## Adding Users

Add a new environment variable for each user:

```
USER_BROTHER_PASSWORD=his_password
USER_FRIEND_PASSWORD=her_password
```

Usernames are derived from the env var name (e.g., `USER_BROTHER_PASSWORD` → username `brother`).

## Redis Key Format

All saved data uses the prefix `jgb:history:` to avoid conflicts if sharing an Upstash instance with the Dutch version (`dgb:history:`).

## Architecture

```
app/
├── layout.js              — Fonts + metadata
├── page.js                — Full single-page client app
└── api/
    ├── translate/route.js — Japanese→English via Claude
    ├── chat/route.js      — Grammar tutor conversation
    ├── breakdown/route.js — Morpheme analysis with furigana
    ├── speak/route.js     — Google TTS proxy (ja-JP-Wavenet-A)
    ├── parse-screenshot/  — Duolingo screenshot OCR
    ├── history/route.js   — Save/load via Upstash Redis
    └── login/route.js     — Cookie-based auth
```

## Differences from Dutch Grammar Buddy

| Feature | Dutch | Japanese |
|---------|-------|----------|
| Word breakdown | Space-separated words | Morpheme segmentation (no spaces in Japanese) |
| Readings | N/A | Furigana via `<ruby>` tags above kanji |
| TTS voice | `nl-NL-Wavenet-A` | `ja-JP-Wavenet-A` |
| Accent colors | Netherlands flag (red/orange/blue) | Japan flag inspired (hinomaru red / warm gold) |
| Redis prefix | `dgb:history:` | `jgb:history:` |
| Cookie name | `dgb_user` | `jgb_user` |
