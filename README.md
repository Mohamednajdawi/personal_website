# Mohammad Alnajdawi - Personal Portfolio Website

🎨 **NEW**: Modern redesign with dark theme, neon accents, and smooth animations inspired by [yasio.dev](https://yasio.dev/)

A professional portfolio website showcasing AI & NLP engineering expertise, featuring:
- ✨ Modern developer-focused design with code aesthetics
- 🤖 Intelligent AI chatbot assistant powered by OpenAI
- 📝 Technical blog with markdown support
- 🎯 Interactive project showcase
- 🌐 Fully responsive and mobile-optimized

## 🤖 New Feature: AI Chatbot Assistant with Streaming ✨

The website now includes an **AI-powered chatbot with real-time streaming responses**! Watch as the AI types out answers with a cool cyberpunk-themed typewriter effect.

### Features:
- 🌊 **Real-time Streaming**: Responses appear character-by-character as they're generated
- ⚡ **Instant Feedback**: No more waiting for complete responses
- 💚 **Cool Effects**: Blinking terminal cursor with neon green glow
- 🎨 **Cyberpunk Theme**: Matches the website's aesthetic perfectly
- 🤖 **Smart Assistant**: Answers questions about Mohammad's experience, skills, and projects

For detailed information about the streaming implementation, see [STREAMING_CHATBOT.md](STREAMING_CHATBOT.md).

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
   - The website will load with the modern design and chatbot functionality
   - Enjoy the glitch loading animation and smooth scroll effects!

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
├── index.html              # Main homepage (modern design)
├── blog.html               # Blog listing page
├── server.js               # Backend server with chatbot API
├── package.json            # Node.js dependencies
├── env.example             # Environment variables template
├── .eslintrc.js            # ESLint configuration ✨ NEW
├── .prettierrc             # Prettier configuration ✨ NEW
├── sw.js                   # Service worker for PWA
├── DESIGN_NOTES.md         # Design documentation
├── STREAMING_CHATBOT.md    # Streaming feature docs ✨ NEW
├── assets/
│   ├── css/
│   │   ├── modern.css      # Main modern design styles ✨ NEW
│   │   ├── blog.css        # Blog-specific styles ✨ NEW
│   │   ├── main.css        # Legacy styles
│   │   └── components.css  # Component styles
│   ├── images/
│   │   └── mohammad_alnajdawi.jpg
│   ├── blog-posts/         # Markdown blog posts
│   │   ├── rag-systems-guide.md
│   │   ├── ml-pipeline-automation.md
│   │   └── session-activity-recorder.md
│   └── resume.pdf
└── README.md               # This file
```

## 🎨 Design

This website features a **modern, developer-focused design** inspired by [yasio.dev](https://yasio.dev/):

### Key Design Elements
- 🌑 **Dark Theme**: Black background with neon green (#00ff88) accents
- 💻 **Code Aesthetics**: Terminal prompts, code blocks, and developer styling
- ✨ **Smooth Animations**: Glitch effects, floating orbs, scroll-triggered animations
- 🎯 **Interactive Elements**: Hover effects, card transformations, smooth transitions
- 📱 **Responsive**: Optimized for all screen sizes

### Typography
- **Body**: Inter (Modern sans-serif)
- **Code**: Fira Code (Monospace with ligatures)

For detailed design documentation, see [DESIGN_NOTES.md](DESIGN_NOTES.md)

## 🛠 Technology Stack

### Frontend

- HTML5, CSS3, JavaScript (Vanilla JS - no frameworks)
- Modern CSS (Grid, Flexbox, Custom Properties)
- Intersection Observer API for animations
- Font Awesome for icons
- Google Fonts (Inter, Fira Code)
- Marked.js for Markdown parsing
- Prism.js for syntax highlighting

### Backend

- Node.js with Express.js
- OpenAI API integration
- CORS enabled for cross-origin requests
- Environment-based configuration
- Helmet for security
- Winston for logging

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

### Design Features

- 🌑 **Dark Theme**: Modern dark design with neon green (#00ff88) accents
- ✨ **Animations**: Glitch effects, floating orbs, smooth transitions
- 💻 **Code Aesthetics**: Terminal-style elements and syntax-highlighted sections
- 📱 **Responsive**: Mobile-first design with optimized layouts
- 🎯 **Interactive**: Hover effects, scroll animations, and smooth navigation

### Website Features

- **Hero Section**: Animated introduction with rotating skills showcase
- **Timeline**: Visual work experience timeline with technology tags
- **Projects**: Card-based project showcase with direct blog links
- **About**: Code-style presentation (JavaScript class format)
- **Contact**: Dual-layout with contact methods and form
- **Blog**: Modern article cards with modal-based full reading experience
- **SEO Optimized**: Meta tags, structured data, sitemap

### Chatbot Features

- 🌊 **Streaming Responses**: Real-time character-by-character streaming
- 💚 **Typewriter Effect**: Cool terminal-style cursor with glow
- 🤖 **Smart AI**: Powered by OpenAI with comprehensive knowledge
- ⚡ **Instant Feedback**: No waiting for complete responses
- 🎨 **Theme Integration**: Matches cyberpunk aesthetic
- 📱 **Mobile-friendly**: Optimized slide-up interface
- ♿ **Accessible**: Keyboard navigation support

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

## 🎨 Design Credits

The modern design of this website is inspired by [yasio.dev](https://yasio.dev/) by Jan Baszczok. 

Key inspirations:
- Dark theme with neon accent colors
- Terminal and code-style aesthetics
- Section naming convention with "/>" suffix
- Smooth animations and transitions
- Developer-focused presentation style

The implementation has been customized and extended with unique features for Mohammad's portfolio.

## 📝 License

This project is open source and available under the MIT License.

---

**Note**: Remember to keep your OpenAI API key secure and never commit it to version control. Always use environment variables for sensitive configuration.
