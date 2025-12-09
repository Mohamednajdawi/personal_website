const Joi = require("joi");
require("dotenv").config();

const envSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid("development", "production", "test")
    .default("development"),
  PORT: Joi.number().default(3000),
  OPENAI_API_KEY: Joi.string()
    .when('NODE_ENV', {
      is: 'production',
      then: Joi.required(),
      otherwise: Joi.optional()
    })
    .description("OpenAI API key is required in production"),
  OPENAI_MODEL: Joi.string().default("gpt-4.1-mini-2025-04-14"),
  MAX_TOKENS: Joi.number().default(500),
  TEMPERATURE: Joi.number().min(0).max(2).default(0.7),
  ALLOWED_ORIGINS: Joi.string()
    .default("http://localhost:3000,https://www.mohammadalnajdawi.xyz,https://mohammadalnajdawi.xyz")
    .description("Comma-separated list of allowed CORS origins"),
  TELEGRAM_BOT_TOKEN: Joi.string()
    .optional()
    .description("Telegram bot token for contact form"),
  TELEGRAM_CHAT_ID: Joi.string()
    .optional()
    .description("Your personal Telegram chat ID to receive messages"),
}).unknown(); // Allow unknown properties

const { error, value: envVars } = envSchema.validate(process.env);

if (error) {
  throw new Error(`Environment validation error: ${error.message}`);
}

module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  openai: {
    apiKey: envVars.OPENAI_API_KEY,
    model: envVars.OPENAI_MODEL,
    maxTokens: envVars.MAX_TOKENS,
    temperature: envVars.TEMPERATURE,
  },
  cors: {
    allowedOrigins: envVars.ALLOWED_ORIGINS.split(",").map((origin) =>
      origin.trim(),
    ),
  },
  telegram: {
    botToken: envVars.TELEGRAM_BOT_TOKEN,
    chatId: envVars.TELEGRAM_CHAT_ID,
  },
};
