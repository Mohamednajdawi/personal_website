const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// OpenAI configuration
const { OpenAI } = require('openai');

let openai;
if (process.env.OPENAI_API_KEY) {
    openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });
}

// System prompt with Mohammad's information
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

// Health check endpoint
app.get('/api/health', (req, res) => {
    if (!process.env.OPENAI_API_KEY) {
        return res.status(503).json({ 
            status: 'error', 
            message: 'OpenAI API key not configured' 
        });
    }
    res.json({ status: 'ok', message: 'Chatbot service is running' });
});

// Chat endpoint
app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;
        
        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        if (!process.env.OPENAI_API_KEY) {
            return res.status(503).json({ 
                error: 'OpenAI API key not configured. Please check your environment variables.' 
            });
        }

        if (!openai) {
            return res.status(503).json({ 
                error: 'OpenAI client not initialized' 
            });
        }

        // Call OpenAI API
        const completion = await openai.chat.completions.create({
            model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: SYSTEM_PROMPT },
                { role: 'user', content: message }
            ],
            max_tokens: parseInt(process.env.MAX_TOKENS) || 500,
            temperature: parseFloat(process.env.TEMPERATURE) || 0.7,
        });

        const response = completion.choices[0].message.content;
        
        res.json({ response });
        
    } catch (error) {
        console.error('Error calling OpenAI API:', error);
        
        let errorMessage = 'Sorry, I encountered an error. Please try again later.';
        
        if (error.code === 'insufficient_quota') {
            errorMessage = 'OpenAI API quota exceeded. Please check your billing.';
        } else if (error.code === 'invalid_api_key') {
            errorMessage = 'Invalid OpenAI API key. Please check your configuration.';
        } else if (error.code === 'rate_limit_exceeded') {
            errorMessage = 'Rate limit exceeded. Please wait a moment and try again.';
        }
        
        res.status(500).json({ 
            error: errorMessage,
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Open http://localhost:${PORT} to view the website`);
    
    if (!process.env.OPENAI_API_KEY) {
        console.warn('⚠️  WARNING: OPENAI_API_KEY not found in environment variables');
        console.warn('⚠️  Please create a .env file with your OpenAI API key');
    } else {
        console.log('✅ OpenAI API key loaded successfully');
    }
});

module.exports = app; 