import React from 'react';
import { FileText, Youtube, LogOut, Brain, MessageSquare, History, Users } from 'lucide-react';
import { useUser, useClerk } from '@clerk/clerk-react';
import { APIButton } from './APILogos';

interface DashboardProps {
  onNavigateToChat: () => void;
  onNavigateToYouTube: () => void;
  onNavigateToHistory: () => void;
  onNavigateToCommunity: () => void;
  onBackToLanding: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigateToChat, onNavigateToYouTube, onNavigateToHistory, onNavigateToCommunity, onBackToLanding }) => {
  const { user } = useUser();
  const { signOut } = useClerk();

  return (
    <div className="min-h-screen bg-vintage-white">
      {/* Header */}
      <header className="relative z-10 border-b backdrop-blur-sm border-vintage-gray-200 bg-vintage-white/95">
        <div className="px-4 py-4 mx-auto max-w-4xl sm:px-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="flex justify-center items-center w-10 h-10 rounded-lg bg-vintage-black shadow-vintage">
                <Brain className="w-6 h-6 text-vintage-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold font-display tracking-vintage">
                  Snap Study
                </h1>
                <p className="text-xs text-vintage-gray-500">
                  Welcome back, {user?.firstName || 'User'}
                </p>
              </div>
            </div>
            <button
              onClick={() => signOut()}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-vintage-gray-700 hover:text-vintage-black bg-vintage-gray-100 hover:bg-vintage-gray-200 rounded-lg transition-all duration-200"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-8 mx-auto max-w-4xl sm:px-6">
        <div className="mb-8">
          <h2 className="text-2xl font-display font-bold text-vintage-black mb-2">
            Choose Your Tool
          </h2>
          <p className="text-vintage-gray-600">
            Select the AI-powered tool you want to use for your documents or videos
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* PDF Chat Tool */}
          <div className="bg-vintage-white rounded-2xl shadow-vintage-lg border border-vintage-gray-200 p-6 hover:shadow-vintage-xl transition-all duration-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-vintage-black to-vintage-gray-800 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-vintage-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-vintage-black">Document Chat</h3>
                <p className="text-sm text-vintage-gray-600">Chat with your PDFs and documents</p>
              </div>
            </div>
            <p className="text-vintage-gray-600 mb-6">
              Upload PDFs, Word docs, PowerPoint presentations, and text files. Ask questions and get instant answers powered by AI.
            </p>
            <APIButton
              onClick={onNavigateToChat}
              variant="primary"
              size="md"
              apis={['openai', 'groq', 'openrouter']}
              className="w-full"
            >
              <MessageSquare className="w-5 h-5" />
              Start Document Chat
            </APIButton>
          </div>

          {/* YouTube Summarizer Tool */}
          <div className="bg-vintage-white rounded-2xl shadow-vintage-lg border border-vintage-gray-200 p-6 hover:shadow-vintage-xl transition-all duration-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-700 rounded-xl flex items-center justify-center">
                <Youtube className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-vintage-black">YouTube Summarizer</h3>
                <p className="text-sm text-vintage-gray-600">Summarize YouTube videos</p>
              </div>
            </div>
            <p className="text-vintage-gray-600 mb-6">
              Paste a YouTube URL and get AI-powered summaries, key points, and insights from any video content.
            </p>
            <APIButton
              onClick={onNavigateToYouTube}
              variant="primary"
              size="md"
              apis={['openai', 'groq', 'openrouter']}
              className="w-full bg-red-600 hover:bg-red-700 text-white"
            >
              <Youtube className="w-5 h-5" />
              Summarize YouTube Video
            </APIButton>
          </div>

          {/* Community Tool */}
          <div className="bg-vintage-white rounded-2xl shadow-vintage-lg border border-vintage-gray-200 p-6 hover:shadow-vintage-xl transition-all duration-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-vintage-black">Study Community</h3>
                <p className="text-sm text-vintage-gray-600">Q&A with peers</p>
              </div>
            </div>
            <p className="text-vintage-gray-600 mb-6">
              Ask questions, share knowledge, and get help from the community. Browse questions by subject and contribute answers.
            </p>
            <APIButton
              onClick={onNavigateToCommunity}
              variant="primary"
              size="md"
              apis={['openai', 'groq', 'openrouter']}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Users className="w-5 h-5" />
              Join Community
            </APIButton>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-vintage-white rounded-2xl shadow-vintage-lg border border-vintage-gray-200 p-6">
          <h3 className="text-lg font-semibold text-vintage-black mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={onNavigateToHistory}
              className="bg-vintage-gray-100 text-vintage-black py-3 px-4 rounded-xl font-medium hover:bg-vintage-gray-200 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <History className="w-5 h-5" />
              View Chat History
            </button>
            <button
              onClick={onBackToLanding}
              className="bg-vintage-gray-100 text-vintage-black py-3 px-4 rounded-xl font-medium hover:bg-vintage-gray-200 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Brain className="w-5 h-5" />
              Back to Home
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;