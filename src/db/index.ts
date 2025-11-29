import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { eq, desc } from 'drizzle-orm';
import * as schema from './schema';
import type { Attachment } from '../types';

// Create the connection only if DATABASE_URL is available
let sql: ReturnType<typeof neon> | null = null;
let db: ReturnType<typeof drizzle> | null = null;

if (import.meta.env.DATABASE_URL) {
  sql = neon(import.meta.env.DATABASE_URL);
  db = drizzle(sql, { schema });
} else {
  console.warn('DATABASE_URL not found, database features disabled');
}

export { db };

// Helper function to check if database is available
function isDatabaseAvailable(): boolean {
  return db !== null;
}

// Helper function to ensure user exists in our database
export async function ensureUser(userId: string, email: string, name?: string, avatar?: string) {
  if (!isDatabaseAvailable()) {
    console.warn('Database not available, skipping user creation');
    return;
  }

  try {
    const existingUser = await db!.select().from(schema.users).where(eq(schema.users.id, userId)).limit(1);

    if (existingUser.length === 0) {
      await db!.insert(schema.users).values({
        id: userId,
        email,
        name,
        avatar,
      });
    }
  } catch (error) {
    console.error('Error ensuring user exists:', error);
  }
}

// Helper functions for chat operations
export async function createChatSession(userId: string, title: string) {
  if (!isDatabaseAvailable()) {
    console.warn('Database not available, skipping chat session creation');
    return null;
  }

  const result = await db!.insert(schema.chatSessions).values({
    userId,
    title,
  }).returning();

  return result[0];
}

export async function saveMessage(sessionId: string, role: string, content: string, attachments?: Attachment[]) {
  if (!isDatabaseAvailable()) {
    console.warn('Database not available, skipping message save');
    return null;
  }

  const result = await db!.insert(schema.messages).values({
    sessionId,
    role,
    content,
    attachments,
  }).returning();

  return result[0];
}

export async function getChatHistory(userId: string, limit = 50) {
  if (!isDatabaseAvailable()) {
    console.warn('Database not available, returning empty chat history');
    return [];
  }

  return await db!
    .select()
    .from(schema.chatSessions)
    .where(eq(schema.chatSessions.userId, userId))
    .orderBy(desc(schema.chatSessions.updatedAt))
    .limit(limit);
}

export async function getMessagesForSession(sessionId: string) {
  if (!isDatabaseAvailable()) {
    console.warn('Database not available, returning empty messages');
    return [];
  }

  return await db!
    .select()
    .from(schema.messages)
    .where(eq(schema.messages.sessionId, sessionId))
    .orderBy(schema.messages.timestamp);
}

export async function saveSearchHistory(userId: string, query: string, documentName?: string) {
  if (!isDatabaseAvailable()) {
    console.warn('Database not available, skipping search history save');
    return null;
  }

  return await db!.insert(schema.searchHistory).values({
    userId,
    query,
    documentName,
  }).returning();
}

export async function getSearchHistory(userId: string, limit = 100) {
  if (!isDatabaseAvailable()) {
    console.warn('Database not available, returning empty search history');
    return [];
  }

  return await db!
    .select()
    .from(schema.searchHistory)
    .where(eq(schema.searchHistory.userId, userId))
    .orderBy(desc(schema.searchHistory.timestamp))
    .limit(limit);
}