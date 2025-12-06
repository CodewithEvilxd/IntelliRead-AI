import React from 'react';
import { FileText, ArrowRight, Sparkles, Brain, Star, User, MessageSquare, History, LogOut } from 'lucide-react';
import { useUser, useClerk } from '@clerk/clerk-react';

interface LandingPageProps {
    onNavigateToChat: () => void;
    onNavigateToAbout: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onNavigateToChat, onNavigateToAbout }) => {
    const { isSignedIn } = useUser();
    const { signOut } = useClerk();

    // If user is signed in, show dashboard instead of marketing page
    if (isSignedIn) {
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
                                        Welcome back, User
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

                {/* Dashboard Content */}
                <main className="px-4 py-8 mx-auto max-w-4xl sm:px-6">
                    <div className="mb-8">
                        <h2 className="text-2xl font-display font-bold text-vintage-black mb-2">
                            Your Dashboard
                        </h2>
                        <p className="text-vintage-gray-600">
                            Access your document analysis tools and chat history
                        </p>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Quick Actions */}
                        <div className="bg-vintage-white rounded-2xl shadow-vintage-lg border border-vintage-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-vintage-black mb-4">Quick Actions</h3>
                            <div className="space-y-3">
                                <button
                                    onClick={onNavigateToChat}
                                    className="w-full bg-vintage-black text-vintage-white py-3 px-4 rounded-xl font-medium hover:bg-vintage-gray-800 transition-all duration-200 flex items-center justify-center gap-2"
                                >
                                    <MessageSquare className="w-5 h-5" />
                                    Start New Chat
                                </button>
                                <button
                                    onClick={onNavigateToChat}
                                    className="w-full bg-vintage-gray-100 text-vintage-black py-3 px-4 rounded-xl font-medium hover:bg-vintage-gray-200 transition-all duration-200 flex items-center justify-center gap-2"
                                >
                                    <History className="w-5 h-5" />
                                    View Chat History
                                </button>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="bg-vintage-white rounded-2xl shadow-vintage-lg border border-vintage-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-vintage-black mb-4">Recent Activity</h3>
                            <div className="text-center py-8">
                                <FileText className="w-12 h-12 text-vintage-gray-400 mx-auto mb-3" />
                                <p className="text-vintage-gray-500 text-sm">
                                    No recent documents analyzed
                                </p>
                                <p className="text-vintage-gray-400 text-xs mt-1">
                                    Upload your first document to get started
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="mt-8 bg-gradient-to-r from-vintage-black to-vintage-gray-800 rounded-2xl p-6 text-vintage-white">
                        <h3 className="text-lg font-semibold mb-4">Your Stats</h3>
                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                                <div className="text-2xl font-bold">0</div>
                                <div className="text-sm text-vintage-gray-300">Documents</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold">0</div>
                                <div className="text-vintage-gray-300">Chats</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold">0</div>
                                <div className="text-vintage-gray-300">Hours Saved</div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    const features = [
        {
            icon: FileText,
            title: 'Multi-Format Support',
            description: 'Process PDFs, Word docs, PowerPoint presentations, and text files',
            highlight: '4+ formats supported'
        },
        {
            icon: Brain,
            title: 'AI-Powered Analysis',
            description: 'Advanced Groq AI with Meta Llama models for intelligent insights',
            highlight: 'Latest AI tech'
        },
        {
            icon: Sparkles,
            title: 'Lightning Fast',
            description: 'Get answers in seconds with optimized processing pipeline',
            highlight: '< 2s response time'
        },
        {
            icon: Brain,
            title: 'Enterprise Security',
            description: 'Bank-level encryption with robust failover systems',
            highlight: '100% secure'
        },
        {
            icon: Sparkles,
            title: 'Beautiful Design',
            description: 'Vintage aesthetics meet modern UX with glass effects',
            highlight: 'Award-winning UI'
        },
        {
            icon: Star,
            title: '2025 Ready',
            description: 'Built with React 19, TypeScript, and future-proof architecture',
            highlight: 'Next-gen tech'
        },
        // Removed authentication-dependent features for now
    ];

    return (
        <div className="min-h-screen bg-vintage-white overflow-hidden">
            {/* Enhanced Aesthetic Background Elements */}
            <div className="fixed inset-0 pointer-events-none">
                {/* Diagonal Lines - More and varied */}
                <div className="absolute top-16 left-8 w-20 h-px bg-vintage-gray-300 rotate-45 opacity-50 animate-fade-in"></div>
                <div className="absolute top-24 right-16 w-28 h-px bg-vintage-gray-300 -rotate-45 opacity-40 animate-fade-in animation-delay-200"></div>
                <div className="absolute top-40 left-1/4 w-16 h-px bg-vintage-gray-300 rotate-12 opacity-35 animate-fade-in animation-delay-300"></div>
                <div className="absolute bottom-32 left-16 w-24 h-px bg-vintage-gray-300 rotate-12 opacity-45 animate-fade-in animation-delay-500"></div>
                <div className="absolute bottom-48 right-12 w-32 h-px bg-vintage-gray-300 -rotate-12 opacity-40 animate-fade-in animation-delay-700"></div>
                <div className="absolute top-1/2 right-1/4 w-18 h-px bg-vintage-gray-300 rotate-75 opacity-30 animate-fade-in animation-delay-1000"></div>
                <div className="absolute top-3/4 left-1/3 w-22 h-px bg-vintage-gray-300 -rotate-30 opacity-35 animate-fade-in animation-delay-500"></div>

                {/* Horizontal Flowing Lines */}
                <div className="absolute top-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-vintage-gray-300 to-transparent opacity-20 animate-fade-in animation-delay-300"></div>
                <div className="absolute bottom-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-vintage-gray-300 to-transparent opacity-15 animate-fade-in animation-delay-700"></div>

                {/* Dotted Lines - Enhanced patterns */}
                <div className="absolute top-1/4 left-1/4 flex space-x-1 animate-fade-in animation-delay-500">
                    {[...Array(12)].map((_, i) => (
                        <div key={i} className="w-1 h-1 bg-vintage-gray-400 rounded-full opacity-25"
                            style={{ animationDelay: `${i * 0.08}s` }}></div>
                    ))}
                </div>
                <div className="absolute top-2/3 right-1/4 flex space-x-1 animate-fade-in animation-delay-700">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="w-1 h-1 bg-vintage-gray-400 rounded-full opacity-20"
                            style={{ animationDelay: `${i * 0.12}s` }}></div>
                    ))}
                </div>
                <div className="absolute top-1/2 left-8 flex space-x-1 rotate-90 animate-fade-in animation-delay-300">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="w-1 h-1 bg-vintage-gray-400 rounded-full opacity-30"></div>
                    ))}
                </div>

                {/* Vertical Dotted Lines */}
                <div className="absolute top-1/3 left-1/2 flex flex-col space-y-1 animate-fade-in animation-delay-500">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="w-1 h-1 bg-vintage-gray-400 rounded-full opacity-15"></div>
                    ))}
                </div>
                <div className="absolute top-1/4 right-1/3 flex flex-col space-y-1 animate-fade-in animation-delay-700">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="w-1 h-1 bg-vintage-gray-400 rounded-full opacity-25"></div>
                    ))}
                </div>

                {/* Corner and Scattered Decorative Elements */}
                <div className="absolute top-20 right-20 w-8 h-8 border border-vintage-gray-300 rounded-full opacity-25 animate-vintage-pulse"></div>
                <div className="absolute bottom-24 left-20 w-6 h-6 border border-vintage-gray-300 rotate-45 opacity-20 animate-vintage-pulse animation-delay-300"></div>
                <div className="absolute top-1/2 left-16 w-4 h-4 bg-vintage-gray-300 rotate-45 opacity-15 animate-vintage-pulse animation-delay-500"></div>
                <div className="absolute bottom-1/3 right-24 w-10 h-10 border-2 border-vintage-gray-300 opacity-20 animate-vintage-pulse animation-delay-700"></div>

                {/* Flowing Curves (using CSS transforms) */}
                <div className="absolute top-0 left-1/4 w-1 h-32 bg-gradient-to-b from-transparent via-vintage-gray-300 to-transparent opacity-20 transform rotate-12 animate-fade-in animation-delay-1000"></div>
                <div className="absolute bottom-0 right-1/3 w-1 h-24 bg-gradient-to-t from-transparent via-vintage-gray-300 to-transparent opacity-15 transform -rotate-12 animate-fade-in animation-delay-1000"></div>
            </div>

            {/* Navigation - Fully Responsive */}
            <nav className="relative z-10 px-4 sm:px-6 lg:px-8 py-3 border-b border-vintage-gray-200 bg-vintage-white/95 backdrop-blur-sm">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 sm:w-7 sm:h-7 bg-vintage-black rounded-md flex items-center justify-center">
                            <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-vintage-white" />
                        </div>
                        <span className="text-lg sm:text-xl font-display font-semibold tracking-vintage">Snap Study</span>
                    </div>
                    <div className="hidden sm:flex items-center space-x-4">
                        <button className="nav-link text-sm">Features</button>
                        <button
                            onClick={onNavigateToAbout}
                            className="nav-link text-sm"
                        >
                            About
                        </button>
                        <button
                            onClick={onNavigateToChat}
                            className="btn-primary text-sm px-4 py-1.5"
                        >
                            Sign In
                        </button>
                    </div>
                    <div className="sm:hidden">
                        <button
                            onClick={onNavigateToChat}
                            className="btn-primary text-sm px-3 py-1.5"
                        >
                            Sign In
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section - Enhanced with more elements and fully responsive */}
            <section className="relative z-10 pt-8 sm:pt-12 lg:pt-16 pb-12 sm:pb-16 lg:pb-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="space-y-4 sm:space-y-6">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-vintage text-vintage-black animate-slide-up">
                            <span className="inline-flex items-center gap-3">
                                AI That Reads Documents
                                <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-vintage-black animate-pulse" />
                            </span>
                            <br />
                            <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium text-vintage-gray-700">You Don't Have To</span>
                        </h1>

                        {/* Enhanced decorative elements around hero */}
                        <div className="relative py-4 sm:py-6">
                            <div className="decorative-line w-16 sm:w-20 md:w-24 mx-auto animate-fade-in animation-delay-300"></div>
                            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                <div className="flex space-x-1">
                                    <div className="w-1 h-1 bg-vintage-gray-400 rounded-full opacity-40"></div>
                                    <div className="w-1 h-1 bg-vintage-gray-400 rounded-full opacity-60"></div>
                                    <div className="w-1 h-1 bg-vintage-gray-400 rounded-full opacity-40"></div>
                                </div>
                            </div>
                        </div>

                        <p className="text-base sm:text-lg md:text-xl text-vintage-gray-600 max-w-2xl mx-auto leading-relaxed animate-slide-up animation-delay-200 px-4 sm:px-0">
                            {isSignedIn ? (
                                <>
                                    <span className="inline-flex items-center gap-2">
                                        Welcome back, User!
                                        <User className="w-5 h-5 text-vintage-black" />
                                    </span>
                                    <br />
                                    Continue your document analysis journey. Your chat history and search queries are saved for easy access.
                                </>
                            ) : (
                                <>
                                    <span className="inline-flex items-center gap-2">
                                        <Brain className="w-5 h-5 text-vintage-black" />
                                        Upload any document and start chatting
                                    </span>
                                    . Get instant answers, summaries, and insights
                                    from PDFs, Word docs, PowerPoint presentations, and text files.
                                </>
                            )}
                        </p>
                    </div>

                    <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 px-4 sm:px-0 animate-slide-up animation-delay-500">
                        <button
                            onClick={onNavigateToChat}
                            className="w-full sm:w-auto btn-primary text-base px-6 py-3 flex items-center justify-center space-x-2 group"
                        >
                            <span>Start Now</span>
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </button>
                    </div>
                </div>
            </section>

            {/* Decorative Divider - Responsive */}
            <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center justify-center space-x-4">
                        <div className="decorative-line flex-1"></div>
                        <div className="decorative-dots"></div>
                        <div className="decorative-line flex-1"></div>
                    </div>
                </div>
            </div>

            {/* Features Section - Fully Responsive Grid */}
            <section className="relative z-10 py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-8 sm:mb-12">
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-semibold tracking-vintage mb-3">
                            Everything You Need
                        </h2>
                        <p className="text-vintage-gray-600 text-sm sm:text-base max-w-2xl mx-auto px-4 sm:px-0">
                            Powerful AI meets elegant design. Process documents faster than ever before.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="card-feature group animate-slide-up"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className="flex items-start space-x-3">
                                    <div className="flex-shrink-0">
                                        <div className="w-10 h-10 bg-gradient-to-br from-vintage-black to-vintage-gray-800 rounded-xl flex items-center justify-center
                                                        group-hover:scale-110 transition-all duration-300 shadow-lg">
                                            <feature.icon className="w-5 h-5 text-vintage-white" />
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <h3 className="text-base font-semibold text-vintage-black">
                                                {feature.title}
                                            </h3>
                                            <span className="text-xs font-medium text-vintage-white bg-vintage-black px-2 py-1 rounded-full">
                                                {feature.highlight}
                                            </span>
                                        </div>
                                        <p className="text-sm text-vintage-gray-600 leading-5">
                                            {feature.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section - Responsive */}
            <section className="relative z-10 py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-vintage-gray-50">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="space-y-4">
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-semibold tracking-vintage">
                            Stop Reading. Start Asking.
                        </h2>
                        <p className="text-vintage-gray-600 text-sm sm:text-base max-w-xl mx-auto px-4 sm:px-0">
                            Transform how you work with documents. Upload, ask, get answers.
                        </p>
                    </div>

                    <div className="mt-6">
                        <button
                            onClick={onNavigateToChat}
                            className="w-full sm:w-auto btn-primary text-base px-8 py-3 inline-flex items-center justify-center space-x-2 group"
                        >
                            <span>Start Now</span>
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer - Responsive */}
            <footer className="relative z-10 border-t border-vintage-gray-200 bg-vintage-white">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                    <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
                        <div className="flex items-center space-x-2">
                            <div className="w-5 h-5 bg-vintage-black rounded flex items-center justify-center">
                                <FileText className="w-3 h-3 text-vintage-white" />
                            </div>
                            <span className="font-display font-medium text-vintage-black">Snap Study</span>
                        </div>

                        <div className="flex flex-col sm:flex-row items-start justify-start space-y-3 sm:space-y-0 sm:space-x-16 text-xs sm:text-sm text-vintage-gray-600">
                            <span>AI-powered document analysis platform with vintage aesthetics. Upload documents and chat with your files using advanced AI.</span>
                            <span className="hidden sm:inline">•</span>
                            <span>Built with Modern Tech</span>
                            <span className="hidden sm:inline">•</span>
                            <span>© 2025</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage; 