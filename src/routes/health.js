const express = require("express");
const { asyncHandler } = require("../middleware/errorHandler");
const logger = require("../utils/logger");
const config = require("../config/environment");

const router = express.Router();

// Basic health check
router.get(
  "/health",
  asyncHandler(async (req, res) => {
    const healthCheck = {
      status: "ok",
      timestamp: new Date().toISOString(),
      service: "portfolio-chatbot",
      version: "1.0.0",
      environment: config.env,
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      openai: {
        configured: !!config.openai.apiKey,
        model: config.openai.model,
      },
    };

    logger.info("Health check requested", { ip: req.ip });
    res.json(healthCheck);
  }),
);

// Detailed health check
router.get(
  "/health/detailed",
  asyncHandler(async (req, res) => {
    const detailedHealth = {
      status: "ok",
      timestamp: new Date().toISOString(),
      service: "portfolio-chatbot",
      version: "1.0.0",
      environment: config.env,
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      cpu: process.cpuUsage(),
      platform: process.platform,
      nodeVersion: process.version,
      openai: {
        configured: !!config.openai.apiKey,
        model: config.openai.model,
        maxTokens: config.openai.maxTokens,
        temperature: config.openai.temperature,
      },
      cors: {
        allowedOrigins: config.cors.allowedOrigins,
      },
    };

    logger.info("Detailed health check requested", { ip: req.ip });
    res.json(detailedHealth);
  }),
);

module.exports = router;
