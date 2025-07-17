# 🚀 Deployment Guide for Mohammad's Portfolio with AI Chatbot

Your portfolio has a frontend (HTML/CSS/JS) and backend (Node.js), so GitHub Pages alone won't work. Here are the best deployment options:

## ⭐ Option 1: Railway (Recommended - Free & Easy)

Railway is perfect for full-stack apps and has a generous free tier.

### Step-by-step:

1. **Create Railway account**: Go to [railway.app](https://railway.app) and sign up
2. **Push to GitHub first** (we'll set this up)
3. **Deploy on Railway**:
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - Railway auto-detects Node.js and installs dependencies
4. **Add environment variables**:
   - In Railway dashboard, go to your project
   - Click "Variables" tab
   - Add: `OPENAI_API_KEY` = your OpenAI API key
5. **Your site will be live** at `https://your-app-name.railway.app`

### Railway Benefits:

- ✅ Free tier (500 hours/month)
- ✅ Automatic HTTPS
- ✅ One-click deployment
- ✅ Environment variable support
- ✅ Auto-deploys on GitHub pushes

---

## 🟦 Option 2: Heroku (Popular but requires credit card)

### Quick Heroku deployment:

1. **Install Heroku CLI**: Download from [heroku.com](https://devcenter.heroku.com/articles/heroku-cli)
2. **Login and create app**:
   ```bash
   heroku login
   heroku create your-portfolio-name
   ```
3. **Set environment variable**:
   ```bash
   heroku config:set OPENAI_API_KEY=your_openai_api_key_here
   ```
4. **Deploy**:
   ```bash
   git add .
   git commit -m "Deploy to Heroku"
   git push heroku main
   ```

---

## 🟢 Option 3: GitHub + Vercel (Free)

Deploy frontend to GitHub Pages and backend to Vercel:

### Part A: Backend to Vercel

1. **Create `vercel.json`** (I'll create this file)
2. **Deploy to Vercel**: Go to [vercel.com](https://vercel.com), import your GitHub repo
3. **Add environment variables** in Vercel dashboard

### Part B: Frontend to GitHub Pages

1. **Create `docs` folder** with your HTML file
2. **Enable GitHub Pages** in repository settings

---

## 🎯 Let's Start with Railway (Easiest)

### Setup Steps:

1. **First, let's prepare your code for GitHub**:

   ```bash
   git add .
   git commit -m "Add AI chatbot functionality"
   git push
   ```

2. **Go to [railway.app](https://railway.app)**
3. **Sign up with GitHub**
4. **Click "New Project"**
5. **Select "Deploy from GitHub repo"**
6. **Choose your personal_website repository**
7. **Add environment variable**:
   - Variable name: `OPENAI_API_KEY`
   - Value: Your OpenAI API key

That's it! Railway will:

- Automatically run `npm install`
- Start your server with `npm start`
- Give you a live URL

## 🔧 Alternative: Local Development + ngrok (Testing)

For quick testing, you can expose your local server:

```bash
# Install ngrok
npm install -g ngrok

# Start your server (in one terminal)
npm start

# Expose it (in another terminal)
ngrok http 3000
```

This gives you a public URL like `https://abc123.ngrok.io` for testing.

## 💡 Quick Decision Guide:

- **Want it running in 5 minutes?** → Use Railway
- **Need custom domain later?** → Use Railway or Heroku
- **Want to learn deployment?** → Try Vercel + GitHub Pages
- **Just testing?** → Use ngrok

## 🆘 Need Help?

1. **GitHub first**: Make sure your code is pushed to GitHub
2. **Railway second**: Deploy from GitHub to Railway
3. **Add your OpenAI key**: In Railway's environment variables
4. **Test the live URL**: Your chatbot should work!

Which option would you like to try first?
