# ZenFinance — Telegram Mini App

AI-powered personal finance mini app that runs inside Telegram. Users can:

- Log income/expenses with a quick numpad
- Scan a receipt photo (Gemini Vision) — **10 free scans per user**
- Chat with an AI financial coach (Gemini 2.5 Flash) — 10 free messages per user

## 1. Local development

Prerequisites: Node.js 18+.

```sh
npm install
cp .env.local.example .env.local      # then put your Gemini key inside
npm run dev
```

The Telegram WebApp SDK loads via a `<script>` tag in `index.html`, so opening
`http://localhost:3000` in a normal browser works (the app gracefully falls
back to the manual login screen when `Telegram.WebApp.initData` is absent).

Get a free Gemini API key at https://aistudio.google.com/app/apikey — the
free tier of `gemini-2.5-flash` is enough for the 10-photo / 10-message quotas
this app advertises.

## 2. Build for production

```sh
npm run build
```

Output goes to `dist/`. The build is fully static (no Node server required).
`vite.config.ts` uses `base: './'` so it works on any HTTPS path.

## 3. Deploy

Telegram requires the mini app to be served over **HTTPS**. Pick any static
host:

| Host           | Command                                                                 |
| -------------- | ----------------------------------------------------------------------- |
| GitHub Pages   | Push `dist/` to a `gh-pages` branch                                     |
| Netlify        | `npx netlify deploy --dir=dist --prod`                                  |
| Vercel         | `npx vercel --prod`                                                     |
| Cloudflare     | `npx wrangler pages deploy dist`                                        |

Note: `GEMINI_API_KEY` is baked into the bundle at build time. Anyone can
extract it from the JS. For a public deploy, route Gemini calls through a
small backend proxy that holds the key server-side and enforces the per-user
quota using the Telegram `initData` HMAC signature.

## 4. Register the mini app with @BotFather

1. In Telegram, open `@BotFather` → `/newbot` (or use an existing bot).
2. `/newapp` → choose your bot → fill in title, description, photo, GIF.
3. **Web App URL**: paste the HTTPS URL of your deployed `dist/`.
4. Optional: `/setmenubutton` to add the mini app as the bot's blue menu
   button. `/setdomain` to whitelist your hosting domain.

Open `https://t.me/<your_bot>/<short_name>` (or the bot's menu button) on a
phone or Telegram Desktop to launch.

## 5. What's inside

- `src/lib/telegram.ts` — Telegram WebApp helpers (`initTelegram`, `haptic`,
  `getTelegramUserId`).
- `src/components/QuickLog.tsx` — receipt photo OCR with 10-scan quota.
- `src/components/AIAssistant.tsx` — Gemini chat with 10-message quota.
- `src/AppContext.tsx` — quotas persisted in `localStorage`
  (`zen_prefs.photoUsageCount`, `zen_prefs.aiUsageCount`).
