const express = require("express");
const cors = require("cors");
const path = require("path");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

// Import our modules
const config = require("./src/config/environment");
const logger = require("./src/utils/logger");
const {
  errorHandler,
  notFoundHandler,
} = require("./src/middleware/errorHandler");
const chatRoutes = require("./src/routes/chat");
const healthRoutes = require("./src/routes/health");

const app = express();

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: [
          "'self'",
          "'unsafe-inline'",
          "https://cdn.tailwindcss.com",
          "https://cdnjs.cloudflare.com",
          "https://use.fontawesome.com",
        ],
        scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.tailwindcss.com"],
        imgSrc: ["'self'", "data:", "https:"],
        fontSrc: [
          "'self'",
          "https://fonts.gstatic.com",
          "https://cdnjs.cloudflare.com",
          "https://use.fontawesome.com",
        ],
        connectSrc: ["'self'", "https://api.openai.com"],
        frameSrc: ["'none'"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting to all requests
app.use(limiter);

// Specific rate limiting for chat API
const chatLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // limit each IP to 10 chat requests per minute
  message: "Too many chat requests, please wait a moment.",
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware
app.use(
  cors({
    origin: config.cors.allowedOrigins,
    credentials: true,
  }),
);
app.use(express.json({ limit: "1mb" }));
app.use(express.static("."));

// Request logging middleware
app.use((req, res, next) => {
  logger.info("Incoming request", {
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get("User-Agent"),
  });
  next();
});

// Routes
app.use("/api", chatRoutes);
app.use("/api", healthRoutes);

// Serve the main HTML file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Serve blog page
app.get("/blog", (req, res) => {
  res.sendFile(path.join(__dirname, "blog.html"));
});

// 404 handler
app.use(notFoundHandler);

// Error handler (must be last)
app.use(errorHandler);

// Graceful shutdown
const gracefulShutdown = (signal) => {
  logger.info(`Received ${signal}. Starting graceful shutdown...`);

  server.close(() => {
    logger.info("HTTP server closed");
    process.exit(0);
  });

  // Force close after 10 seconds
  setTimeout(() => {
    logger.error(
      "Could not close connections in time, forcefully shutting down",
    );
    process.exit(1);
  }, 10000);
};

// Start server
const server = app.listen(config.port, () => {
  logger.info(`Server running on port ${config.port}`, {
    environment: config.env,
    port: config.port,
    nodeVersion: process.version,
  });

  if (config.env === "development") {
    console.log(`Open http://localhost:${config.port} to view the website`);
  }
});

// Handle graceful shutdown
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  logger.error("Uncaught Exception", { error: err.message, stack: err.stack });
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection", { reason, promise });
  process.exit(1);
});

module.exports = app;
