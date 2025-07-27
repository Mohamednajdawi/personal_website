const logger = require("../utils/logger");

// Error handler middleware
const errorHandler = (err, req, res, next) => {
  // Log the error
  logger.error("Unhandled error", {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get("User-Agent"),
  });

  // Don't leak error details in production
  const isDevelopment = process.env.NODE_ENV === "development";

  // Handle specific error types
  if (err.name === "ValidationError") {
    return res.status(400).json({
      error: "Validation Error",
      details: isDevelopment ? err.message : "Invalid input provided",
    });
  }

  if (err.name === "UnauthorizedError") {
    return res.status(401).json({
      error: "Unauthorized",
      details: isDevelopment ? err.message : "Authentication required",
    });
  }

  if (err.code === "ENOTFOUND") {
    return res.status(503).json({
      error: "Service Unavailable",
      details: isDevelopment
        ? err.message
        : "External service temporarily unavailable",
    });
  }

  // Default error response
  res.status(err.status || 500).json({
    error: "Internal Server Error",
    details: isDevelopment ? err.message : "Something went wrong",
  });
};

// 404 handler
const notFoundHandler = (req, res) => {
  logger.warn("404 Not Found", {
    url: req.url,
    method: req.method,
    ip: req.ip,
  });

  res.status(404).json({
    error: "Not Found",
    details: "The requested resource was not found",
  });
};

// Async error wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
  errorHandler,
  notFoundHandler,
  asyncHandler,
};
