# 🚂 Railway Deployment Guide

## 🚨 Important: TeamViewer Artifactory Issue

Your `package-lock.json` contains TeamViewer's internal artifactory URLs which will fail on Railway.

## ✅ Solution

### Option 1: Let Railway Generate package-lock.json (Recommended)

1. **Delete package-lock.json from Git**
   ```bash
   git rm package-lock.json
   git commit -m "Remove package-lock with artifactory URLs"
   ```

2. **Add to .gitignore**
   ```
   package-lock.json
   ```

3. **Railway will generate its own** on deployment using public npm registry

### Option 2: Generate Clean package-lock.json

**Do this from a non-TeamViewer network (home, coffee shop, mobile hotspot):**

```bash
# Clean everything
rm -rf node_modules
rm package-lock.json
npm cache clean --force

# Reinstall with public registry
npm install --registry=https://registry.npmjs.org/

# Commit new package-lock.json
git add package-lock.json
git commit -m "Regenerate package-lock.json with public npm"
```

## 📦 What's Already Done

✅ `.npmrc` file created with public registry
✅ This will work on Railway deployment

## 🚀 Deploy to Railway

### Step 1: Push to GitHub

```bash
git add .
git commit -m "Ready for Railway deployment"
git push origin main
```

### Step 2: Railway Setup

1. Go to [Railway.app](https://railway.app)
2. Sign in with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Choose your `personal_website` repository

### Step 3: Configure Environment Variables

Add these in Railway's Variables section:

```env
OPENAI_API_KEY=your_openai_api_key_here
TELEGRAM_BOT_TOKEN=8293771390:AAH5hyHxP4nfAowbxlJAp9h02T7YunufPFU
TELEGRAM_CHAT_ID=2087735245
NODE_ENV=production
PORT=3000
ALLOWED_ORIGINS=https://your-railway-domain.up.railway.app
```

### Step 4: Deploy Settings

Railway should auto-detect:
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Node Version**: 16+

If not, add this to `package.json`:
```json
{
  "engines": {
    "node": ">=16.0.0"
  }
}
```

## 🔧 Why This Happened

When you ran `npm install` on your TeamViewer work computer, npm used TeamViewer's internal artifactory:
- **Location**: `https://artifactory01.tvcorp.org`
- **Saved in**: `package-lock.json`
- **Problem**: Railway can't access TeamViewer's internal network

## ✅ Current Status

- ✅ `.npmrc` forces public registry
- ✅ Will work on Railway
- ⚠️ `package-lock.json` still has artifactory URLs (remove or regenerate)

## 🎯 Recommended Fix (From Non-TeamViewer Network)

1. Connect to home WiFi or mobile hotspot
2. Run:
   ```bash
   rm -rf node_modules package-lock.json
   npm cache clean --force
   npm install
   ```
3. Commit and push:
   ```bash
   git add package-lock.json
   git commit -m "Fix npm registry for deployment"
   git push
   ```

## 🚂 Alternative: Skip package-lock.json

Add to `.gitignore`:
```
node_modules/
package-lock.json
.env
logs/
```

Railway will generate a fresh `package-lock.json` on deployment using the public registry.

## ✨ Your Site Will Include

- ✅ Modern dark theme portfolio
- ✅ AI chatbot (OpenAI powered)
- ✅ Telegram contact integration
- ✅ All your projects (Progrezz, NORMO, AIKA)
- ✅ Responsive mobile design

---

**Need Help?** The `.npmrc` file I created will ensure Railway uses the public npm registry!

