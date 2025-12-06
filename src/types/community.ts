// Community feature types

export interface Subject {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  createdAt: Date;
}

export interface Question {
  id: string;
  userId: string;
  title: string;
  content: string;
  subjectId: string;
  images?: string[];
  hashtags: string[];
  upvotes: string[]; // Array of user IDs
  downvotes: string[]; // Array of user IDs
  answerCount: number;
  isAnswered: boolean;
  createdAt: Date;
  updatedAt: Date;

  // Populated fields
  user: {
    id: string;
    name?: string;
    avatar?: string;
  };
  subject: Subject;
  answers?: Answer[];
}

export interface Answer {
  id: string;
  questionId: string;
  userId: string;
  content: string;
  images?: string[];
  upvotes: string[]; // Array of user IDs
  downvotes: string[]; // Array of user IDs
  isAccepted: boolean;
  createdAt: Date;
  updatedAt: Date;

  // Populated fields
  user?: {
    id: string;
    name?: string;
    avatar?: string;
  };
  question?: Question;
}

export interface Vote {
  id: string;
  userId: string;
  targetId: string; // question or answer ID
  targetType: 'question' | 'answer';
  voteType: 'upvote' | 'downvote';
  createdAt: Date;
}

export interface QuestionFilters {
  subject?: string;
  search?: string;
  sortBy?: 'newest' | 'oldest' | 'most-voted' | 'unanswered';
  page?: number;
  limit?: number;
}

export interface CreateQuestionData {
  title: string;
  content: string;
  subjectId?: string;
  images?: File[];
  hashtags?: string[];
}

export interface CreateAnswerData {
  questionId: string;
  content: string;
  images?: File[];
}

export interface VoteData {
  targetId: string;
  targetType: 'question' | 'answer';
  voteType: 'upvote' | 'downvote';
}

// UI State types
export interface QuestionListState {
  questions: Question[];
  loading: boolean;
  error: string | null;
  filters: QuestionFilters;
  hasMore: boolean;
  totalCount: number;
}

export interface QuestionDetailState {
  question: Question | null;
  answers: Answer[];
  loading: boolean;
  error: string | null;
  voting: Record<string, boolean>; // targetId -> loading state
}

// API Response types
export interface QuestionsResponse {
  questions: Question[];
  totalCount: number;
  hasMore: boolean;
}

export interface QuestionDetailResponse {
  question: Question;
  answers: Answer[];
}

// Form validation types
export interface QuestionFormErrors {
  title?: string;
  content?: string;
  subjectId?: string;
  images?: string;
  hashtags?: string;
}

export interface AnswerFormErrors {
  content?: string;
  images?: string;
}

// Statistics types
export interface CommunityStats {
  totalQuestions: number;
  totalAnswers: number;
  totalUsers: number;
  questionsToday: number;
  answersToday: number;
  activeUsersToday: number;
}

// Notification types
export interface CommunityNotification {
  id: string;
  userId: string;
  type: 'answer' | 'vote' | 'accepted' | 'mention';
  title: string;
  message: string;
  targetId: string; // question or answer ID
  isRead: boolean;
  createdAt: Date;
}