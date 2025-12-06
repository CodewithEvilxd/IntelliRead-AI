import React, { useState, useEffect, useCallback } from 'react';
import { useClerk } from '@clerk/clerk-react';
import {
    ArrowLeft,
    Search,
    Plus,
    MessageSquare,
    Users,
    Clock,
    CheckCircle,
    ChevronDown,
    Hash,
    BookOpen,
    ThumbsUp,
    ThumbsDown,
    MessageCircle,
    User
} from 'lucide-react';
import { cn, formatRelativeTime } from '../utils';
import type { Question, Subject, QuestionFilters } from '../types/community';
import { getQuestions, getSubjects, getCommunityStats } from '../services/communityService';

interface CommunityProps {
    onBackToLanding: () => void;
}

const Community: React.FC<CommunityProps> = ({ onBackToLanding }) => {
    const { signOut } = useClerk();

    const [questions, setQuestions] = useState<Question[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSubject, setSelectedSubject] = useState<string>('');
    const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'most-voted' | 'unanswered'>('newest');
    const [stats, setStats] = useState<{
        totalQuestions: number;
        totalAnswers: number;
        totalUsers: number;
        questionsToday: number;
        answersToday: number;
        activeUsersToday: number;
    } | null>(null);

    const loadQuestions = useCallback(async () => {
        try {
            const filters: QuestionFilters = {
                search: searchQuery,
                subject: selectedSubject,
                sortBy,
            };
            const response = await getQuestions(filters);
            setQuestions(response.questions);
        } catch (error) {
            console.error('Error loading questions:', error);
        }
    }, [searchQuery, selectedSubject, sortBy]);

    // Load initial data
    useEffect(() => {
        loadData();
    }, []);

    // Load questions when filters change
    useEffect(() => {
        loadQuestions();
    }, [loadQuestions]);

    const loadData = async () => {
        try {
            setLoading(true);
            const [subjectsData, statsData] = await Promise.all([
                getSubjects(),
                getCommunityStats()
            ]);
            setSubjects(subjectsData);
            setStats(statsData);
        } catch (error) {
            console.error('Error loading community data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSignOut = async () => {
        await signOut();
    };

    if (loading) {
        return (
            <div className="flex flex-col h-screen bg-vintage-white text-vintage-black">
                <div className="flex justify-center items-center flex-1">
                    <div className="spinner-vintage w-8 h-8" />
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen bg-vintage-white text-vintage-black">
            {/* Header */}
            <header className="relative z-10 border-b backdrop-blur-sm border-vintage-gray-200 bg-vintage-white/95">
                <div className="px-4 py-4 mx-auto max-w-6xl sm:px-6">
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
                                <div className="flex justify-center items-center w-10 h-10 rounded-lg bg-vintage-black shadow-vintage">
                                    <Users className="w-6 h-6 text-vintage-white" />
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold font-display tracking-vintage">
                                        Study Community
                                    </h1>
                                    <p className="text-xs text-vintage-gray-500">
                                        Ask questions, share knowledge, get help
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <button
                                onClick={handleSignOut}
                                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-vintage-gray-700 hover:text-vintage-black bg-vintage-gray-100 hover:bg-vintage-gray-200 rounded-lg transition-all duration-200"
                                title="Sign out"
                            >
                                <User className="w-4 h-4" />
                                <span className="hidden sm:inline">Sign Out</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Stats Bar */}
            {stats && (
                <div className="relative z-10 border-b border-vintage-gray-200 bg-blue-50">
                    <div className="px-4 py-3 mx-auto max-w-6xl sm:px-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">{stats.totalQuestions}</div>
                                <div className="text-xs text-blue-600/70">Questions</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-green-600">{stats.totalAnswers}</div>
                                <div className="text-xs text-green-600/70">Answers</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-purple-600">{stats.questionsToday}</div>
                                <div className="text-xs text-purple-600/70">Today</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-orange-600">{stats.activeUsersToday}</div>
                                <div className="text-xs text-orange-600/70">Active Users</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="flex overflow-hidden flex-col flex-1">
                <div className="overflow-y-auto flex-1">
                    <div className="px-4 py-6 mx-auto max-w-6xl sm:px-6">
                        <div className="space-y-6">
                            {/* Search and Filters */}
                            <div className="bg-white rounded-xl border border-vintage-gray-200 p-4">
                                <div className="flex flex-col md:flex-row gap-4">
                                    {/* Search */}
                                    <div className="flex-1 relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-vintage-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Search questions..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 border border-vintage-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vintage-gray-400"
                                        />
                                    </div>

                                    {/* Subject Filter */}
                                    <div className="relative">
                                        <select
                                            value={selectedSubject}
                                            onChange={(e) => setSelectedSubject(e.target.value)}
                                            className="appearance-none bg-white border border-vintage-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-vintage-gray-400"
                                        >
                                            <option value="">All Subjects</option>
                                            {subjects.map(subject => (
                                                <option key={subject.id} value={subject.id}>
                                                    {subject.icon} {subject.name}
                                                </option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-vintage-gray-400 pointer-events-none" />
                                    </div>

                                    {/* Sort */}
                                    <div className="relative">
                                        <select
                                            value={sortBy}
                                            onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest' | 'most-voted' | 'unanswered')}
                                            className="appearance-none bg-white border border-vintage-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-vintage-gray-400"
                                        >
                                            <option value="newest">Newest</option>
                                            <option value="oldest">Oldest</option>
                                            <option value="most-voted">Most Voted</option>
                                            <option value="unanswered">Unanswered</option>
                                        </select>
                                        <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-vintage-gray-400 pointer-events-none" />
                                    </div>

                                    {/* Ask Question Button - Disabled for now */}
                                    <button
                                        disabled
                                        className="btn-primary flex items-center gap-2 px-4 py-2 opacity-50 cursor-not-allowed"
                                        title="Coming soon"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Ask Question (Coming Soon)
                                    </button>
                                </div>
                            </div>

                            {/* Questions List */}
                            <div className="space-y-4">
                                {questions.length === 0 ? (
                                    <div className="text-center py-12">
                                        <MessageSquare className="w-16 h-16 text-vintage-gray-300 mx-auto mb-4" />
                                        <h3 className="text-lg font-semibold text-vintage-gray-600 mb-2">No questions found</h3>
                                        <p className="text-vintage-gray-500 mb-4">
                                            {searchQuery || selectedSubject ? 'Try adjusting your filters' : 'Be the first to ask a question!'}
                                        </p>
                                        <button
                                            disabled
                                            className="btn-primary opacity-50 cursor-not-allowed"
                                            title="Coming soon"
                                        >
                                            Ask the First Question (Coming Soon)
                                        </button>
                                    </div>
                                ) : (
                                    questions.map((question) => (
                                        <QuestionCard key={question.id} question={question} />
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Question Card Component
interface QuestionCardProps {
    question: Question;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question }) => {
    const score = question.upvotes.length - question.downvotes.length;

    return (
        <div className="bg-white rounded-xl border border-vintage-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex gap-4">
                {/* Voting */}
                <div className="flex flex-col items-center gap-1 min-w-[60px]">
                    <button className="p-1 rounded hover:bg-vintage-gray-100">
                        <ThumbsUp className="w-4 h-4 text-vintage-gray-400" />
                    </button>
                    <span className={cn(
                        "text-sm font-semibold",
                        score > 0 ? "text-green-600" : score < 0 ? "text-red-600" : "text-vintage-gray-600"
                    )}>
                        {score}
                    </span>
                    <button className="p-1 rounded hover:bg-vintage-gray-100">
                        <ThumbsDown className="w-4 h-4 text-vintage-gray-400" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-vintage-black mb-2 line-clamp-2">
                                {question.title}
                            </h3>

                            <p className="text-vintage-gray-600 mb-3 line-clamp-3">
                                {question.content}
                            </p>

                            {/* Hashtags */}
                            {question.hashtags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {question.hashtags.slice(0, 3).map((hashtag, index) => (
                                        <span
                                            key={index}
                                            className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
                                        >
                                            <Hash className="w-3 h-3" />
                                            {hashtag}
                                        </span>
                                    ))}
                                    {question.hashtags.length > 3 && (
                                        <span className="text-xs text-vintage-gray-500">
                                            +{question.hashtags.length - 3} more
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between text-sm text-vintage-gray-500">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                                <User className="w-4 h-4" />
                                <span>{question.user.name}</span>
                            </div>

                            <div className="flex items-center gap-1">
                                <BookOpen className="w-4 h-4" />
                                <span className="px-2 py-1 bg-vintage-gray-100 rounded text-xs">
                                    {question.subject.icon} {question.subject.name}
                                </span>
                            </div>

                            <div className="flex items-center gap-1">
                                <MessageCircle className="w-4 h-4" />
                                <span>{question.answerCount} answers</span>
                            </div>

                            <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span>{formatRelativeTime(question.createdAt)}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            {question.isAnswered && (
                                <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                                    <CheckCircle className="w-3 h-3" />
                                    Answered
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Community;