# 🤖 Telegram Bot Setup Guide

Your website is now configured to receive contact messages directly to your Telegram! Follow these steps to complete the setup.

## 📋 Bot Information

- **Bot Username**: @personal_website_xyz_bot
- **Bot Token**: `8293771390:AAH5hyHxP4nfAowbxlJAp9h02T7YunufPFU`
- **Bot Link**: https://t.me/personal_website_xyz_bot

## ⚙️ Setup Steps

### Step 1: Add Bot Token to .env

1. Open your `.env` file (or create it from `env.example` if it doesn't exist)
2. Add these lines at the end:

```env
# Telegram Bot Configuration
TELEGRAM_BOT_TOKEN=8293771390:AAH5hyHxP4nfAowbxlJAp9h02T7YunufPFU
TELEGRAM_CHAT_ID=YOUR_CHAT_ID_HERE
```

### Step 2: Get Your Chat ID

You need to get your personal Telegram chat ID so the bot knows where to send messages.

**Method 1: Using @userinfobot** (Easiest)

1. Open Telegram
2. Search for `@userinfobot`
3. Start the bot and send `/start`
4. It will reply with your **Chat ID** (a number like `123456789`)
5. Copy this number

**Method 2: Using your bot**

1. Open Telegram
2. Search for your bot: `@personal_website_xyz_bot`
3. Start a conversation with it (click START or send `/start`)
4. Send any message (like "hello")
5. Visit this URL in your browser:
   ```
   https://api.telegram.org/bot8293771390:AAH5hyHxP4nfAowbxlJAp9h02T7YunufPFU/getUpdates
   ```
6. Look for `"chat":{"id":123456789` - that number is your chat ID
7. Copy this number

### Step 3: Update .env with Your Chat ID

Replace `YOUR_CHAT_ID_HERE` in the `.env` file with your actual chat ID:

```env
TELEGRAM_CHAT_ID=123456789
```

### Step 4: Restart the Server

Stop and restart your Node.js server:

```powershell
# Stop current server (Ctrl+C or)
Get-Process node | Stop-Process -Force

# Start again
npm start
```

## ✅ Test It

1. Visit your website: http://localhost:3000
2. Go to the Contact section
3. Fill out the contact form
4. Click "Send Message"
5. You should receive a formatted message in your Telegram!

## 📱 How It Works

When someone fills out the contact form on your website:

1. The form data is sent to your Node.js server
2. Server uses the Telegram Bot API
3. Bot sends you a formatted message with:
   - 👤 Name
   - 📧 Email
   - 💬 Message content
4. You receive it instantly in Telegram!

## 🔐 Security Notes

- ✅ Bot token is stored securely in `.env` file
- ✅ `.env` is in `.gitignore` (never committed to Git)
- ✅ Token is never exposed to frontend
- ✅ Only your chat ID receives messages

## 🎨 Contact Page Features

Your contact section now has:

1. **Quick Telegram Button** - Opens direct chat
2. **OR**
3. **Contact Form** - Sends message to your Telegram

Both work perfectly! Visitors can choose their preferred method.

## 🐛 Troubleshooting

### Bot not sending messages?

- Check `.env` file has correct bot token
- Verify chat ID is a number (not a username)
- Make sure you've started the bot on Telegram
- Restart the server after changing .env

### How to verify bot is working?

Check server logs:

```powershell
Get-Content logs/combined.log -Tail 20
```

### Still not working?

1. Make sure bot token starts with numbers
2. Chat ID should be just numbers (like `123456789`)
3. Start a conversation with your bot first
4. Bot needs to be started to send messages

## 🎉 You're All Set!

Once configured, you'll receive all contact form submissions directly in Telegram - no more checking email or databases!

---

**Need help?** The bot is fully functional, just needs your chat ID to know where to send messages.
