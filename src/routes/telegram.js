const express = require("express");
const TelegramBot = require("node-telegram-bot-api");
const { asyncHandler } = require("../middleware/errorHandler");
const logger = require("../utils/logger");
const config = require("../config/environment");
const Joi = require("joi");

const router = express.Router();

// Validation schema for contact messages
const contactSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  message: Joi.string().min(10).max(1000).required(),
});

// Initialize Telegram bot only if token is provided
let bot = null;
if (config.telegram?.botToken) {
  bot = new TelegramBot(config.telegram.botToken);
  logger.info("Telegram bot initialized");
}

// Send contact message via Telegram
router.post(
  "/contact",
  asyncHandler(async (req, res) => {
    // Validate request body
    const { error, value } = contactSchema.validate(req.body);
    
    if (error) {
      logger.warn("Contact validation failed", { error: error.message });
      return res.status(400).json({
        error: error.details[0].message,
      });
    }

    const { name, email, message } = value;

    logger.info("Contact message received", {
      name,
      email,
      messageLength: message.length,
      ip: req.ip,
    });

    // Check if Telegram bot is configured
    if (!bot || !config.telegram?.chatId) {
      logger.warn("Telegram bot not configured", {
        hasBot: !!bot,
        hasChatId: !!config.telegram?.chatId,
      });
      
      return res.json({
        success: false,
        message: "Contact form is not fully configured. Please reach out via email or Telegram directly.",
      });
    }

    try {
      // Format message for Telegram
      const telegramMessage = `
🔔 *New Contact Message from Portfolio*

👤 *Name:* ${name}
📧 *Email:* ${email}

💬 *Message:*
${message}

---
_Sent from: mohammad-alnajdawi.com_
`;

      // Send message to your Telegram
      await bot.sendMessage(config.telegram.chatId, telegramMessage, {
        parse_mode: "Markdown",
      });

      logger.info("Contact message sent to Telegram successfully", {
        name,
        email,
      });

      res.json({
        success: true,
        message: "Message sent successfully! I'll get back to you soon.",
      });
    } catch (error) {
      logger.error("Failed to send Telegram message", {
        error: error.message,
        code: error.code,
      });

      res.status(500).json({
        success: false,
        error: "Failed to send message. Please try again or contact via email.",
      });
    }
  })
);

module.exports = router;

