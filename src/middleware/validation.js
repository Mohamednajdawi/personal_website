const Joi = require("joi");
const logger = require("../utils/logger");

// Validation schemas
const messageSchema = Joi.object({
  message: Joi.string().trim().min(1).max(1000).required().messages({
    "string.empty": "Message cannot be empty",
    "string.max": "Message cannot exceed 1000 characters",
    "any.required": "Message is required",
  }),
});

// Sanitize input to prevent XSS
const sanitizeInput = (input) => {
  if (typeof input !== "string") return "";

  return input
    .replace(/[<>]/g, "") // Remove angle brackets
    .replace(/javascript:/gi, "") // Remove javascript: protocol
    .replace(/on\w+=/gi, "") // Remove event handlers
    .trim();
};

// Validation middleware
const validateMessage = (req, res, next) => {
  try {
    const { error, value } = messageSchema.validate(req.body);

    if (error) {
      logger.warn("Validation error", {
        error: error.details[0].message,
        ip: req.ip,
        userAgent: req.get("User-Agent"),
      });

      return res.status(400).json({
        error: "Invalid input",
        details: error.details[0].message,
      });
    }

    // Sanitize the message
    req.body.message = sanitizeInput(value.message);

    next();
  } catch (err) {
    logger.error("Validation middleware error", { error: err.message });
    res.status(500).json({ error: "Internal validation error" });
  }
};

module.exports = {
  validateMessage,
  sanitizeInput,
};
