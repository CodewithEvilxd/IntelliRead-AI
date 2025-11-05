import React, { useState, useEffect } from 'react';
import { ArrowLeft, Brain, FileText, Zap, Shield, Users, ChevronDown, ChevronUp, Play, Star, CheckCircle } from 'lucide-react';

interface AboutPageProps {
  onBackToLanding: () => void;
}

const AboutPage: React.FC<AboutPageProps> = ({ onBackToLanding }) => {
  const [counters, setCounters] = useState({
    documentsProcessed: 0,
    usersServed: 0,
    responseTime: 0,
    accuracy: 0
  });

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Research Analyst",
      content: "IntelliRead AI has revolutionized how I analyze research documents. What used to take hours now takes minutes.",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Legal Professional",
      content: "The accuracy and speed of document analysis is incredible. Perfect for contract review and legal research.",
      rating: 5
    },
    {
      name: "Dr. Emily Rodriguez",
      role: "Academic Researcher",
      content: "As a researcher, I deal with hundreds of papers. IntelliRead AI helps me extract key insights instantly.",
      rating: 5
    }
  ];

  const faqs = [
    {
      question: "What file formats does IntelliRead AI support?",
      answer: "We support PDF, Word documents (.docx), PowerPoint presentations (.pptx), and plain text files. Our AI can process and analyze content from all these formats seamlessly."
    },
    {
      question: "How secure is my document data?",
      answer: "Your documents are processed securely with industry-standard encryption. We don't store your files permanently - they're processed in real-time and immediately discarded after analysis."
    },
    {
      question: "Can I ask questions in natural language?",
      answer: "Absolutely! Our conversational AI understands natural language queries. You can ask questions like 'What are the main findings?' or 'Summarize the methodology section' and get contextual answers."
    },
    {
      question: "What's the response time for document analysis?",
      answer: "Most documents are processed and ready for questions within 2-3 seconds. Larger documents might take slightly longer, but you get instant feedback during processing."
    },
    {
      question: "Do you offer API access for developers?",
      answer: "We're currently focused on our web interface, but API access is planned for future releases. Stay tuned for developer documentation and integration options."
    }
  ];

  useEffect(() => {
    const statistics = {
      documentsProcessed: 50000,
      usersServed: 2500,
      responseTime: 2,
      accuracy: 98
    };

    const animateCounters = () => {
      const duration = 2000; // 2 seconds
      const steps = 60;
      const increment = duration / steps;

      let step = 0;
      const timer = setInterval(() => {
        step++;
        const progress = step / steps;

        setCounters({
          documentsProcessed: Math.floor(statistics.documentsProcessed * progress),
          usersServed: Math.floor(statistics.usersServed * progress),
          responseTime: Math.min(statistics.responseTime, Math.floor(statistics.responseTime * progress * 10) / 10),
          accuracy: Math.floor(statistics.accuracy * progress)
        });

        if (step >= steps) {
          clearInterval(timer);
          setCounters(statistics);
        }
      }, increment);
    };

    // Start animation when component mounts
    const timer = setTimeout(animateCounters, 500);
    return () => clearTimeout(timer);
  }, []);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen w-full bg-white relative">
      {/* Diagonal Cross Grid Background */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(45deg, transparent 49%, #e5e7eb 49%, #e5e7eb 51%, transparent 51%),
            linear-gradient(-45deg, transparent 49%, #e5e7eb 49%, #e5e7eb 51%, transparent 51%)
          `,
          backgroundSize: "40px 40px",
        }}
      />
      {/* Header */}
      <header className="bg-vintage-brown/10 backdrop-blur-sm border-b border-vintage-brown/20 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={onBackToLanding}
            className="flex items-center gap-2 text-vintage-brown hover:text-vintage-brown/80 transition-colors duration-200 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
            <span className="font-medium">Back to Home</span>
          </button>
          <div className="flex items-center gap-3">
            <Brain className="w-8 h-8 text-vintage-brown" />
            <span className="text-2xl font-display font-bold text-vintage-brown tracking-vintage">
              IntelliRead AI
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-display font-bold text-vintage-brown mb-6 tracking-vintage">
            About IntelliRead AI
          </h1>
          <p className="text-xl text-vintage-brown/80 max-w-3xl mx-auto leading-relaxed">
            Revolutionizing document analysis with cutting-edge AI technology.
            IntelliRead AI transforms how you interact with documents, making complex information
            accessible and actionable through intelligent conversation.
          </p>
        </section>

        {/* Mission Section */}
        <section className="mb-16">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-vintage-brown/10">
            <h2 className="text-3xl font-display font-bold text-vintage-brown mb-6 text-center">
              Our Mission
            </h2>
            <p className="text-lg text-vintage-brown/70 leading-relaxed text-center max-w-4xl mx-auto">
              At IntelliRead AI, we believe that knowledge should be accessible to everyone.
              Our mission is to democratize document analysis by providing an intuitive,
              powerful platform that can understand and explain complex documents in natural language.
              Whether you're a student, researcher, professional, or curious mind, IntelliRead AI
              empowers you to unlock the full potential of your documents.
            </p>
          </div>
        </section>

        {/* Features Grid */}
        <section className="mb-16">
          <h2 className="text-3xl font-display font-bold text-vintage-brown mb-12 text-center">
            What Makes Us Different
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-md border border-vintage-brown/10 hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-vintage-brown/10 rounded-lg flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-vintage-brown" />
              </div>
              <h3 className="text-xl font-semibold text-vintage-brown mb-3">Multi-Format Support</h3>
              <p className="text-vintage-brown/70 leading-relaxed">
                Process PDFs, Word documents, PowerPoint presentations, and text files seamlessly.
                No more format limitations - upload any document type and get instant insights.
              </p>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-md border border-vintage-brown/10 hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-vintage-brown/10 rounded-lg flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-vintage-brown" />
              </div>
              <h3 className="text-xl font-semibold text-vintage-brown mb-3">AI-Powered Analysis</h3>
              <p className="text-vintage-brown/70 leading-relaxed">
                Leveraging advanced Groq AI models to understand context, extract key information,
                and provide intelligent responses to your questions about any document.
              </p>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-md border border-vintage-brown/10 hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-vintage-brown/10 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-vintage-brown" />
              </div>
              <h3 className="text-xl font-semibold text-vintage-brown mb-3">Lightning Fast</h3>
              <p className="text-vintage-brown/70 leading-relaxed">
                Get instant responses with our optimized processing pipeline.
                Upload, analyze, and converse with your documents in seconds, not minutes.
              </p>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-md border border-vintage-brown/10 hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-vintage-brown/10 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-vintage-brown" />
              </div>
              <h3 className="text-xl font-semibold text-vintage-brown mb-3">Privacy First</h3>
              <p className="text-vintage-brown/70 leading-relaxed">
                Your documents are processed securely with robust failover systems.
                We prioritize your privacy and data security at every step.
              </p>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-md border border-vintage-brown/10 hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-vintage-brown/10 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-vintage-brown" />
              </div>
              <h3 className="text-xl font-semibold text-vintage-brown mb-3">User-Centric Design</h3>
              <p className="text-vintage-brown/70 leading-relaxed">
                Built with a vintage-inspired aesthetic that's both beautiful and functional.
                Intuitive interface designed for the modern user who appreciates timeless design.
              </p>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-md border border-vintage-brown/10 hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-vintage-brown/10 rounded-lg flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-vintage-brown" />
              </div>
              <h3 className="text-xl font-semibold text-vintage-brown mb-3">Conversational AI</h3>
              <p className="text-vintage-brown/70 leading-relaxed">
                Ask questions naturally and get contextual answers. Our AI understands nuance
                and provides detailed explanations tailored to your specific queries.
              </p>
            </div>
          </div>
        </section>

        {/* Technology Section */}
        <section className="mb-16">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-vintage-brown/10">
            <h2 className="text-3xl font-display font-bold text-vintage-brown mb-8 text-center">
              Technology Stack
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-vintage-brown mb-4">Frontend</h3>
                <ul className="space-y-2 text-vintage-brown/70">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-vintage-brown rounded-full"></div>
                    React 19 with TypeScript
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-vintage-brown rounded-full"></div>
                    Tailwind CSS for styling
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-vintage-brown rounded-full"></div>
                    Vite for fast development
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-vintage-brown rounded-full"></div>
                    Lucide React for icons
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-vintage-brown mb-4">AI & Processing</h3>
                <ul className="space-y-2 text-vintage-brown/70">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-vintage-brown rounded-full"></div>
                    Groq SDK with Meta Llama models
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-vintage-brown rounded-full"></div>
                    PDF.js for PDF processing
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-vintage-brown rounded-full"></div>
                    Mammoth.js for Word documents
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-vintage-brown rounded-full"></div>
                    Robust file validation & security
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="mb-16">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-vintage-brown/10">
            <h2 className="text-3xl font-display font-bold text-vintage-brown mb-12 text-center">
              By the Numbers
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-vintage-brown mb-2">
                  {counters.documentsProcessed.toLocaleString()}+
                </div>
                <div className="text-vintage-brown/70">Documents Processed</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-vintage-brown mb-2">
                  {counters.usersServed.toLocaleString()}+
                </div>
                <div className="text-vintage-brown/70">Users Served</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-vintage-brown mb-2">
                  {counters.responseTime}s
                </div>
                <div className="text-vintage-brown/70">Average Response Time</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-vintage-brown mb-2">
                  {counters.accuracy}%
                </div>
                <div className="text-vintage-brown/70">Accuracy Rate</div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-display font-bold text-vintage-brown mb-12 text-center">
            What Our Users Say
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-md border border-vintage-brown/10 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-vintage-brown/80 mb-4 italic">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold text-vintage-brown">{testimonial.name}</div>
                  <div className="text-sm text-vintage-brown/60">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-display font-bold text-vintage-brown mb-12 text-center">
            Frequently Asked Questions
          </h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white/60 backdrop-blur-sm rounded-xl border border-vintage-brown/10 overflow-hidden"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-vintage-brown/5 transition-colors duration-200"
                >
                  <span className="font-semibold text-vintage-brown">{faq.question}</span>
                  {openFaq === index ? (
                    <ChevronUp className="w-5 h-5 text-vintage-brown" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-vintage-brown" />
                  )}
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-4">
                    <p className="text-vintage-brown/70 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Interactive Demo Preview */}
        <section className="mb-16">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-vintage-brown/10">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-display font-bold text-vintage-brown mb-4">
                See IntelliRead AI in Action
              </h2>
              <p className="text-vintage-brown/70 max-w-2xl mx-auto">
                Experience how our AI transforms document analysis. Upload a document and ask questions naturally.
              </p>
            </div>
            <div className="bg-gradient-to-br from-vintage-brown/10 to-vintage-brown/5 rounded-xl p-8 border border-vintage-brown/20">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-vintage-brown mb-3">Interactive Demo</h3>
                  <ul className="space-y-2 text-vintage-brown/70">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Upload any document type
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Ask questions in natural language
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Get instant, accurate answers
                    </li>
                  </ul>
                </div>
                <div className="flex-shrink-0">
                  <button
                    onClick={onBackToLanding}
                    className="bg-vintage-brown text-white px-6 py-3 rounded-lg font-medium hover:bg-vintage-brown/90 transition-colors duration-200 shadow-md hover:shadow-lg flex items-center gap-2 group"
                  >
                    <Play className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    Try It Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <div className="bg-gradient-to-r from-vintage-brown/10 to-vintage-brown/5 rounded-2xl p-8 border border-vintage-brown/20">
            <h2 className="text-2xl font-display font-bold text-vintage-brown mb-4">
              Ready to Transform Your Document Experience?
            </h2>
            <p className="text-vintage-brown/70 mb-6 max-w-2xl mx-auto">
              Join thousands of users who have discovered the power of intelligent document analysis.
              Start exploring your documents with IntelliRead AI today.
            </p>
            <button
              onClick={onBackToLanding}
              className="bg-vintage-brown text-white px-8 py-3 rounded-lg font-medium hover:bg-vintage-brown/90 transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              Get Started
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AboutPage;