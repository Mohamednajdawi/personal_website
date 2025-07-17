# Mohammad Alnajdawi - Personal Portfolio Website

A professional portfolio website showcasing AI & NLP engineering expertise, now featuring an intelligent AI chatbot assistant.

## 🤖 New Feature: AI Chatbot Assistant

The website now includes an AI-powered chatbot that can answer questions about Mohammad's experience, skills, and projects using OpenAI's GPT model.

## 🚀 Quick Start

### Prerequisites

- Node.js (version 16 or higher)
- npm (Node Package Manager)
- OpenAI API key

### Installation

1. **Clone or download this repository**

   ```bash
   cd personal_website
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   # Copy the example environment file
   cp env.example .env

   # Edit the .env file and add your OpenAI API key
   # Replace 'your_openai_api_key_here' with your actual API key
   ```

4. **Get your OpenAI API key**

   - Go to [OpenAI API Keys](https://platform.openai.com/api-keys)
   - Create a new API key
   - Copy the key to your `.env` file

5. **Start the server**

   ```bash
   # For development (with auto-restart)
   npm run dev

   # For production
   npm start
   ```

6. **Open your browser**
   - Navigate to `http://localhost:3000`
   - The website will load with the chatbot functionality

## 💬 Using the Chatbot

- Click the green robot icon (floating button) to open the chatbot
- Ask questions about Mohammad's experience, skills, projects, or education
- The AI assistant has comprehensive knowledge about Mohammad's background
- Examples of questions you can ask:
  - "What is Mohammad's experience with NLP?"
  - "Tell me about his projects"
  - "What are his technical skills?"
  - "Where did he study?"

## 🔧 Configuration

### Environment Variables

The following environment variables can be configured in your `.env` file:

| Variable         | Description                    | Default         |
| ---------------- | ------------------------------ | --------------- |
| `OPENAI_API_KEY` | Your OpenAI API key (required) | -               |
| `OPENAI_MODEL`   | OpenAI model to use            | `gpt-3.5-turbo` |
| `MAX_TOKENS`     | Maximum response length        | `500`           |
| `TEMPERATURE`    | AI response creativity (0-1)   | `0.7`           |
| `PORT`           | Server port                    | `3000`          |
| `NODE_ENV`       | Environment mode               | `development`   |

### Customization

To customize the chatbot's knowledge or behavior:

1. Edit the `SYSTEM_PROMPT` in `server.js`
2. Modify the chatbot UI in `index.html`
3. Adjust the styling and colors as needed

## 📁 Project Structure

```
personal_website/
├── index.html          # Main website file
├── server.js           # Backend server with chatbot API
├── package.json        # Node.js dependencies
├── env.example         # Environment variables template
├── profile_pic.jpg     # Profile image
├── resume.pdf          # Resume file
└── README.md           # This file
```

## 🛠 Technology Stack

### Frontend

- HTML5, CSS3, JavaScript
- Tailwind CSS for styling
- Font Awesome for icons
- Responsive design

### Backend

- Node.js with Express.js
- OpenAI API integration
- CORS enabled for cross-origin requests
- Environment-based configuration

### AI Features

- OpenAI GPT-3.5-turbo (configurable)
- Contextual responses about Mohammad's background
- Professional conversation handling
- Error handling and rate limiting

## 🚀 Deployment Options

### Local Development

- Run `npm run dev` for development with auto-restart
- Access at `http://localhost:3000`

### Production Deployment

#### Option 1: VPS/Server

1. Upload files to your server
2. Install Node.js and npm
3. Set up environment variables
4. Run `npm install && npm start`
5. Use a process manager like PM2 for production

#### Option 2: Cloud Platforms

- **Heroku**: Add your OpenAI API key in Config Vars
- **Vercel**: Deploy with serverless functions
- **Railway**: Direct deployment with environment variables
- **Netlify**: Use Netlify Functions for the backend

### Environment Variables for Deployment

Make sure to set your `OPENAI_API_KEY` in your deployment platform's environment variables section.

## 💡 Features

### Website Features

- Responsive design for all devices
- Professional portfolio layout
- Contact form integration
- Social media links
- Download resume functionality
- SEO optimized

### Chatbot Features

- Real-time AI conversations
- Professional knowledge base
- Typing indicators
- Error handling
- Mobile-friendly interface
- Accessible design

## 🔒 Security Notes

- The OpenAI API key is securely stored on the server
- Frontend never exposes the API key
- Rate limiting and error handling implemented
- CORS configured for security

## 📞 Support

For questions about the portfolio or technical implementation:

- Email: najdawimohamed@gmail.com
- LinkedIn: [Mohammad Alnajdawi](https://www.linkedin.com/in/mohammad-alnajdawi-233027173)
- GitHub: [Mohamednajdawi](https://github.com/Mohamednajdawi)

## 📝 License

This project is open source and available under the MIT License.

---

**Note**: Remember to keep your OpenAI API key secure and never commit it to version control. Always use environment variables for sensitive configuration.
