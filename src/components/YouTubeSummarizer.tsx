import React, { useState } from 'react';
import { ArrowLeft, Play, MessageSquare, Youtube, Clock, Eye, User, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { extractVideoId, getVideoInfo, summarizeVideo, chatWithVideo, isValidYouTubeUrl, VideoSummary, YouTubeVideoInfo } from '../services/youtubeService';

interface YouTubeSummarizerProps {
  onBackToLanding: () => void;
}

const YouTubeSummarizer: React.FC<YouTubeSummarizerProps> = ({ onBackToLanding }) => {
  const [videoUrl, setVideoUrl] = useState('');
  const [videoInfo, setVideoInfo] = useState<YouTubeVideoInfo | null>(null);
  const [summary, setSummary] = useState<VideoSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{ role: 'user' | 'assistant'; content: string; timestamp: Date }>>([]);
  const [isChatting, setIsChatting] = useState(false);

  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoUrl.trim()) return;

    if (!isValidYouTubeUrl(videoUrl)) {
      setError('Please enter a valid YouTube URL');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const videoId = extractVideoId(videoUrl);
      if (!videoId) throw new Error('Invalid YouTube URL');

      const info = await getVideoInfo(videoId);
      setVideoInfo(info);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch video information');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSummarize = async () => {
    if (!videoInfo) return;

    setIsSummarizing(true);
    setError(null);

    try {
      const videoSummary = await summarizeVideo(videoInfo);
      setSummary(videoSummary);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate summary');
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim() || !summary) return;

    const userMessage = chatMessage.trim();
    setChatMessage('');
    setIsChatting(true);
    setError(null);

    // Add user message to chat
    const newUserMessage = { role: 'user' as const, content: userMessage, timestamp: new Date() };
    setChatHistory(prev => [...prev, newUserMessage]);

    try {
      const response = await chatWithVideo(userMessage, summary, chatHistory.map(h => ({ role: h.role, content: h.content })));

      // Add AI response to chat
      const aiMessage = { role: 'assistant' as const, content: response, timestamp: new Date() };
      setChatHistory(prev => [...prev, aiMessage]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get response');
    } finally {
      setIsChatting(false);
    }
  };

  return (
    <div className="min-h-screen bg-vintage-white">
      {/* Header */}
      <header className="relative z-10 border-b backdrop-blur-sm border-vintage-gray-200 bg-vintage-white/95">
        <div className="px-4 py-4 mx-auto max-w-4xl sm:px-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBackToLanding}
                className="p-2 rounded-lg btn-ghost focus-vintage"
                title="Back to homepage"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="flex justify-center items-center w-10 h-10 rounded-lg bg-red-600 shadow-vintage">
                  <Youtube className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold font-display tracking-vintage">
                    YouTube Summarizer
                  </h1>
                  <p className="text-xs text-vintage-gray-500">
                    AI-Powered Video Analysis
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-8 mx-auto max-w-4xl sm:px-6">
        {/* URL Input Section */}
        {!videoInfo && (
          <div className="mb-8">
            <div className="bg-vintage-white rounded-2xl shadow-vintage-lg border border-vintage-gray-200 p-8">
              <div className="text-center mb-6">
                <Youtube className="w-16 h-16 text-red-600 mx-auto mb-4" />
                <h2 className="text-2xl font-display font-bold text-vintage-black mb-2">
                  Summarize YouTube Videos
                </h2>
                <p className="text-vintage-gray-600">
                  Paste a YouTube URL and get AI-powered summaries, key insights, and chat with video content
                </p>
              </div>

              <form onSubmit={handleUrlSubmit} className="max-w-2xl mx-auto">
                <div className="flex gap-3">
                  <input
                    type="url"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="flex-1 px-4 py-3 text-sm rounded-xl border border-vintage-gray-300 bg-vintage-white text-vintage-black placeholder-vintage-gray-500 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400"
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !videoUrl.trim()}
                    className="px-6 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
                  >
                    {isLoading ? (
                      <Loader className="w-4 h-4 animate-spin" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                    Analyze
                  </button>
                </div>
              </form>

              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <span className="text-red-800 text-sm">{error}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Video Info Section */}
        {videoInfo && !summary && (
          <div className="mb-8">
            <div className="bg-vintage-white rounded-2xl shadow-vintage-lg border border-vintage-gray-200 overflow-hidden">
              <div className="aspect-video relative">
                <img
                  src={videoInfo.thumbnailUrl}
                  alt={videoInfo.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                  <div className="bg-red-600 rounded-full p-4">
                    <Play className="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-vintage-black mb-2">{videoInfo.title}</h3>
                <p className="text-vintage-gray-600 mb-4">{videoInfo.channelTitle}</p>

                <div className="flex flex-wrap gap-4 text-sm text-vintage-gray-500 mb-6">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {videoInfo.duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {videoInfo.viewCount} views
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {videoInfo.channelTitle}
                  </div>
                </div>

                <button
                  onClick={handleSummarize}
                  disabled={isSummarizing}
                  className="w-full bg-red-600 text-white py-3 px-6 rounded-xl font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
                >
                  {isSummarizing ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      Generating Summary...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Generate AI Summary
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Summary Section */}
        {summary && (
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Summary Content */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-vintage-white rounded-2xl shadow-vintage-lg border border-vintage-gray-200 p-6">
                <h3 className="text-xl font-bold text-vintage-black mb-4">Video Summary</h3>
                <p className="text-vintage-gray-700 leading-relaxed mb-6">{summary.summary}</p>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-vintage-black">Duration:</span>
                    <span className="text-vintage-gray-600 ml-2">{summary.duration}</span>
                  </div>
                  <div>
                    <span className="font-medium text-vintage-black">Language:</span>
                    <span className="text-vintage-gray-600 ml-2">{summary.language}</span>
                  </div>
                  <div>
                    <span className="font-medium text-vintage-black">Sentiment:</span>
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                      summary.sentiment === 'positive' ? 'bg-green-100 text-green-800' :
                      summary.sentiment === 'negative' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {summary.sentiment}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-vintage-black">Topics:</span>
                    <span className="text-vintage-gray-600 ml-2">{summary.topics.length}</span>
                  </div>
                </div>
              </div>

              {summary.keyPoints.length > 0 && (
                <div className="bg-vintage-white rounded-2xl shadow-vintage-lg border border-vintage-gray-200 p-6">
                  <h4 className="text-lg font-bold text-vintage-black mb-4">Key Points</h4>
                  <ul className="space-y-2">
                    {summary.keyPoints.map((point, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-vintage-gray-700">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {summary.topics.length > 0 && (
                <div className="bg-vintage-white rounded-2xl shadow-vintage-lg border border-vintage-gray-200 p-6">
                  <h4 className="text-lg font-bold text-vintage-black mb-4">Topics Covered</h4>
                  <div className="flex flex-wrap gap-2">
                    {summary.topics.map((topic, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-vintage-gray-100 text-vintage-gray-700 rounded-full text-sm"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Chat Section */}
            <div className="bg-vintage-white rounded-2xl shadow-vintage-lg border border-vintage-gray-200 p-6">
              <h4 className="text-lg font-bold text-vintage-black mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Chat with Video
              </h4>

              <div className="h-96 flex flex-col">
                <div className="flex-1 overflow-y-auto mb-4 space-y-3">
                  {chatHistory.length === 0 ? (
                    <p className="text-center text-vintage-gray-500 text-sm py-8">
                      Ask questions about this video...
                    </p>
                  ) : (
                    chatHistory.map((message, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg text-sm ${
                          message.role === 'user'
                            ? 'bg-red-50 text-red-900 ml-4'
                            : 'bg-vintage-gray-50 text-vintage-gray-900 mr-4'
                        }`}
                      >
                        <p className="leading-relaxed">{message.content}</p>
                      </div>
                    ))
                  )}
                  {isChatting && (
                    <div className="bg-vintage-gray-50 text-vintage-gray-900 mr-4 p-3 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Loader className="w-4 h-4 animate-spin" />
                        <span className="text-sm">Thinking...</span>
                      </div>
                    </div>
                  )}
                </div>

                <form onSubmit={handleChatSubmit} className="flex gap-2">
                  <input
                    type="text"
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    placeholder="Ask about the video..."
                    className="flex-1 px-3 py-2 text-sm rounded-lg border border-vintage-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400"
                    disabled={isChatting}
                  />
                  <button
                    type="submit"
                    disabled={!chatMessage.trim() || isChatting}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && summary && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <span className="text-red-800 text-sm">{error}</span>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-600 hover:text-red-800"
            >
              ✕
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default YouTubeSummarizer;