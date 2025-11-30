import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import LandingPage from './components/LandingPage';
import Chat from './components/Chat';
import LoginPage from './components/LoginPage';
import YouTubeSummarizer from './components/YouTubeSummarizer';

const App: React.FC = () => {
  const { isSignedIn, isLoaded } = useUser();
  const [currentPage, setCurrentPage] = useState<'landing' | 'login' | 'chat' | 'youtube'>('landing');
  const [hasVisitedDashboard, setHasVisitedDashboard] = useState(false);

  // Auto-redirect authenticated users to dashboard (chat) only on first login
  useEffect(() => {
    if (isSignedIn && currentPage === 'landing' && !hasVisitedDashboard) {
      setCurrentPage('chat');
      setHasVisitedDashboard(true);
    }
  }, [isSignedIn, currentPage, hasVisitedDashboard]);

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

  // Authentication-based routing
  if (isSignedIn) {
    // Authenticated users
    if (currentPage === 'chat') {
      return <Chat onBackToLanding={navigateToLanding} />;
    }
    if (currentPage === 'youtube') {
      return <YouTubeSummarizer onBackToLanding={navigateToLanding} />;
    }
    // Default to dashboard for authenticated users
    return (
      <div className="min-h-screen bg-vintage-white">
        <LandingPage
          onNavigateToChat={() => setCurrentPage('chat')} // Direct to chat for logged-in users
          onNavigateToYouTube={navigateToYouTube}
          onNavigateToAbout={navigateToAbout}
        />
      </div>
    );
  } else {
    // Unauthenticated users
    if (currentPage === 'login') {
      return <LoginPage onBackToLanding={navigateToLanding} />;
    }
    if (currentPage === 'youtube') {
      return <YouTubeSummarizer onBackToLanding={navigateToLanding} />;
    }
    // Show landing page for guests, but require auth for chat access
    return (
      <div className="min-h-screen bg-vintage-white">
        <LandingPage
          onNavigateToChat={navigateToLogin} // Always require login for chat access
          onNavigateToYouTube={navigateToYouTube}
          onNavigateToAbout={navigateToAbout}
        />
      </div>
    );
  }
};

export default App;
