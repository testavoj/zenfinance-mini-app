# Deploying ZenFinance to GitHub Pages + Telegram

The repo is already initialized and committed locally. Two final steps:
push to GitHub (so the CI builds & deploys), then register the deployed URL
with @BotFather inside Telegram.

---

## Step 1 — Push to GitHub (one-time)

You don't have `gh` CLI installed, so use **either** the automated path or
the manual path below.

### Path A — automated (recommended)

```powershell
# 1. Install GitHub CLI (one-time)
winget install --id GitHub.cli -e

# 2. Restart PowerShell so `gh` is on PATH, then:
gh auth login        # pick GitHub.com, HTTPS, login with browser

# 3. From the project folder:
cd "C:\Users\Tigran\Desktop\zenfinance_-ai-powered-wealth-management"

# 4. Create the public repo and push
gh repo create zenfinance-mini-app --public --source=. --remote=origin --push

# 5. Add the Gemini key as a secret (the CI workflow reads this at build time)
gh secret set GEMINI_API_KEY --body "<PASTE_YOUR_GEMINI_KEY>"

# 6. Enable Pages with GitHub Actions as the source
gh api -X POST repos/:owner/zenfinance-mini-app/pages -f "build_type=workflow" `
  -f "source[branch]=main" -f "source[path]=/" 2>$null
# (If that errors, just open the repo on github.com → Settings → Pages →
#  set "Source" to "GitHub Actions". One click.)

# 7. Trigger the deployment
gh workflow run "Deploy Telegram Mini App to GitHub Pages"
```

After ~1–2 minutes the site goes live at:
`https://<your-github-username>.github.io/zenfinance-mini-app/`

Watch progress: `gh run watch` or open the **Actions** tab on github.com.

### Path B — manual (no gh install)

1. Open https://github.com/new
   - Repo name: `zenfinance-mini-app`
   - Public, **don't** add README/.gitignore (the repo already has them)
   - Click *Create repository*

2. Copy the repo URL it shows. Then in PowerShell:

   ```powershell
   cd "C:\Users\Tigran\Desktop\zenfinance_-ai-powered-wealth-management"
   git remote add origin https://github.com/<your-username>/zenfinance-mini-app.git
   git push -u origin main
   ```

   (Git will pop up a browser window for GitHub auth on first push.)

3. On the repo page → **Settings → Secrets and variables → Actions**
   → **New repository secret**:
   - Name: `GEMINI_API_KEY`
   - Value: `<PASTE_YOUR_GEMINI_KEY>`

4. **Settings → Pages → Source**: select **GitHub Actions**.

5. **Actions tab** → re-run the failed workflow (it failed the first time
   because the secret wasn't set yet). It now builds and deploys.

Site goes live at:
`https://<your-username>.github.io/zenfinance-mini-app/`

---

## Step 2 — Register with @BotFather (must be done by you in Telegram)

I cannot do this — BotFather only talks to your personal Telegram account.

1. Open Telegram, search for **@BotFather**, start a chat.

2. Create a bot (skip if you have one):
   ```
   /newbot
   ```
   Reply with a name (e.g. *ZenFinance*), then a unique username ending in
   `bot` (e.g. *zenfinance_app_bot*). BotFather replies with a token —
   you don't need it for a static mini app.

3. Create the mini app:
   ```
   /newapp
   ```
   - Pick the bot you just made.
   - **Title**: `ZenFinance`
   - **Description**: `AI wealth management with receipt photo scan.`
   - **Photo**: upload any 640×360 image.
   - **GIF**: skip (send `/empty`).
   - **Web App URL**: paste your GitHub Pages URL from Step 1, e.g.
     `https://<your-username>.github.io/zenfinance-mini-app/`
   - **Short name**: `zen` (single word, lowercase).

4. Make it the bot's blue menu button:
   ```
   /setmenubutton
   ```
   - Pick the bot → paste the same Pages URL → set button text to
     `Open ZenFinance`.

Test it by opening `https://t.me/<your_bot_username>` and tapping the menu
button (works on Telegram mobile and Desktop).

---

## Troubleshooting

- **Blank page on github.io**: check the *Actions* tab — first run can fail
  if `GEMINI_API_KEY` secret wasn't set at build time. Re-run after adding.
- **Telegram says "Web App has unsupported version"**: the Pages URL must
  be HTTPS (it is by default — don't add a custom HTTP redirect).
- **Photo scan fails**: open the deployed site in a regular browser first
  and try the camera button. Check the JS console for the Gemini API
  response.
- **Key compromised**: regenerate at https://aistudio.google.com/app/apikey,
  then `gh secret set GEMINI_API_KEY --body "<new key>"` and re-run the
  workflow.
