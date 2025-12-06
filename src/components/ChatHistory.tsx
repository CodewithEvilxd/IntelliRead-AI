import React, { useState, useEffect } from 'react';
import { ArrowLeft, FileText, Youtube, MessageSquare, Calendar, Clock, Trash2, Eye } from 'lucide-react';
import { formatRelativeTime } from '../utils';

interface ChatHistoryProps {
  onBackToDashboard: () => void;
  onResumeChat: (type: 'pdf' | 'youtube', sessionId: string) => void;
}

interface HistoryItem {
  id: string;
  type: 'pdf' | 'youtube';
  title: string;
  timestamp: Date;
  messageCount: number;
  lastMessage: string;
  videoUrl?: string;
  documentName?: string;
}

const ChatHistory: React.FC<ChatHistoryProps> = ({ onBackToDashboard, onResumeChat }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'pdf' | 'youtube'>('all');
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    try {
      const savedHistory = localStorage.getItem('chatHistory');
      if (savedHistory) {
        const parsed = JSON.parse(savedHistory);
        // Convert timestamp strings back to Date objects
        const historyWithDates = parsed.map((item: Omit<HistoryItem, 'timestamp'> & { timestamp: string }) => ({
          ...item,
          timestamp: new Date(item.timestamp)
        }));
        setHistory(historyWithDates);
      }
    } catch (error) {
      console.error('Failed to load history:', error);
    }
  };

  const deleteHistoryItem = (id: string) => {
    try {
      const updatedHistory = history.filter(item => item.id !== id);
      setHistory(updatedHistory);
      localStorage.setItem('chatHistory', JSON.stringify(updatedHistory));

      // Also clean up the actual session data
      localStorage.removeItem(`session_${id}`);
    } catch (error) {
      console.error('Failed to delete history item:', error);
    }
  };

  const clearAllHistory = () => {
    if (confirm('Are you sure you want to clear all chat history? This action cannot be undone.')) {
      try {
        setHistory([]);
        localStorage.removeItem('chatHistory');

        // Clear all session data
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith('session_')) {
            localStorage.removeItem(key);
          }
        });
      } catch (error) {
        console.error('Failed to clear history:', error);
      }
    }
  };

  const filteredHistory = history.filter(item => {
    if (activeTab === 'all') return true;
    return item.type === activeTab;
  });

  const groupedHistory = filteredHistory.reduce((groups, item) => {
    const date = item.timestamp.toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(item);
    return groups;
  }, {} as Record<string, HistoryItem[]>);

  return (
    <div className="min-h-screen bg-vintage-white">
      {/* Header */}
      <header className="relative z-10 border-b backdrop-blur-sm border-vintage-gray-200 bg-vintage-white/95">
        <div className="px-4 py-4 mx-auto max-w-4xl sm:px-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBackToDashboard}
                className="p-2 rounded-lg btn-ghost focus-vintage"
                title="Back to dashboard"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="flex justify-center items-center w-10 h-10 rounded-lg bg-vintage-black shadow-vintage">
                  <MessageSquare className="w-6 h-6 text-vintage-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold font-display tracking-vintage">
                    Chat History
                  </h1>
                  <p className="text-xs text-vintage-gray-500">
                    Your conversation history
                  </p>
                </div>
              </div>
            </div>

            {history.length > 0 && (
              <button
                onClick={clearAllHistory}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-all duration-200"
                title="Clear all history"
              >
                <Trash2 className="w-4 h-4" />
                Clear All
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-8 mx-auto max-w-4xl sm:px-6">
        {/* Tabs */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-vintage-gray-100 p-1 rounded-xl w-fit">
            {[
              { key: 'all' as const, label: 'All Chats', count: history.length },
              { key: 'pdf' as const, label: 'PDF Chats', count: history.filter(h => h.type === 'pdf').length },
              { key: 'youtube' as const, label: 'YouTube Chats', count: history.filter(h => h.type === 'youtube').length }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  activeTab === tab.key
                    ? 'bg-vintage-white text-vintage-black shadow-sm'
                    : 'text-vintage-gray-600 hover:text-vintage-gray-800'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>

        {/* History Content */}
        {Object.keys(groupedHistory).length === 0 ? (
          <div className="text-center py-16">
            <MessageSquare className="w-16 h-16 text-vintage-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-vintage-gray-600 mb-2">No chat history yet</h3>
            <p className="text-vintage-gray-500">
              Start chatting with documents or YouTube videos to see your history here.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedHistory)
              .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
              .map(([date, items]) => (
                <div key={date}>
                  <div className="flex items-center gap-3 mb-4">
                    <Calendar className="w-5 h-5 text-vintage-gray-500" />
                    <h3 className="text-lg font-semibold text-vintage-black">
                      {new Date(date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="bg-vintage-white rounded-xl shadow-vintage border border-vintage-gray-200 p-4 hover:shadow-vintage-lg transition-all duration-200"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4 flex-1">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                              item.type === 'pdf'
                                ? 'bg-vintage-black'
                                : 'bg-red-600'
                            }`}>
                              {item.type === 'pdf' ? (
                                <FileText className="w-5 h-5 text-white" />
                              ) : (
                                <Youtube className="w-5 h-5 text-white" />
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold text-vintage-black truncate">
                                  {item.title}
                                </h4>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  item.type === 'pdf'
                                    ? 'bg-vintage-gray-100 text-vintage-gray-700'
                                    : 'bg-red-100 text-red-700'
                                }`}>
                                  {item.type === 'pdf' ? 'PDF' : 'YouTube'}
                                </span>
                              </div>

                              {item.documentName && (
                                <p className="text-sm text-vintage-gray-600 mb-1">
                                  📄 {item.documentName}
                                </p>
                              )}

                              {item.videoUrl && (
                                <p className="text-sm text-vintage-gray-600 mb-1 truncate">
                                  🎥 {item.videoUrl}
                                </p>
                              )}

                              <p className="text-sm text-vintage-gray-600 line-clamp-2">
                                {item.lastMessage}
                              </p>

                              <div className="flex items-center gap-4 mt-2 text-xs text-vintage-gray-500">
                                <div className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {formatRelativeTime(item.timestamp)}
                                </div>
                                <div className="flex items-center gap-1">
                                  <MessageSquare className="w-3 h-3" />
                                  {item.messageCount} messages
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 ml-4">
                            <button
                              onClick={() => onResumeChat(item.type, item.id)}
                              className="flex items-center gap-2 px-3 py-2 bg-vintage-black text-white rounded-lg hover:bg-vintage-gray-800 transition-colors text-sm"
                            >
                              <Eye className="w-4 h-4" />
                              Resume
                            </button>
                            <button
                              onClick={() => deleteHistoryItem(item.id)}
                              className="p-2 text-vintage-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete conversation"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ChatHistory;