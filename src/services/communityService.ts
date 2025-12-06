// Community service for handling questions, answers, and votes
// Using mock data for now - can be replaced with real database calls later

import type {
  Question,
  Answer,
  Subject,
  CreateQuestionData,
  CreateAnswerData,
  QuestionFilters,
  QuestionsResponse,
  QuestionDetailResponse
} from '@/types/community';

// Mock data for development - subjects only (questions and answers will be empty initially)
const mockSubjects: Subject[] = [
  { id: '1', name: 'Mathematics', description: 'Math questions and problems', color: '#3B82F6', icon: '🔢', createdAt: new Date() },
  { id: '2', name: 'Science', description: 'Physics, Chemistry, Biology', color: '#10B981', icon: '🧪', createdAt: new Date() },
  { id: '3', name: 'Programming', description: 'Coding and development', color: '#F59E0B', icon: '💻', createdAt: new Date() },
  { id: '4', name: 'English', description: 'Language and literature', color: '#EF4444', icon: '📚', createdAt: new Date() },
  { id: '5', name: 'History', description: 'Historical questions', color: '#8B5CF6', icon: '🏛️', createdAt: new Date() },
];

// Empty arrays for real data (will be populated by users)
const mockQuestions: Question[] = [];
const mockAnswers: Answer[] = [];

// Subject operations
export async function getSubjects(): Promise<Subject[]> {
  return mockSubjects;
}

export async function createSubject(data: { name: string; description?: string; color?: string; icon?: string }): Promise<Subject> {
  const newSubject: Subject = {
    id: Date.now().toString(),
    name: data.name,
    description: data.description || 'General subject category',
    color: data.color || '#3B82F6',
    icon: data.icon || '📚',
    createdAt: new Date(),
  };
  mockSubjects.push(newSubject);
  return newSubject;
}

// Question operations
export async function getQuestions(filters: QuestionFilters = {}): Promise<QuestionsResponse> {
  let filteredQuestions = [...mockQuestions];

  // Apply filters
  if (filters.subject) {
    filteredQuestions = filteredQuestions.filter(q => q.subjectId === filters.subject);
  }

  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filteredQuestions = filteredQuestions.filter(q =>
      q.title.toLowerCase().includes(searchLower) ||
      q.content.toLowerCase().includes(searchLower)
    );
  }

  // Apply sorting
  switch (filters.sortBy) {
    case 'newest':
      filteredQuestions.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      break;
    case 'oldest':
      filteredQuestions.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
      break;
    case 'most-voted':
      filteredQuestions.sort((a, b) => (b.upvotes.length - b.downvotes.length) - (a.upvotes.length - a.downvotes.length));
      break;
    case 'unanswered':
      filteredQuestions.sort((a, b) => Number(a.isAnswered) - Number(b.isAnswered));
      break;
  }

  // Apply pagination
  const page = filters.page || 1;
  const limit = filters.limit || 20;
  const offset = (page - 1) * limit;
  const paginatedQuestions = filteredQuestions.slice(offset, offset + limit);

  return {
    questions: paginatedQuestions,
    totalCount: filteredQuestions.length,
    hasMore: offset + limit < filteredQuestions.length,
  };
}

export async function getQuestionById(id: string): Promise<Question | null> {
  return mockQuestions.find(q => q.id === id) || null;
}

export async function createQuestion(userId: string, data: CreateQuestionData): Promise<Question> {
  const subjectId = data.subjectId || '1';
  const subject = mockSubjects.find(s => s.id === subjectId) || mockSubjects[0];

  const newQuestion: Question = {
    id: Date.now().toString(),
    userId,
    title: data.title,
    content: data.content,
    subjectId,
    hashtags: data.hashtags || [],
    upvotes: [],
    downvotes: [],
    answerCount: 0,
    isAnswered: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    user: { id: userId, name: 'Current User' },
    subject: subject!,
  };

  mockQuestions.push(newQuestion);
  return newQuestion;
}

export async function deleteQuestion(id: string, userId: string): Promise<boolean> {
  const index = mockQuestions.findIndex(q => q.id === id && q.userId === userId);
  if (index === -1) return false;

  mockQuestions.splice(index, 1);
  return true;
}

// Answer operations
export async function getAnswersForQuestion(questionId: string): Promise<Answer[]> {
  return mockAnswers
    .filter(a => a.questionId === questionId)
    .sort((a, b) => (b.upvotes.length - b.downvotes.length) - (a.upvotes.length - a.downvotes.length));
}

export async function createAnswer(userId: string, data: CreateAnswerData): Promise<Answer> {
  const newAnswer: Answer = {
    id: Date.now().toString(),
    questionId: data.questionId,
    userId,
    content: data.content,
    upvotes: [],
    downvotes: [],
    isAccepted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    user: { id: userId, name: 'Current User' },
  };

  mockAnswers.push(newAnswer);

  // Update answer count on question
  const question = mockQuestions.find(q => q.id === data.questionId);
  if (question) {
    question.answerCount++;
  }

  return newAnswer;
}

export async function acceptAnswer(answerId: string): Promise<boolean> {
  const answer = mockAnswers.find(a => a.id === answerId);
  if (!answer) return false;

  // Unaccept other answers for this question
  mockAnswers.forEach(a => {
    if (a.questionId === answer.questionId) {
      a.isAccepted = false;
    }
  });

  // Accept this answer
  answer.isAccepted = true;

  // Mark question as answered
  const question = mockQuestions.find(q => q.id === answer.questionId);
  if (question) {
    question.isAnswered = true;
  }

  return true;
}

// Voting operations
export async function voteOnQuestion(userId: string, questionId: string, voteType: 'upvote' | 'downvote'): Promise<boolean> {
  const question = mockQuestions.find(q => q.id === questionId);
  if (!question) return false;

  // Remove existing votes
  question.upvotes = question.upvotes.filter(id => id !== userId);
  question.downvotes = question.downvotes.filter(id => id !== userId);

  // Add new vote
  if (voteType === 'upvote') {
    question.upvotes.push(userId);
  } else {
    question.downvotes.push(userId);
  }

  return true;
}

export async function voteOnAnswer(userId: string, answerId: string, voteType: 'upvote' | 'downvote'): Promise<boolean> {
  const answer = mockAnswers.find(a => a.id === answerId);
  if (!answer) return false;

  // Remove existing votes
  answer.upvotes = answer.upvotes.filter(id => id !== userId);
  answer.downvotes = answer.downvotes.filter(id => id !== userId);

  // Add new vote
  if (voteType === 'upvote') {
    answer.upvotes.push(userId);
  } else {
    answer.downvotes.push(userId);
  }

  return true;
}

// Get question with answers
export async function getQuestionDetail(id: string): Promise<QuestionDetailResponse | null> {
  const question = await getQuestionById(id);
  if (!question) return null;

  const answers = await getAnswersForQuestion(id);

  return {
    question,
    answers,
  };
}

// Statistics
export async function getCommunityStats() {
  return {
    totalQuestions: mockQuestions.length,
    totalAnswers: mockAnswers.length,
    totalUsers: 0,
    questionsToday: 0,
    answersToday: 0,
    activeUsersToday: 0,
  };
}