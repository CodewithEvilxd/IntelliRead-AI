import React, { useState, useRef, useEffect } from 'react';
import {
    ArrowLeft,
    Send,
    FileText,
    X,
    MessageSquare,
    User,
    Brain,
    AlertCircle,
    Paperclip,
    Bug,
    Zap,
    Clock,
    FileCheck,
    Upload
} from 'lucide-react';
import { cn, generateId, formatRelativeTime, parseMarkdown } from '../utils';
import type { Message, Attachment, ComparisonType } from '../types';
import { processFile, cleanupFileResources, getFileStats, extractKeyInfo, compareDocuments, validateDocumentsForComparison } from '../services/fileService';
import { chatWithContext } from '../services/groqService';

interface ChatProps {
    onBackToLanding: () => void;
}

const Chat: React.FC<ChatProps> = ({ onBackToLanding }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [attachment, setAttachment] = useState<Attachment | null>(null);
    const [attachments, setAttachments] = useState<Attachment[]>([]);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [processingStatus, setProcessingStatus] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [showDebug, setShowDebug] = useState(false);
    const [showComparison, setShowComparison] = useState(false);
    const [comparisonType, setComparisonType] = useState<ComparisonType>('similarity');
    const [isComparing, setIsComparing] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (attachment) {
                cleanupFileResources(attachment);
            }
            attachments.forEach(att => cleanupFileResources(att));
        };
    }, [attachment, attachments]);

    const handleFileUpload = async (file: File, isComparison: boolean = false) => {
        try {
            setIsLoading(true);
            setUploadProgress(0);
            setError(null);
            setProcessingStatus('Validating file...');

            // Simulate upload progress
            const progressInterval = setInterval(() => {
                setUploadProgress(prev => {
                    if (prev < 30) return prev + 5;
                    if (prev < 60) return prev + 3;
                    if (prev < 85) return prev + 2;
                    return prev + 1;
                });
            }, 200);

            setProcessingStatus('Extracting text from document...');

            const newAttachment = await processFile(file);

            clearInterval(progressInterval);
            setUploadProgress(100);
            setProcessingStatus('File processed successfully!');

            if (isComparison) {
                // Add to comparison attachments
                setAttachments(prev => [...prev, newAttachment]);

            } else {
                // Clean up previous attachment
                if (attachment) {
                    cleanupFileResources(attachment);
                }

                setAttachment(newAttachment);

                // Get file statistics for analysis message
                const stats = getFileStats(newAttachment);
                const keyInfo = extractKeyInfo(newAttachment.extractedText || '');

                // Auto-analyze the document with extracted content
                const fileTypeLabel = newAttachment.type.toUpperCase();
                const analysisMessage: Message = {
                    id: generateId(),
                    content: `# ${fileTypeLabel} Analysis Complete

**Document**: ${newAttachment.name}
**Type**: ${fileTypeLabel}
**Pages**: ${stats.pages}
**Word Count**: ${stats.wordCount.toLocaleString()}
**Character Count**: ${stats.characterCount.toLocaleString()}
**Estimated Reading Time**: ${stats.readingTime} minutes

${keyInfo.emails.length > 0 ? `**Email Addresses Found**: ${keyInfo.emails.slice(0, 3).join(', ')}${keyInfo.emails.length > 3 ? '...' : ''}\n` : ''}${keyInfo.phones.length > 0 ? `**Phone Numbers Found**: ${keyInfo.phones.slice(0, 3).join(', ')}${keyInfo.phones.length > 3 ? '...' : ''}\n` : ''}${keyInfo.dates.length > 0 ? `**Dates Found**: ${keyInfo.dates.slice(0, 3).join(', ')}${keyInfo.dates.length > 3 ? '...' : ''}\n` : ''}
I have successfully extracted and analyzed the content from your ${fileTypeLabel} document. The text has been processed and I am now ready to answer questions, provide summaries, or discuss any specific aspects of the document.

## What would you like to know about this document?

Some suggestions:
- "Summarize the main points"
- "What are the key topics covered?"
- "Extract important dates or numbers"
- "What conclusions does the document reach?"`,
                    role: 'assistant',
                    timestamp: new Date(),
                };

                setMessages(prev => [...prev, analysisMessage]);

                // Add debug message in development
                if (import.meta.env.DEV) {
                    console.log('📄 File Processing Debug Info:', {
                        fileName: newAttachment.name,
                        fileSize: newAttachment.size,
                        extractedLength: newAttachment.extractedText?.length || 0,
                        pages: stats.pages,
                        wordCount: stats.wordCount,
                        keyInfo,
                        preview: newAttachment.extractedText?.slice(0, 500) + '...'
                    });
                }
            }

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to process file';
            setError(errorMessage);
            console.error('File upload error:', error);
        } finally {
            setIsLoading(false);
            setUploadProgress(0);
            setProcessingStatus('');
        }
    };

    const handleSendMessage = async () => {
        if ((!input.trim() && !attachment) || isLoading) return;

        const userMessage: Message = {
            id: generateId(),
            content: input.trim(),
            role: 'user',
            timestamp: new Date(),
            attachments: attachment ? [attachment] : [],
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);
        setError(null);

        try {
            const conversationHistory = messages.map(msg => ({
                role: msg.role,
                content: msg.content,
            }));

            let response: string;

            if (attachment && attachment.extractedText) {
                // Chat with document context
                console.log('🤖 Sending message with document context:', {
                    message: input.trim(),
                    documentLength: attachment.extractedText.length,
                    documentName: attachment.name
                });

                response = await chatWithContext(
                    input.trim(),
                    conversationHistory,
                    attachment.extractedText
                );
            } else if (input.trim()) {
                // Regular chat
                response = await chatWithContext(input.trim(), conversationHistory);
            } else {
                response = "I can see you have uploaded a document. Please ask me a question about its content.";
            }

            const aiMessage: Message = {
                id: generateId(),
                content: response,
                role: 'assistant',
                timestamp: new Date(),
            };

            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to process your request';
            setError(errorMessage);
            console.error('Chat error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const removeAttachment = () => {
        if (attachment) {
            cleanupFileResources(attachment);
            setAttachment(null);
        }
    };

    const removeComparisonAttachment = (id: string) => {
        setAttachments(prev => {
            const attachmentToRemove = prev.find(att => att.id === id);
            if (attachmentToRemove) {
                cleanupFileResources(attachmentToRemove);
            }
            return prev.filter(att => att.id !== id);
        });
    };

    const handleComparison = async () => {
        if (attachments.length < 2) return;

        try {
            setIsComparing(true);
            setError(null);

            const validation = validateDocumentsForComparison(attachments);
            if (!validation.valid) {
                throw new Error(validation.error);
            }

            const result = await compareDocuments(attachments, comparisonType);

            // Add comparison result message
            const comparisonMessage: Message = {
                id: generateId(),
                content: `# Document Comparison Results

## Comparison Type: ${comparisonType.charAt(0).toUpperCase() + comparisonType.slice(1).replace('-', ' ')}

${result.overallSimilarity !== undefined ? `**Overall Similarity**: ${result.overallSimilarity}%\n` : ''}

${result.summary ? `## Summary\n${result.summary}\n` : ''}

${result.detailedAnalysis ? `## Detailed Analysis\n${result.detailedAnalysis}` : ''}`,
                role: 'assistant',
                timestamp: new Date(),
            };

            setMessages(prev => [...prev, comparisonMessage]);

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to compare documents';
            setError(errorMessage);
            console.error('Comparison error:', error);
        } finally {
            setIsComparing(false);
        }
    };



    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="flex flex-col h-screen bg-vintage-white text-vintage-black">
            {/* Header - Clean and Professional */}
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
                                <div className="flex justify-center items-center w-10 h-10 rounded-lg bg-vintage-black shadow-vintage">
                                    <Brain className="w-6 h-6 text-vintage-white" />
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold font-display tracking-vintage">
                                        IntelliRead AI
                                    </h1>
                                    <p className="text-xs text-vintage-gray-500">
                                        AI-Powered Document Analysis
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            {import.meta.env.DEV && (
                                <button
                                    onClick={() => setShowDebug(!showDebug)}
                                    className="p-2 rounded-lg btn-ghost focus-vintage"
                                    title="Toggle debug info"
                                >
                                    <Bug className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Document Status Bar */}
            {attachment && (
                <div className="relative z-10 border-b border-vintage-gray-200 bg-vintage-gray-50">
                    <div className="px-4 py-3 mx-auto max-w-4xl sm:px-6">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-3">
                                <div className="flex justify-center items-center w-8 h-8 rounded-lg bg-vintage-black">
                                    <FileCheck className="w-4 h-4 text-vintage-white" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-vintage-black">
                                        {attachment.name}
                                    </p>
                                    <p className="text-xs text-vintage-gray-500">
                                        {attachment.extractedText?.length.toLocaleString()} characters • Ready for analysis
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => setShowComparison(true)}
                                    className="p-2 rounded-lg btn-ghost focus-vintage"
                                    title="Compare documents"
                                    disabled={attachments.length < 1}
                                >
                                    <FileText className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={removeAttachment}
                                    className="p-2 rounded-lg btn-ghost focus-vintage"
                                    title="Remove document"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Comparison Modal */}
            {showComparison && attachments.length >= 2 && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-vintage-gray-200">
                            <div className="flex justify-between items-center">
                                <h3 className="text-xl font-bold text-vintage-black">Compare Documents</h3>
                                <button
                                    onClick={() => setShowComparison(false)}
                                    className="p-2 rounded-lg hover:bg-vintage-gray-100"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Document List */}
                            <div>
                                <h4 className="font-semibold text-vintage-black mb-3">Documents to Compare:</h4>
                                <div className="space-y-2">
                                    {attachments.map((att, index) => (
                                        <div key={att.id} className="flex items-center justify-between bg-vintage-gray-50 rounded-lg p-3">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-8 h-8 bg-vintage-black rounded-lg flex items-center justify-center">
                                                    <span className="text-xs font-bold text-white">{index + 1}</span>
                                                </div>
                                                <div>
                                                    <p className="font-medium text-vintage-black">{att.name}</p>
                                                    <p className="text-sm text-vintage-gray-500">
                                                        {att.extractedText?.length.toLocaleString()} characters
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => removeComparisonAttachment(att.id)}
                                                className="p-1 rounded hover:bg-red-50"
                                            >
                                                <X className="w-4 h-4 text-red-500" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Comparison Type Selection */}
                            <div>
                                <h4 className="font-semibold text-vintage-black mb-3">Comparison Type:</h4>
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { value: 'similarity', label: 'Similarity Analysis', desc: 'Find similarities and differences' },
                                        { value: 'differences', label: 'Key Differences', desc: 'Highlight major differences' },
                                        { value: 'summary', label: 'Comparative Summary', desc: 'Summarize both documents' },
                                        { value: 'key-points', label: 'Key Points Comparison', desc: 'Compare main points' },
                                        { value: 'structure', label: 'Structure Analysis', desc: 'Compare organization' }
                                    ].map((type) => (
                                        <button
                                            key={type.value}
                                            onClick={() => setComparisonType(type.value as ComparisonType)}
                                            className={cn(
                                                "p-3 rounded-lg border-2 text-left transition-all",
                                                comparisonType === type.value
                                                    ? "border-vintage-black bg-vintage-black text-white"
                                                    : "border-vintage-gray-200 hover:border-vintage-gray-300"
                                            )}
                                        >
                                            <div className="font-medium text-sm">{type.label}</div>
                                            <div className={cn(
                                                "text-xs mt-1",
                                                comparisonType === type.value ? "text-white/80" : "text-vintage-gray-500"
                                            )}>
                                                {type.desc}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-end space-x-3 pt-4 border-t border-vintage-gray-200">
                                <button
                                    onClick={() => setShowComparison(false)}
                                    className="px-4 py-2 text-vintage-gray-600 hover:text-vintage-gray-800"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleComparison}
                                    disabled={isComparing}
                                    className="px-6 py-2 bg-vintage-black text-white rounded-lg hover:bg-vintage-black/90 disabled:opacity-50 flex items-center space-x-2"
                                >
                                    {isComparing ? (
                                        <>
                                            <div className="spinner-vintage w-4 h-4" />
                                            <span>Comparing...</span>
                                        </>
                                    ) : (
                                        <>
                                            <FileText className="w-4 h-4" />
                                            <span>Compare Documents</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Comparison Documents Bar */}
            {attachments.length > 0 && (
                <div className="relative z-10 border-b border-vintage-gray-200 bg-blue-50">
                    <div className="px-4 py-3 mx-auto max-w-4xl sm:px-6">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-3">
                                <div className="flex justify-center items-center w-8 h-8 rounded-lg bg-blue-600">
                                    <FileText className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-vintage-black">
                                        Comparison Mode ({attachments.length} documents)
                                    </p>
                                    <p className="text-xs text-vintage-gray-500">
                                        Ready to compare documents
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                {attachments.map((att, index) => (
                                    <div key={att.id} className="flex items-center space-x-2 bg-white rounded-lg px-3 py-1 border">
                                        <span className="text-xs font-medium">Doc {index + 1}:</span>
                                        <span className="text-xs text-vintage-gray-600 max-w-24 truncate">{att.name}</span>
                                        <button
                                            onClick={() => removeComparisonAttachment(att.id)}
                                            className="p-1 rounded hover:bg-red-50"
                                            title="Remove from comparison"
                                        >
                                            <X className="w-3 h-3 text-red-500" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}


            {/* Debug Panel */}
            {import.meta.env.DEV && showDebug && attachment && (
                <div className="relative z-10 px-4 py-4 border-b border-vintage-gray-300 bg-vintage-gray-50 sm:px-6">
                    <div className="mx-auto max-w-4xl">
                        <h3 className="flex items-center mb-3 text-sm font-bold font-display">
                            <Bug className="mr-2 w-4 h-4" />
                            Debug Information
                        </h3>
                        <div className="grid grid-cols-2 gap-4 font-mono text-xs sm:grid-cols-4">
                            <div>
                                <span className="text-vintage-gray-500">File Size:</span>
                                <div className="font-medium">{(attachment.size / 1024 / 1024).toFixed(2)} MB</div>
                            </div>
                            <div>
                                <span className="text-vintage-gray-500">Text Length:</span>
                                <div className="font-medium">{attachment.extractedText?.length.toLocaleString()} chars</div>
                            </div>
                            <div>
                                <span className="text-vintage-gray-500">Words:</span>
                                <div className="font-medium">{getFileStats(attachment).wordCount.toLocaleString()}</div>
                            </div>
                            <div>
                                <span className="text-vintage-gray-500">Pages:</span>
                                <div className="font-medium">{getFileStats(attachment).pages}</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content Area */}
            <div className="flex overflow-hidden flex-col flex-1">
                {/* Messages Container */}
                <div className="overflow-y-auto flex-1 scrollbar-thin">
                    <div className="px-4 py-6 mx-auto max-w-4xl sm:px-6">
                        {messages.length === 0 && !attachment && (
                            <div className="flex justify-center items-center h-full">
                                <div className="mx-auto max-w-lg text-center">
                                    <div className="flex justify-center items-center mx-auto mb-8 w-20 h-20 rounded-2xl bg-vintage-black shadow-vintage-lg">
                                        <Brain className="w-10 h-10 text-vintage-white" />
                                    </div>
                                    <h2 className="mb-4 text-2xl font-bold font-display text-vintage-black">
                                        Welcome to IntelliRead AI
                                    </h2>
                                    <p className="mb-8 leading-relaxed text-vintage-gray-600">
                                        Upload documents to analyze and chat with your content using advanced AI, or compare multiple documents for insights.
                                    </p>

                                    {/* Upload Area */}
                                    <div className="max-w-md mx-auto">
                                        <div className="p-6 rounded-xl border-2 border-dashed transition-colors border-vintage-gray-300 hover:border-vintage-gray-400">
                                            <div className="text-center">
                                                <FileText className="mx-auto mb-3 w-10 h-10 text-vintage-gray-400" />
                                                <h3 className="text-lg font-semibold text-vintage-black mb-2">Analyze Document</h3>
                                                <p className="text-sm text-vintage-gray-500 mb-4">
                                                    Upload a document to chat and ask questions
                                                </p>
                                                <button
                                                    onClick={() => fileInputRef.current?.click()}
                                                    className="px-4 py-2 text-sm btn-primary"
                                                    >
                                                    Choose Document
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <p className="text-sm text-vintage-gray-500 text-center mt-4">
                                        Supports PDF, Word (.docx), PowerPoint (.pptx), and text files
                                    </p>

                                    {/* Quick Actions */}
                                    <div className="grid grid-cols-1 gap-4 mt-8 sm:grid-cols-3">
                                        <div className="text-center card-compact">
                                            <MessageSquare className="mx-auto mb-2 w-6 h-6 text-vintage-gray-600" />
                                            <p className="text-sm font-medium text-vintage-black">Ask Questions</p>
                                            <p className="text-xs text-vintage-gray-500">Natural language queries</p>
                                        </div>
                                        <div className="text-center card-compact">
                                            <Zap className="mx-auto mb-2 w-6 h-6 text-vintage-gray-600" />
                                            <p className="text-sm font-medium text-vintage-black">Get Summaries</p>
                                            <p className="text-xs text-vintage-gray-500">Instant insights</p>
                                        </div>
                                        <div className="text-center card-compact">
                                            <Clock className="mx-auto mb-2 w-6 h-6 text-vintage-gray-600" />
                                            <p className="text-sm font-medium text-vintage-black">Save Time</p>
                                            <p className="text-xs text-vintage-gray-500">Fast analysis</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {(messages.length > 0 || attachment) && (
                            <div className="space-y-6">
                                {messages.map((message, index) => (
                                    <div
                                        key={message.id}
                                        className={cn(
                                            "flex items-start space-x-4 animate-slide-up",
                                            message.role === 'user' ? "justify-end" : "justify-start"
                                        )}
                                        style={{ animationDelay: `${index * 100}ms` }}
                                    >
                                        {message.role === 'assistant' && (
                                            <div className="flex flex-shrink-0 justify-center items-center w-10 h-10 rounded-xl bg-vintage-black shadow-vintage">
                                                <Brain className="w-5 h-5 text-vintage-white" />
                                            </div>
                                        )}

                                        <div
                                            className={cn(
                                                "max-w-2xl p-5 shadow-vintage-lg transition-all duration-300 hover:shadow-vintage-xl rounded-2xl",
                                                message.role === 'user'
                                                    ? "bg-vintage-black text-vintage-white ml-auto rounded-br-lg"
                                                    : "bg-vintage-white border border-vintage-gray-200 rounded-bl-lg"
                                            )}
                                        >
                                            <div className={cn(
                                                "font-sans leading-relaxed prose prose-vintage max-w-none text-sm",
                                                message.role === 'user'
                                                    ? "text-vintage-white"
                                                    : "text-vintage-black"
                                            )}>
                                                {message.role === 'assistant' ? (
                                                    <div dangerouslySetInnerHTML={{ __html: parseMarkdown(message.content) }} />
                                                ) : (
                                                    message.content.split('\n').map((line, i) => (
                                                        <p key={i} className={i > 0 ? "mt-3" : ""}>
                                                            {line}
                                                        </p>
                                                    ))
                                                )}
                                            </div>

                                            {message.attachments && message.attachments.length > 0 && (
                                                <div className={cn(
                                                    "mt-4 pt-4 border-t",
                                                    message.role === 'user'
                                                        ? "border-vintage-white/20"
                                                        : "border-vintage-gray-200"
                                                )}>
                                                    {message.attachments.map((att) => (
                                                        <div key={att.id} className="flex items-center space-x-2 font-mono text-xs">
                                                            <FileText className="w-4 h-4" />
                                                            <span>{att.name}</span>
                                                            <span className="text-vintage-gray-500">
                                                                ({att.extractedText?.length.toLocaleString()} chars)
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            <div className={cn(
                                                "text-xs mt-4 font-mono uppercase tracking-wide",
                                                message.role === 'user'
                                                    ? "text-vintage-white/60"
                                                    : "text-vintage-gray-400"
                                            )}>
                                                {formatRelativeTime(message.timestamp)}
                                            </div>
                                        </div>

                                        {message.role === 'user' && (
                                            <div className="flex flex-shrink-0 justify-center items-center w-10 h-10 rounded-xl border border-vintage-gray-300 bg-vintage-white shadow-vintage">
                                                <User className="w-5 h-5 text-vintage-black" />
                                            </div>
                                        )}
                                    </div>
                                ))}

                                {isLoading && (
                                    <div className="flex items-start space-x-4 animate-slide-up">
                                        <div className="flex justify-center items-center w-10 h-10 rounded-xl bg-vintage-black shadow-vintage">
                                            <Brain className="w-5 h-5 text-vintage-white" />
                                        </div>
                                        <div className="p-5 rounded-2xl rounded-bl-lg border bg-vintage-white border-vintage-gray-200 shadow-vintage-lg">
                                            <div className="flex items-center space-x-3">
                                                <div className="spinner-vintage" />
                                                <span className="font-mono text-sm text-vintage-gray-600">
                                                    {processingStatus || 'Thinking...'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div ref={messagesEndRef} />
                            </div>
                        )}
                    </div>
                </div>

                {/* Error Display */}
                {error && (
                    <div className="px-4 py-4 border-t border-vintage-gray-200 bg-vintage-gray-50 sm:px-6">
                        <div className="mx-auto max-w-4xl">
                            <div className="flex items-center p-4 space-x-3 bg-red-50 rounded-lg border border-red-200">
                                <AlertCircle className="flex-shrink-0 w-5 h-5 text-red-600" />
                                <span className="flex-1 text-sm text-red-800">{error}</span>
                                <button
                                    onClick={() => setError(null)}
                                    className="p-1 text-red-600 hover:text-red-800"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Upload Progress */}
                {uploadProgress > 0 && uploadProgress < 100 && (
                    <div className="px-4 py-4 border-t border-vintage-gray-200 bg-vintage-gray-50 sm:px-6">
                        <div className="mx-auto max-w-4xl">
                            <div className="p-4 rounded-lg border bg-vintage-white border-vintage-gray-200">
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-sm font-medium text-vintage-black">
                                        {processingStatus || 'Processing...'}
                                    </span>
                                    <span className="font-mono text-sm text-vintage-gray-500">
                                        {uploadProgress}%
                                    </span>
                                </div>
                                <div className="overflow-hidden h-2 rounded-full bg-vintage-gray-200">
                                    <div
                                        className="h-full rounded-full transition-all duration-300 bg-vintage-black"
                                        style={{ width: `${uploadProgress}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}


                {/* Input Area */}
                <div className="border-t border-vintage-gray-200 bg-vintage-white">
                    <div className="px-4 py-4 mx-auto max-w-4xl sm:px-6">
                        <div className="flex items-end space-x-3">
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".pdf,.docx,.pptx,.txt"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleFileUpload(file);
                                }}
                                className="hidden"
                            />

                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="flex-shrink-0 p-3 rounded-lg btn-ghost focus-vintage"
                                title="Upload Document (PDF, Word, PowerPoint, Text)"
                                disabled={isLoading}
                            >
                                <Paperclip className="w-5 h-5" />
                            </button>

                            <button
                                onClick={() => {
                                    const input = document.createElement('input');
                                    input.type = 'file';
                                    input.accept = '.pdf,.docx,.pptx,.txt';
                                    input.multiple = true;
                                    input.onchange = (e) => {
                                        const files = (e.target as HTMLInputElement).files;
                                        if (files) {
                                            Array.from(files).forEach(file => handleFileUpload(file, true));
                                        }
                                    };
                                    input.click();
                                }}
                                className="flex-shrink-0 p-3 rounded-lg btn-ghost focus-vintage"
                                title="Upload Multiple Documents for Comparison"
                                disabled={isLoading}
                            >
                                <Upload className="w-5 h-5" />
                            </button>

                            <div className="relative flex-1">
                                <textarea
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder={attachment ? "Ask about your document..." : "Upload a document or ask anything..."}
                                    className="px-4 py-3 w-full text-sm rounded-xl border transition-all duration-200 resize-none border-vintage-gray-300 bg-vintage-white text-vintage-black placeholder-vintage-gray-500 focus:outline-none focus:ring-2 focus:ring-vintage-gray-400 focus:border-vintage-gray-400"
                                    disabled={isLoading}
                                    rows={1}
                                    style={{ minHeight: '48px', maxHeight: '120px' }}
                                />
                            </div>

                            <button
                                onClick={handleSendMessage}
                                disabled={(!input.trim() && !attachment) || isLoading}
                                className="flex-shrink-0 p-3 rounded-lg btn-primary disabled:opacity-50 disabled:cursor-not-allowed focus-vintage"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chat; 