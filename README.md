# IntelliRead AI 🤖

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

## 🚀 Quick Deploy

[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/codewithevilxd/intelli-read-ai)
[![Deploy with Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/codewithevilxd/intelli-read-ai)

> **2025 Edition** - Revolutionizing document analysis with cutting-edge AI technology and timeless vintage design. Transform how you interact with documents through intelligent conversations and instant insights.

AI-powered document analysis platform with vintage aesthetics. Upload documents and chat with your files using advanced AI.

## ✨ Features

🤖 **AI Chat Interface** - Natural conversation about your document content using Groq's Meta Llama models
📄 **Multi-Format Support** - Process PDFs, Word docs, PowerPoint presentations, and text files
⚡ **Instant Analysis** - Get insights and answers in seconds with lightning-fast processing
🎨 **Beautiful Design** - Vintage black & white aesthetic with glass effects and smooth animations
📱 **Fully Responsive** - Works perfectly on desktop, tablet, and mobile devices
🔒 **Secure & Private** - Your documents stay private and secure with robust encryption
🚀 **2025 Ready** - Built with the latest technologies for future-proof performance

## 🛠️ Tech Stack

- **Frontend**: React 19 + TypeScript for type-safe, modern development
- **Styling**: Tailwind CSS with custom vintage design system and glass effects
- **AI**: Groq SDK with Meta Llama models (3-key failover system for reliability)
- **Document Processing**: PDF.js, Mammoth.js, and custom text extraction for multiple formats
- **Build**: Vite with SWC for lightning-fast compilation and hot reloading
- **Fonts**: Inter + Space Grotesk for modern, readable typography
- **Icons**: Lucide React for consistent, beautiful iconography

## 🚀 Quick Deploy

### One-Click Deploy
Click the buttons below to deploy your own instance of IntelliRead AI:

<p align="center">
  <a href="https://vercel.com/new/clone?repository-url=https://github.com/codewithevilxd/intelli-read-ai" style="margin-right: 20px;">
    <img src="https://vercel.com/button" alt="Deploy to Vercel" />
  </a>
  <a href="https://app.netlify.com/start/deploy?repository=https://github.com/codewithevilxd/intelli-read-ai">
    <img src="https://www.netlify.com/img/deploy/button.svg" alt="Deploy with Netlify" />
  </a>
</p>

### Manual Setup

#### Prerequisites
- Node.js 18+ and npm
- Groq API key (get one at [groq.com](https://groq.com))

#### Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-username/intelli-read-ai.git
cd intelli-read-ai
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
# Copy the example file
cp .env.example .env

# Edit .env and add your Groq API keys (up to 3 for failover)
VITE_GROQ_API_KEY_1=your_first_groq_api_key_here
VITE_GROQ_API_KEY_2=your_second_groq_api_key_here  # optional
VITE_GROQ_API_KEY_3=your_third_groq_api_key_here   # optional
```

4. **Start development server**
```bash
npm run dev
```

5. **Open your browser**
Visit `http://localhost:5173` to see IntelliRead AI in action! 🎉

## 📁 Routes

- `/` - Landing page with features showcase and vintage design
- `/chat` - Interactive chat interface for document analysis
- `/about` - About page with project information and statistics

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

## 🎯 Key Features Implemented

✅ **Responsive Design** - Mobile-first approach with perfect scaling across all devices
✅ **URL Routing** - Clean navigation with `/chat` and `/about` routes
✅ **Aesthetic Elements** - Beautiful dotted lines, diagonal elements, and smooth animations
✅ **Multi-Format Processing** - PDF, Word, PowerPoint, and text file support with robust parsing
✅ **AI Integration** - Contextual conversations with 3-key failover system for reliability
✅ **Modern Typography** - Compact, readable fonts with perfect spacing and hierarchy
✅ **Glass Effects** - Premium visual effects throughout the interface with backdrop blur
✅ **Button Hover States** - All interactions work perfectly with smooth transitions
✅ **2025 Ready** - Built with latest React 19, TypeScript, and modern web standards

## ⚡ Performance Optimizations

- ⚡ Optimized bundle splitting for faster loading
- 🗜️ Terser minification for smaller bundle sizes
- 🧹 Cleaned up 70+ unused dependencies
- 📦 Minimal build size with maximum functionality
- 🚀 Vite's fast HMR for development productivity

## 📸 Screenshots

*Coming soon - Beautiful screenshots showcasing the vintage design and AI chat interface*

## 🤝 Contributing

We welcome contributions! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### How to Contribute

1. **Fork the project** - Click the fork button on GitHub
2. **Clone your fork**
```bash
git clone https://github.com/your-username/intelli-read-ai.git
cd intelli-read-ai
```
3. **Create your feature branch**
```bash
git checkout -b feature/AmazingFeature
```
4. **Make your changes** and test them thoroughly
5. **Commit your changes**
```bash
git commit -m 'Add some AmazingFeature'
```
6. **Push to the branch**
```bash
git push origin feature/AmazingFeature
```
7. **Open a Pull Request** - We'll review and merge your contribution!

### Development Guidelines

- Follow the existing code style and TypeScript best practices
- Add tests for new features
- Update documentation as needed
- Ensure all ESLint rules pass

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 💡 Recommended Component Libraries for Enhancement

### Animation & Interactions
- **Framer Motion** - Production-ready motion library for React
```bash
npm install framer-motion
```

### UI Components & Icons
- **Radix UI** - Unstyled, accessible UI primitives for buttons, dialogs, tooltips
```bash
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-tooltip
```
- **React Icons** - Popular icon library with 24,000+ icons (alternative to Lucide)
```bash
npm install react-icons
```
- **Headless UI** - Completely unstyled, fully accessible UI components (great for custom deploy buttons)
```bash
npm install @headlessui/react
```
- **Chakra UI** - Simple, modular and accessible component library with beautiful button components
```bash
npm install @chakra-ui/react @emotion/react @emotion/styled framer-motion
```
- **Mantine** - React components library with 100+ components including customizable buttons
```bash
npm install @mantine/core @mantine/hooks
```
- **Ant Design** - Enterprise UI design language with polished deploy buttons
```bash
npm install antd
```

### Enhanced Markdown & Code
- **React Markdown** - Markdown component for React
- **React Syntax Highlighter** - Syntax highlighting component
```bash
npm install react-markdown react-syntax-highlighter @types/react-syntax-highlighter
```

### Form Handling
- **React Hook Form** - Performant forms with easy validation
```bash
npm install react-hook-form @hookform/resolvers zod
```

### State Management (if needed)
- **Zustand** - Small, fast state management
```bash
npm install zustand
```

---

Built with ❤️ using modern web technologies. Perfect for document analysis workflows in 2025 and beyond!
