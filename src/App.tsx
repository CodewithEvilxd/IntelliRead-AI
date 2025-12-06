import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import LandingPage from './components/LandingPage';
import Chat from './components/Chat';
import LoginPage from './components/LoginPage';
import YouTubeSummarizer from './components/YouTubeSummarizer';
import Dashboard from './components/Dashboard';
import ChatHistory from './components/ChatHistory';
import Community from './components/Community';
import APITest from './components/APITest';

const App: React.FC = () => {
  const { isSignedIn, isLoaded } = useUser();
  const [currentPage, setCurrentPage] = useState<'landing' | 'login' | 'chat' | 'youtube' | 'dashboard' | 'history' | 'community' | 'api-test'>('landing');
  const [hasVisitedDashboard, setHasVisitedDashboard] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  // Auto-redirect authenticated users to dashboard only on first login
  useEffect(() => {
    if (isSignedIn && !hasVisitedDashboard) {
      setCurrentPage('dashboard');
      setHasVisitedDashboard(true);
    }
  }, [isSignedIn, hasVisitedDashboard]);

  // Redirect unauthenticated users trying to access chat to login
  useEffect(() => {
    if (!isSignedIn && currentPage === 'chat') {
      setCurrentPage('login');
    }
  }, [isSignedIn, currentPage]);

  // Show loading while Clerk is initializing
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-vintage-white flex items-center justify-center">
        <div className="spinner-vintage w-8 h-8" />
      </div>
    );
  }

  const navigateToLogin = () => {
    setCurrentPage('login');
  };

  const navigateToLanding = () => {
    setCurrentPage('landing');
  };

  const navigateToAbout = () => {
    // For now, just stay on landing page
    console.log('About page - coming soon');
  };

  const navigateToYouTube = () => {
    setCurrentPage('youtube');
  };

  const navigateToDashboard = () => {
    setCurrentPage('dashboard');
  };

  const navigateToHistory = () => {
    setCurrentPage('history');
  };

  const navigateToCommunity = () => {
    setCurrentPage('community');
  };

  const resumeChat = (type: 'pdf' | 'youtube', sessionId: string) => {
    setCurrentSessionId(sessionId);
    if (type === 'pdf') {
      setCurrentPage('chat');
    } else if (type === 'youtube') {
      setCurrentPage('youtube');
    }
  };

  // Authentication-based routing
  if (isSignedIn) {
    // Authenticated users
    if (currentPage === 'dashboard') {
      return <Dashboard
        onNavigateToChat={() => setCurrentPage('chat')}
        onNavigateToYouTube={navigateToYouTube}
        onNavigateToHistory={navigateToHistory}
        onNavigateToCommunity={navigateToCommunity}
        onBackToLanding={navigateToLanding}
      />;
    }
    if (currentPage === 'history') {
      return <ChatHistory
        onBackToDashboard={navigateToDashboard}
        onResumeChat={resumeChat}
      />;
    }
    if (currentPage === 'chat') {
      return <Chat onBackToLanding={navigateToDashboard} sessionId={currentSessionId || undefined} />;
    }
    if (currentPage === 'youtube') {
      return <YouTubeSummarizer onBackToLanding={navigateToDashboard} sessionId={currentSessionId || undefined} />;
    }
    if (currentPage === 'community') {
      return <Community onBackToLanding={navigateToDashboard} />;
    }
    if (currentPage === 'api-test') {
      return <APITest />;
    }
    // Default to dashboard for authenticated users
    return <Dashboard
      onNavigateToChat={() => setCurrentPage('chat')}
      onNavigateToYouTube={navigateToYouTube}
      onNavigateToHistory={navigateToHistory}
      onNavigateToCommunity={navigateToCommunity}
      onBackToLanding={navigateToLanding}
    />;
  } else {
    // Unauthenticated users
    if (currentPage === 'login') {
      return <LoginPage onBackToLanding={navigateToLanding} />;
    }
    if (currentPage === 'youtube') {
      return <YouTubeSummarizer onBackToLanding={navigateToLanding} sessionId={undefined} />;
    }
    // Show landing page for guests, but require auth for chat access
    return (
      <div className="min-h-screen bg-vintage-white">
        <LandingPage
          onNavigateToChat={navigateToLogin} // Always require login for chat access
          onNavigateToAbout={navigateToAbout}
        />
      </div>
    );
  }
};

export default App;
