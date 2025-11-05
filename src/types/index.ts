// Core message types
export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  attachments?: Attachment[];
}

// Attachment types for file uploads
export interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  extractedText?: string;
  metadata?: AttachmentMetadata;
}

export interface AttachmentMetadata {
  title?: string;
  author?: string;
  subject?: string;
  creator?: string;
  producer?: string;
  creationDate?: Date | string | null;
  keywords?: string;
  pageCount?: number;
}

// Chat session types
export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  systemPrompt?: string;
}

// API types
export interface APIResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Groq API types
export interface GroqMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface GroqChatCompletion {
  id: string;
  object: 'chat.completion';
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: 'assistant';
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

// Chat types
export interface ChatContext {
  messages: Message[];
  currentAttachment?: Attachment;
  isLoading: boolean;
  error?: string | null;
}

// UI state types
export interface UIState {
  isLoading: boolean;
  error?: string | null;
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
}

// Error types
export interface APIError {
  message: string;
  code?: string;
  details?: unknown;
}

// User types for future auth implementation
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  plan: 'free' | 'pro' | 'enterprise';
  createdAt: Date;
}

// Component props types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface ButtonProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
}

// Hook return types
export interface UseAPIReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// File processing types
export interface FileProcessingResult {
  text: string;
  pageCount: number;
  metadata?: {
    title?: string;
    author?: string;
    subject?: string;
    creator?: string;
    producer?: string;
    creationDate?: Date | string | null;
    keywords?: string;
    [key: string]: unknown;
  };
}

export interface FileStats {
  wordCount: number;
  characterCount: number;
  readingTime: number;
  pages: number;
}

export interface FileKeyInfo {
  emails: string[];
  phones: string[];
  urls: string[];
  dates: string[];
}


// Document comparison types
export interface DocumentComparison {
  id: string;
  documents: Attachment[];
  comparisonType: ComparisonType;
  results: ComparisonResult;
  createdAt: Date;
}

export type ComparisonType =
  | 'similarity'
  | 'differences'
  | 'summary'
  | 'key-points'
  | 'structure';

export interface ComparisonResult {
  overallSimilarity?: number; // 0-100 percentage
  keyDifferences?: string[];
  commonThemes?: string[];
  uniquePoints?: {
    document1: string[];
    document2: string[];
  };
  summary?: string;
  recommendations?: string[];
  detailedAnalysis?: string;
}

export interface ComparisonRequest {
  documents: Attachment[];
  type: ComparisonType;
  customPrompt?: string;
}

// Legacy PDF types (for backward compatibility)
export type PDFProcessingResult = FileProcessingResult;
export type PDFStats = FileStats;
export type PDFKeyInfo = FileKeyInfo;