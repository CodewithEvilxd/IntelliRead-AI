# IntelliRead AI

AI-powered document analysis platform with vintage aesthetics. Upload documents and chat with your files using advanced AI.

## Features

🤖 **AI Chat Interface** - Natural conversation about your document content using Groq's Meta Llama models
📄 **Multi-Format Support** - Process PDFs, Word docs, PowerPoint presentations, and text files
⚡ **Instant Analysis** - Get insights and answers in seconds
🎨 **Beautiful Design** - Vintage black & white aesthetic with glass effects
📱 **Fully Responsive** - Works perfectly on desktop, tablet, and mobile
🔒 **Secure** - Your documents stay private and secure

## Tech Stack

- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS with custom vintage design system
- **AI**: Groq SDK with Meta Llama models (3-key failover system)
- **Document Processing**: PDF.js, custom text extraction for multiple formats
- **Build**: Vite with SWC for fast compilation
- **Fonts**: Inter + Space Grotesk for modern typography

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
# Copy the example file
cp .env.example .env

# Edit .env and add your Groq API keys (up to 3 for failover)
VITE_GROQ_API_KEY_1=your_first_groq_api_key_here
VITE_GROQ_API_KEY_2=your_second_groq_api_key_here  # optional
VITE_GROQ_API_KEY_3=your_third_groq_api_key_here   # optional
```

3. Start development server:
```bash
npm run dev
```

4. Visit `http://localhost:5173` to see the app in action!

## Routes

- `/` - Landing page with features showcase
- `/chat` - Chat interface for PDF analysis

## Project Structure

```
src/
├── components/          # React components
│   ├── LandingPage.tsx  # Homepage with aesthetic elements
│   └── Chat.tsx         # Chat interface (fully responsive)
├── services/            # API integrations
│   ├── groqService.ts   # AI chat functionality with 3-key failover
│   ├── fileService.ts   # Multi-format document processing
│   └── pdfService.ts    # Legacy PDF processing (deprecated)
├── types/               # TypeScript type definitions
├── utils/               # Utility functions & markdown parser
└── constants/           # Theme and configuration
```

## Key Features Implemented

✅ **Responsive Design** - Mobile-first approach with perfect scaling
✅ **URL Routing** - Clean `/chat` route navigation
✅ **Aesthetic Elements** - Beautiful dotted lines, diagonal elements, and animations
✅ **Multi-Format Processing** - PDF, Word, PowerPoint, and text file support
✅ **AI Integration** - Contextual conversations with 3-key failover system
✅ **Modern Typography** - Compact, readable fonts with perfect spacing
✅ **Glass Effects** - Premium visual effects throughout the interface
✅ **Button Hover States** - All interactions work perfectly

## Performance Optimizations

- ⚡ Optimized bundle splitting
- 🗜️ Terser minification
- 🧹 Cleaned up 70+ unused dependencies
- 📦 Minimal build size with maximum functionality

---

Built with ❤️ using modern web technologies. Perfect for document analysis workflows!