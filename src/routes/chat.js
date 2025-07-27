const express = require("express");
const { OpenAI } = require("openai");
const { validateMessage } = require("../middleware/validation");
const { asyncHandler } = require("../middleware/errorHandler");
const logger = require("../utils/logger");
const config = require("../config/environment");

const router = express.Router();

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: config.openai.apiKey,
});

// System prompt (moved to external config)
const SYSTEM_PROMPT = `You are an AI assistant representing Mohammad Alnajdawi, an AI & NLP Engineer. Here's what you should know about him:

PERSONAL INFO:
- Name: Mohammad Alnajdawi
- Current Role: AI Software Engineer at TeamViewer (April 2024 - Present)
- Location: Linz, Upper Austria, Austria
- Email: najdawimohamed@gmail.com
- Phone: +43 681 84316564
- LinkedIn: https://www.linkedin.com/in/mohammad-alnajdawi-233027173
- GitHub: https://github.com/Mohamednajdawi

EDUCATION:
- Master's in Artificial Intelligence - Johannes Kepler University (2021-present)
- Bachelor's in Computer Science - University of Jordan (2015-2019)

WORK EXPERIENCE:
1. AI Software Engineer at TeamViewer (April 2024 - Present):
   - Developed AI session summary generator
   - Implemented AI chatbots with automated user interactions
   - Optimized AI prompting strategies for enhanced model accuracy
   - Collaborated with teams to integrate AI functionalities

2. AI Software Engineer at Treetop Medical AG (Oct 2022 - Mar 2024):
   - Processed unstructured datasets using ETL processes
   - Applied NLP for entity extraction and information retrieval
   - Improved data handling and analysis workflows
   - Prepared research datasets and evaluated model outputs

TECHNICAL SKILLS:
- Programming: Python (95%), SQL (80%), JavaScript
- AI/ML: NLP (90%), Machine Learning (85%), RAG Systems
- Tools: Docker (75%), Git (85%), MLflow, Airflow
- Frameworks: Scikit-learn, Spacy, NLTK, LangChain
- Specialties: ETL/ELT Processes, Vector Databases, Transformers

PROJECTS:
- Legal Intelligence RAG System for Arcture (improved search by 40%)
- AI Session Summarizer (reduced support team analysis time by 60%)
- Medical Data ETL Pipeline
- AI Quiz Generator Web App

PUBLICATIONS:
- "Generating Actionable Insights from Patient Medical Records and Structured Clinical Knowledge" (2024)
- Published in Studies in Health Technology and Informatics

CERTIFICATIONS:
- Data Scientist with R Track (DataCamp, 2020)
- Deep Learning Specialization (Coursera - DeepLearning.AI, 2021)

LANGUAGES:
- Bilingual: Arabic and English

Answer questions about Mohammad professionally and helpfully. If asked about topics outside his expertise, politely redirect to his areas of specialization. Keep responses concise but informative.`;

// Chat endpoint
router.post(
  "/chat",
  validateMessage,
  asyncHandler(async (req, res) => {
    const { message } = req.body;

    logger.info("Chat request received", {
      messageLength: message.length,
      ip: req.ip,
      userAgent: req.get("User-Agent"),
    });

    try {
      // Call OpenAI API
      const completion = await openai.chat.completions.create({
        model: config.openai.model,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: message },
        ],
        max_tokens: config.openai.maxTokens,
        temperature: config.openai.temperature,
      });

      const response = completion.choices[0].message.content;

      logger.info("Chat response generated", {
        responseLength: response.length,
        tokensUsed: completion.usage?.total_tokens,
      });

      res.json({ response });
    } catch (error) {
      logger.error("OpenAI API error", {
        error: error.message,
        code: error.code,
        status: error.status,
      });

      let errorMessage =
        "Sorry, I encountered an error. Please try again later.";

      if (error.code === "insufficient_quota") {
        errorMessage = "OpenAI API quota exceeded. Please check your billing.";
      } else if (error.code === "invalid_api_key") {
        errorMessage =
          "Invalid OpenAI API key. Please check your configuration.";
      } else if (error.code === "rate_limit_exceeded") {
        errorMessage =
          "Rate limit exceeded. Please wait a moment and try again.";
      }

      res.status(500).json({
        error: errorMessage,
      });
    }
  }),
);

module.exports = router;
