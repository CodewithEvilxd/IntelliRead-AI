import Groq from 'groq-sdk';
import type { GroqMessage } from '@/types';
import { chatWithOpenAI } from './openaiService';
import { chatWithOpenRouter } from './openRouterService';
import { chatWithGemini } from './googleGeminiService';

// AI Prompt configuration for comprehensive multi-API document analysis
export const aiPrompt = `You are an elite AI assistant specializing in comprehensive document analysis as part of a multi-API analysis system. You excel at thoroughly understanding PDF documents from multiple perspectives, extracting deep insights, and providing detailed, comprehensive responses.

Core Capabilities:
- **Complete Document Comprehension**: Thoroughly analyze the entire document context provided, reading every section carefully
- **Multi-Perspective Analysis**: Consider the document from different analytical angles to ensure complete understanding
- **Deep Information Extraction**: Extract specific information, quotes, data points, and contextual relationships
- **Comprehensive Question Answering**: Provide detailed answers that reference multiple parts of the document
- **Contextual Synthesis**: Connect information across different sections and pages of the document

Document Analysis Excellence:
1. **Full Content Reading**: Read and analyze the complete document content provided
2. **Detailed Extraction**: Extract key information, important quotes, and critical data points
3. **Relationship Mapping**: Understand how different parts of the document relate to each other
4. **Comprehensive Summarization**: Provide thorough summaries that capture all essential elements
5. **Evidence-Based Responses**: Support answers with specific references to document content

Response Guidelines:
- **Thorough Analysis**: Demonstrate that you've read and understood the entire document
- **Specific References**: Always reference specific parts, pages, or sections of the document
- **Direct Quotes**: Include relevant direct quotes to support your analysis
- **Complete Answers**: Provide comprehensive responses that address all aspects of the question
- **Multiple Perspectives**: Consider different interpretations and provide the most complete view
- **Detailed Explanations**: Explain complex concepts with full context and supporting evidence
- **Structured Responses**: Use clear formatting with headings, bullet points, and logical organization

Your mission is to provide the most thorough, accurate, and comprehensive analysis possible by fully utilizing the document content provided, working in concert with other AI models for maximum insight.`;

// Get available API keys
const getApiKeys = () => {
  const keys = [];
  if (import.meta.env.VITE_GROQ_API_KEY_1) keys.push(import.meta.env.VITE_GROQ_API_KEY_1);
  if (import.meta.env.VITE_GROQ_API_KEY_2) keys.push(import.meta.env.VITE_GROQ_API_KEY_2);
  if (import.meta.env.VITE_GROQ_API_KEY_3) keys.push(import.meta.env.VITE_GROQ_API_KEY_3);
  return keys;
};

// Initialize Groq client with first available key
const createGroqClient = (apiKey: string) => new Groq({
  apiKey,
  dangerouslyAllowBrowser: true
});

// Configuration based on your credentials
const GROQ_CONFIG = {
  // Using the model from your credentials file
  DEFAULT_MODEL: 'meta-llama/llama-4-scout-17b-16e-instruct',
  FALLBACK_MODEL: 'llama3-8b-8192',
  
  GENERATION_PARAMS: {
    temperature: 0.7,        // Balanced creativity and consistency
    max_tokens: 2000,        // Comprehensive responses
    top_p: 0.95,            // High quality responses
    frequency_penalty: 0.1,  // Reduce repetition
    presence_penalty: 0.05,  // Encourage topic diversity
  },
  
  TIMEOUT_MS: 90000  // 90 seconds for thorough analysis
};

// Function to combine responses from multiple APIs
async function combineAPIResponses(
  userMessage: string,
  _conversationHistory: GroqMessage[],
  documentContext: string,
  responses: { api: string; response: string; error?: string }[]
): Promise<string> {
  const validResponses = responses.filter(r => r.response && !r.error);

  if (validResponses.length === 0) {
    throw new Error('All AI services failed to provide responses');
  }

  if (validResponses.length === 1) {
    return validResponses[0]?.response || '';
  }

  // If we have multiple responses, combine them intelligently
  const apiKeys = getApiKeys();
  if (apiKeys.length === 0) {
    // If no Groq keys, return the first valid response
    return validResponses[0]?.response || '';
  }

  try {
    const groq = createGroqClient(apiKeys[0]);

    const synthesisPrompt = `You are an expert AI synthesizer. You have received responses from multiple AI models analyzing the same PDF document and user question. Your task is to create a comprehensive, detailed response that combines the best insights from all responses.

RESPONSES FROM DIFFERENT AI MODELS:
${validResponses.map((r, i) => `--- Response ${i + 1} from ${r.api} ---\n${r.response}`).join('\n\n')}

ORIGINAL USER QUESTION: ${userMessage}

DOCUMENT CONTEXT LENGTH: ${documentContext.length} characters

SYNTHESIS INSTRUCTIONS:
1. Combine the most accurate and detailed information from all responses
2. Resolve any contradictions by prioritizing responses that reference specific document content
3. Provide comprehensive answers that cover all aspects of the question
4. Include specific quotes and references from the document when available
5. Structure the response clearly with proper formatting
6. If responses differ, explain the different perspectives and provide the most complete answer
7. Ensure the final response is detailed and thorough

Create a single, comprehensive response that represents the best analysis possible:`;

    const synthesisMessages: GroqMessage[] = [
      {
        role: 'system',
        content: 'You are an expert at synthesizing multiple AI responses into comprehensive, accurate answers.'
      },
      {
        role: 'user',
        content: synthesisPrompt
      }
    ];

    const completion = await groq.chat.completions.create({
      model: GROQ_CONFIG.DEFAULT_MODEL,
      messages: synthesisMessages,
      temperature: 0.3, // Lower temperature for more consistent synthesis
      max_tokens: 3000, // Allow longer responses for comprehensive synthesis
      top_p: 0.9,
    });

    const synthesizedResponse = completion.choices[0]?.message?.content;
    if (synthesizedResponse) {
      return synthesizedResponse.trim();
    }
  } catch (error) {
    console.warn('Synthesis failed, returning first valid response:', error);
  }

  // Fallback: return the longest response if synthesis fails
  return validResponses.reduce((longest, current) =>
    (current.response?.length || 0) > (longest.response?.length || 0) ? current : longest
  ).response || '';
}

export async function chatWithContext(
  userMessage: string,
  conversationHistory: GroqMessage[] = [],
  documentContext?: string
): Promise<string> {
  // For PDF/document chats, use all three APIs simultaneously for comprehensive analysis
  if (documentContext && documentContext.length > 100) {
    console.log('🤖 Using all three APIs for comprehensive PDF analysis...');

    // Prepare API calls
    const apiPromises = [
      // OpenAI API call
      (async () => {
        try {
          console.log('🔄 Calling OpenAI API...');
          const response = await chatWithOpenAI(userMessage, conversationHistory, documentContext);
          return { api: 'OpenAI', response };
        } catch (error) {
          console.warn('OpenAI API failed:', error);
          return { api: 'OpenAI', response: '', error: error instanceof Error ? error.message : 'Unknown error' };
        }
      })(),

      // OpenRouter API call
      (async () => {
        try {
          console.log('🔄 Calling OpenRouter API...');
          const response = await chatWithOpenRouter(userMessage, conversationHistory, documentContext);
          return { api: 'OpenRouter', response };
        } catch (error) {
          console.warn('OpenRouter API failed:', error);
          return { api: 'OpenRouter', response: '', error: error instanceof Error ? error.message : 'Unknown error' };
        }
      })(),

      // Groq API call
      (async () => {
        try {
          console.log('🔄 Calling Groq API...');
          const response = await chatWithGroqDirect(userMessage, conversationHistory, documentContext);
          return { api: 'Groq', response };
        } catch (error) {
          console.warn('Groq API failed:', error);
          return { api: 'Groq', response: '', error: error instanceof Error ? error.message : 'Unknown error' };
        }
      })(),

      // Google Gemini API call
      (async () => {
        try {
          console.log('🔄 Calling Google Gemini API...');
          const response = await chatWithGemini(userMessage, conversationHistory, documentContext);
          return { api: 'Google Gemini', response };
        } catch (error) {
          console.warn('Google Gemini API failed:', error);
          return { api: 'Google Gemini', response: '', error: error instanceof Error ? error.message : 'Unknown error' };
        }
      })()
    ];

    // Wait for all API calls to complete (with timeout)
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('API calls timed out')), 120000) // 2 minutes timeout
    );

    try {
      const results = await Promise.race([
        Promise.all(apiPromises),
        timeoutPromise
      ]);

      console.log(`✅ Received ${results.filter(r => r.response).length} successful API responses`);

      // Combine responses using synthesis
      return await combineAPIResponses(userMessage, conversationHistory, documentContext, results);
    } catch (error) {
      console.error('Multi-API approach failed:', error);
      // Fall back to single API approach
    }
  }

  // Fallback to Groq for non-PDF chats or when multi-API fails
  return await chatWithGroqDirect(userMessage, conversationHistory, documentContext);
}

// Direct Groq chat function (extracted for reuse)
async function chatWithGroqDirect(
  userMessage: string,
  conversationHistory: GroqMessage[] = [],
  documentContext?: string
): Promise<string> {
  const apiKeys = getApiKeys();
  if (apiKeys.length === 0) {
    throw new Error('No Groq API keys configured');
  }

  for (let i = 0; i < apiKeys.length; i++) {
    try {
      const groq = createGroqClient(apiKeys[i]);
      const messages: GroqMessage[] = [
        {
          role: 'system',
          content: aiPrompt
        }
      ];

      // Add conversation history
      if (conversationHistory.length > 0) {
        messages.push(...conversationHistory.slice(-10));
      }

      // Create user message with enhanced document context if available
      let userContent = userMessage;
      if (documentContext) {
        const contextSnippet = documentContext.slice(0, 12000);
        userContent = `Please analyze this PDF document content thoroughly and answer the user's question based on the information provided:

DOCUMENT CONTENT:
${contextSnippet}

${documentContext.length > 12000 ? `\n[Note: This is a partial view of the document. Total length: ${documentContext.length} characters]` : ''}

USER QUESTION: ${userMessage}

Please provide a detailed, accurate response based on the document content above. Reference specific parts of the document when possible.`;
      }

      messages.push({
        role: 'user',
        content: userContent
      });

      const completion = await groq.chat.completions.create({
        model: GROQ_CONFIG.DEFAULT_MODEL,
        messages,
        ...GROQ_CONFIG.GENERATION_PARAMS,
      });

      const response = completion.choices[0]?.message?.content;
      if (!response) {
        throw new Error('No response received from AI service');
      }

      return response.trim();
    } catch (error) {
      console.error(`Error with Groq API key ${i + 1}, trying next:`, error);
      if (i === apiKeys.length - 1) {
        // Last key failed, try fallback model with last key
        try {
          const groq = createGroqClient(apiKeys[i]);
          const messages: GroqMessage[] = [
            {
              role: 'system',
              content: aiPrompt
            },
            ...conversationHistory.slice(-8),
            {
              role: 'user',
              content: documentContext
                ? `Please analyze this PDF document thoroughly:

DOCUMENT CONTENT:
${documentContext.slice(0, 10000)}

USER QUESTION: ${userMessage}

Provide a detailed response based on the document content.`
                : userMessage
            }
          ];

          const completion = await groq.chat.completions.create({
            model: GROQ_CONFIG.FALLBACK_MODEL,
            messages,
            temperature: 0.6,
            max_tokens: 1500,
            top_p: 0.9,
          });

          const response = completion.choices[0]?.message?.content;
          if (!response) {
            throw new Error('No response received from fallback AI service');
          }

          return response.trim();
        } catch (fallbackError) {
          console.error('Groq fallback model also failed:', fallbackError);
          throw new Error('AI service is currently unavailable. Please try again in a moment.');
        }
      }
    }
  }
  throw new Error('All AI services failed');
}

export async function analyzeDocument(
  documentText: string,
  fileName: string
): Promise<string> {
  const apiKeys = getApiKeys();
  if (apiKeys.length === 0) {
    throw new Error('No Groq API keys configured');
  }

  for (let i = 0; i < apiKeys.length; i++) {
    try {
      const groq = createGroqClient(apiKeys[i]);
      const analysisPrompt = `Please provide a comprehensive analysis of this PDF document "${fileName}".

Document Content:
${documentText.slice(0, 10000)}

Please provide:
1. **Document Summary**: A concise overview of the main content and purpose
2. **Key Topics**: The primary subjects and themes covered
3. **Important Information**: Critical data, conclusions, or insights
4. **Structure Analysis**: How the document is organized and its logical flow
5. **Notable Elements**: Any significant figures, references, or unique aspects

Format your response with clear headings and bullet points for easy reading.`;

      const completion = await groq.chat.completions.create({
        model: GROQ_CONFIG.DEFAULT_MODEL,
        messages: [
          {
            role: 'system',
            content: aiPrompt
          },
          {
            role: 'user',
            content: analysisPrompt
          }
        ],
        ...GROQ_CONFIG.GENERATION_PARAMS,
      });

      const response = completion.choices[0]?.message?.content;
      if (!response) {
        throw new Error('No analysis received from AI service');
      }

      return response.trim();
    } catch (error) {
      console.error(`Document analysis error with API key ${i + 1}:`, error);
      if (i === apiKeys.length - 1) {
        throw new Error('Failed to analyze document. Please try again.');
      }
    }
  }
  throw new Error('All API keys failed for document analysis');
}

export { GROQ_CONFIG }; 