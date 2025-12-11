const express = require("express");
const { OpenAI } = require("openai");
const { validateMessage } = require("../middleware/validation");
const { asyncHandler } = require("../middleware/errorHandler");
const logger = require("../utils/logger");
const config = require("../config/environment");

const router = express.Router();

// Initialize OpenAI client only if API key is provided
let openai = null;
if (config.openai.apiKey) {
    openai = new OpenAI({
        apiKey: config.openai.apiKey,
    });
}

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

FEATURED PROJECTS:
1. Progrezz (https://progrezz.at/):
   - AI-powered study assistant for generating quizzes, flashcards, and essays
   - Features intelligent feedback loop that learns from mistakes
   - Adaptive learning system that focuses on weak points
   - Technologies: AI Agents, RAG, Feedback Loop, EdTech

2. NORMO - Baurecht Assistent (https://app.normo.at/):
   - AI-powered construction law assistant for Austrian building regulations
   - Multi-agent AI system for intelligent legal guidance
   - Document analysis using advanced NLP
   - Technologies: AI Agents, LegalTech, NLP, Multi-Agent Systems

3. AIKA (http://aika.at/):
   - Advanced RAG system with precise document citation capabilities
   - Expansion RAG architecture for enhanced accuracy
   - Exact document source referencing for traceability
   - Technologies: RAG, Citations, Vector DB, LLMs

OTHER PROJECTS:
- Legal Intelligence RAG System for Arcture (improved search by 40%)
- AI Session Summarizer (reduced support team analysis time by 60%)
- Medical Data ETL Pipeline
- Production ML Pipeline Automation with MLOps
- Session Activity Recorder with Computer Vision

PUBLICATIONS:
- "Generating Actionable Insights from Patient Medical Records and Structured Clinical Knowledge" (2024)
- Published in Studies in Health Technology and Informatics

CERTIFICATIONS:
- Data Scientist with R Track (DataCamp, 2020)
- Deep Learning Specialization (Coursera - DeepLearning.AI, 2021)

LANGUAGES:
- Bilingual: Arabic and English

Answer questions about Mohammad professionally and helpfully. If asked about topics outside his expertise, politely redirect to his areas of specialization. Keep responses concise but informative.`;

// Chat endpoint with streaming support
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

    // Check if OpenAI is configured
    if (!openai) {
        logger.warn('OpenAI not configured - returning mock response', {
            environment: config.env,
            ip: req.ip
        });
        
        // Set up SSE headers for streaming
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        
        const mockResponse = "Hello! I'm Mohammad's AI assistant. The chatbot is currently in development mode. Please add your OpenAI API key to enable full functionality. You can ask me about Mohammad's background, skills, and experience, and I'll provide a helpful response based on his portfolio information.";
        
        // Stream the mock response character by character
        for (let i = 0; i < mockResponse.length; i++) {
            res.write(`data: ${JSON.stringify({ content: mockResponse[i] })}\n\n`);
            await new Promise(resolve => setTimeout(resolve, 20));
        }
        res.write('data: [DONE]\n\n');
        return res.end();
    }

    try {
      // Set up SSE headers for streaming
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      // Call OpenAI API with streaming
      const stream = await openai.chat.completions.create({
        model: config.openai.model,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: message },
        ],
        max_tokens: config.openai.maxTokens,
        temperature: config.openai.temperature,
        stream: true,
      });

      let fullResponse = '';
      
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        if (content) {
          fullResponse += content;
          // Send each chunk as SSE
          res.write(`data: ${JSON.stringify({ content })}\n\n`);
        }
      }

      logger.info("Chat response streamed", {
        responseLength: fullResponse.length,
      });

      // Send completion signal
      res.write('data: [DONE]\n\n');
      res.end();
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

      res.write(`data: ${JSON.stringify({ error: errorMessage })}\n\n`);
      res.write('data: [DONE]\n\n');
      res.end();
    }
  }),
);

module.exports = router;
