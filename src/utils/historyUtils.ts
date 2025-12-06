import type { Attachment } from '../types';

export interface HistoryItem {
  id: string;
  type: 'pdf' | 'youtube';
  title: string;
  timestamp: Date;
  messageCount: number;
  lastMessage: string;
  videoUrl?: string;
  documentName?: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  attachments?: Attachment[];
}

export interface ChatSession {
  id: string;
  type: 'pdf' | 'youtube';
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
  videoUrl?: string;
  documentName?: string;
}

// Save a chat session to localStorage
export const saveChatSession = (session: ChatSession): void => {
  try {
    localStorage.setItem(`session_${session.id}`, JSON.stringify(session));

    // Update history index
    const history = getChatHistory();
    const existingIndex = history.findIndex(item => item.id === session.id);

    const historyItem: HistoryItem = {
      id: session.id,
      type: session.type,
      title: session.title,
      timestamp: session.updatedAt,
      messageCount: session.messages.length,
      lastMessage: session.messages[session.messages.length - 1]?.content || '',
      ...(session.videoUrl && { videoUrl: session.videoUrl }),
      ...(session.documentName && { documentName: session.documentName })
    };

    if (existingIndex >= 0) {
      history[existingIndex] = historyItem;
    } else {
      history.push(historyItem);
    }

    localStorage.setItem('chatHistory', JSON.stringify(history));
  } catch (error) {
    console.error('Failed to save chat session:', error);
  }
};

// Get all chat history
export const getChatHistory = (): HistoryItem[] => {
  try {
    const saved = localStorage.getItem('chatHistory');
    if (!saved) return [];

    const parsed = JSON.parse(saved) as Array<Omit<HistoryItem, 'timestamp'> & { timestamp: string }>;
    return parsed.map((item) => ({
      ...item,
      timestamp: new Date(item.timestamp)
    }));
  } catch (error) {
    console.error('Failed to load chat history:', error);
    return [];
  }
};

// Get a specific chat session
export const getChatSession = (sessionId: string): ChatSession | null => {
  try {
    const saved = localStorage.getItem(`session_${sessionId}`);
    if (!saved) return null;

    const parsed = JSON.parse(saved) as Omit<ChatSession, 'createdAt' | 'updatedAt' | 'messages'> & {
      createdAt: string;
      updatedAt: string;
      messages: Array<Omit<ChatMessage, 'timestamp'> & { timestamp: string }>;
    };
    return {
      ...parsed,
      createdAt: new Date(parsed.createdAt),
      updatedAt: new Date(parsed.updatedAt),
      messages: parsed.messages.map((msg) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }))
    };
  } catch (error) {
    console.error('Failed to load chat session:', error);
    return null;
  }
};

// Delete a chat session
export const deleteChatSession = (sessionId: string): void => {
  try {
    localStorage.removeItem(`session_${sessionId}`);

    const history = getChatHistory();
    const updatedHistory = history.filter(item => item.id !== sessionId);
    localStorage.setItem('chatHistory', JSON.stringify(updatedHistory));
  } catch (error) {
    console.error('Failed to delete chat session:', error);
  }
};

// Clear all chat history
export const clearAllHistory = (): void => {
  try {
    const history = getChatHistory();
    history.forEach(item => {
      localStorage.removeItem(`session_${item.id}`);
    });
    localStorage.removeItem('chatHistory');
  } catch (error) {
    console.error('Failed to clear all history:', error);
  }
};

// Create a new chat session
export const createChatSession = (
  type: 'pdf' | 'youtube',
  title: string,
  videoUrl?: string,
  documentName?: string
): ChatSession => {
  const session: ChatSession = {
    id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type,
    title,
    messages: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    ...(videoUrl && { videoUrl }),
    ...(documentName && { documentName })
  };

  saveChatSession(session);
  return session;
};

// Add a message to a chat session
export const addMessageToSession = (
  sessionId: string,
  message: Omit<ChatMessage, 'id' | 'timestamp'>
): void => {
  try {
    const session = getChatSession(sessionId);
    if (!session) return;

    const newMessage: ChatMessage = {
      ...message,
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date()
    };

    session.messages.push(newMessage);
    session.updatedAt = new Date();

    saveChatSession(session);
  } catch (error) {
    console.error('Failed to add message to session:', error);
  }
};