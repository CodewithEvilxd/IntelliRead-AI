import { pgTable, text, timestamp, uuid, jsonb, integer, boolean } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Users table (linked to Clerk users)
export const users = pgTable('users', {
  id: text('id').primaryKey(), // Clerk user ID
  email: text('email').notNull(),
  name: text('name'),
  avatar: text('avatar'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Chat sessions table
export const chatSessions = pgTable('chat_sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').references(() => users.id).notNull(),
  title: text('title').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Messages table
export const messages = pgTable('messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  sessionId: uuid('session_id').references(() => chatSessions.id).notNull(),
  role: text('role').notNull(), // 'user' or 'assistant'
  content: text('content').notNull(),
  attachments: jsonb('attachments'), // Store attachment metadata
  timestamp: timestamp('timestamp').defaultNow().notNull(),
});

// Search history table
export const searchHistory = pgTable('search_history', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').references(() => users.id).notNull(),
  query: text('query').notNull(),
  documentName: text('document_name'),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
});

// Community feature tables

// Subjects/Categories for questions
export const subjects = pgTable('subjects', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull().unique(),
  description: text('description'),
  color: text('color').default('#3B82F6'), // Default blue color
  icon: text('icon').default('📚'), // Default book icon
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Questions table
export const questions = pgTable('questions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').references(() => users.id).notNull(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  subjectId: uuid('subject_id').references(() => subjects.id),
  images: jsonb('images'), // Array of image URLs/paths
  hashtags: jsonb('hashtags'), // Array of hashtag strings
  upvotes: text('upvotes').array().default([]), // Array of user IDs who upvoted
  downvotes: text('downvotes').array().default([]), // Array of user IDs who downvoted
  answerCount: integer('answer_count').default(0), // Number of answers
  isAnswered: boolean('is_answered').default(false), // Whether question has accepted answer
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Answers table
export const answers = pgTable('answers', {
  id: uuid('id').primaryKey().defaultRandom(),
  questionId: uuid('question_id').references(() => questions.id).notNull(),
  userId: text('user_id').references(() => users.id).notNull(),
  content: text('content').notNull(),
  images: jsonb('images'), // Array of image URLs/paths
  upvotes: text('upvotes').array().default([]), // Array of user IDs who upvoted
  downvotes: text('downvotes').array().default([]), // Array of user IDs who downvoted
  isAccepted: boolean('is_accepted').default(false), // Whether this is the accepted answer
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Question votes table (for more detailed voting history)
export const questionVotes = pgTable('question_votes', {
  id: uuid('id').primaryKey().defaultRandom(),
  questionId: uuid('question_id').references(() => questions.id).notNull(),
  userId: text('user_id').references(() => users.id).notNull(),
  voteType: text('vote_type').notNull(), // 'upvote' or 'downvote'
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Answer votes table (for more detailed voting history)
export const answerVotes = pgTable('answer_votes', {
  id: uuid('id').primaryKey().defaultRandom(),
  answerId: uuid('answer_id').references(() => answers.id).notNull(),
  userId: text('user_id').references(() => users.id).notNull(),
  voteType: text('vote_type').notNull(), // 'upvote' or 'downvote'
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  chatSessions: many(chatSessions),
  searchHistory: many(searchHistory),
}));

export const chatSessionsRelations = relations(chatSessions, ({ one, many }) => ({
  user: one(users, {
    fields: [chatSessions.userId],
    references: [users.id],
  }),
  messages: many(messages),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  session: one(chatSessions, {
    fields: [messages.sessionId],
    references: [chatSessions.id],
  }),
}));

export const searchHistoryRelations = relations(searchHistory, ({ one }) => ({
  user: one(users, {
    fields: [searchHistory.userId],
    references: [users.id],
  }),
}));

// Community relations
export const subjectsRelations = relations(subjects, ({ many }) => ({
  questions: many(questions),
}));

export const questionsRelations = relations(questions, ({ one, many }) => ({
  user: one(users, {
    fields: [questions.userId],
    references: [users.id],
  }),
  subject: one(subjects, {
    fields: [questions.subjectId],
    references: [subjects.id],
  }),
  answers: many(answers),
  votes: many(questionVotes),
}));

export const answersRelations = relations(answers, ({ one, many }) => ({
  question: one(questions, {
    fields: [answers.questionId],
    references: [questions.id],
  }),
  user: one(users, {
    fields: [answers.userId],
    references: [users.id],
  }),
  votes: many(answerVotes),
}));

export const questionVotesRelations = relations(questionVotes, ({ one }) => ({
  question: one(questions, {
    fields: [questionVotes.questionId],
    references: [questions.id],
  }),
  user: one(users, {
    fields: [questionVotes.userId],
    references: [users.id],
  }),
}));

export const answerVotesRelations = relations(answerVotes, ({ one }) => ({
  answer: one(answers, {
    fields: [answerVotes.answerId],
    references: [answers.id],
  }),
  user: one(users, {
    fields: [answerVotes.userId],
    references: [users.id],
  }),
}));

// Types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type ChatSession = typeof chatSessions.$inferSelect;
export type NewChatSession = typeof chatSessions.$inferInsert;

export type Message = typeof messages.$inferSelect;
export type NewMessage = typeof messages.$inferInsert;

export type SearchHistory = typeof searchHistory.$inferSelect;
export type NewSearchHistory = typeof searchHistory.$inferInsert;

// Community types
export type Subject = typeof subjects.$inferSelect;
export type NewSubject = typeof subjects.$inferInsert;

export type Question = typeof questions.$inferSelect;
export type NewQuestion = typeof questions.$inferInsert;

export type Answer = typeof answers.$inferSelect;
export type NewAnswer = typeof answers.$inferInsert;

export type QuestionVote = typeof questionVotes.$inferSelect;
export type NewQuestionVote = typeof questionVotes.$inferInsert;

export type AnswerVote = typeof answerVotes.$inferSelect;
export type NewAnswerVote = typeof answerVotes.$inferInsert;