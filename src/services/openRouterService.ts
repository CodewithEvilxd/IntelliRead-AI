import type { GroqMessage } from '../types';

// OpenRouter API configuration
const OPENROUTER_CONFIG = {
  BASE_URL: 'https://openrouter.ai/api/v1',
  DEFAULT_MODEL: 'openai/gpt-4o-mini', // Cost-effective GPT-4 alternative
  FALLBACK_MODEL: 'openai/gpt-3.5-turbo',
  TIMEOUT_MS: 60000,
  GENERATION_PARAMS: {
    temperature: 0.7,
    max_tokens: 2000,
    top_p: 0.95,
    frequency_penalty: 0.1,
    presence_penalty: 0.05,
  }
};

// Enhanced PDF analysis prompt for comprehensive multi-API analysis
export const pdfAnalysisPrompt = `You are an elite AI assistant specializing in comprehensive PDF document analysis as part of a multi-API analysis system. You excel at thoroughly reading and understanding PDF content from multiple perspectives, extracting deep insights, and providing detailed, comprehensive responses.

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

const getOpenRouterApiKey = () => {
  return import.meta.env.VITE_OPENROUTER_API_KEY;
};

export async function chatWithOpenRouter(
  userMessage: string,
  conversationHistory: GroqMessage[] = [],
  documentContext?: string
): Promise<string> {
  const apiKey = getOpenRouterApiKey();
  if (!apiKey) {
    throw new Error('OpenRouter API key not configured');
  }

  const messages: GroqMessage[] = [
    {
      role: 'system',
      content: pdfAnalysisPrompt
    }
  ];

  // Add conversation history (limit to last 10 messages)
  if (conversationHistory.length > 0) {
    messages.push(...conversationHistory.slice(-10));
  }

  // Create user message with enhanced document context
  let userContent = userMessage;
  if (documentContext) {
    userContent = `PDF Document Context (analyze this thoroughly):\n\n${documentContext}\n\n--- End of Document ---\n\nUser Question: ${userMessage}\n\nPlease analyze the document content above and provide a detailed, accurate response based on the information in the PDF.`;
  }

  messages.push({
    role: 'user',
    content: userContent
  });

  try {
    const response = await fetch(`${OPENROUTER_CONFIG.BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Snap Study PDF Chat'
      },
      body: JSON.stringify({
        model: OPENROUTER_CONFIG.DEFAULT_MODEL,
        messages,
        ...OPENROUTER_CONFIG.GENERATION_PARAMS,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('No response content from OpenRouter');
    }

    return content.trim();
  } catch (error) {
    console.error('OpenRouter API error:', error);

    // Try fallback model
    try {
      const fallbackMessages: GroqMessage[] = [
        {
          role: 'system',
          content: pdfAnalysisPrompt
        },
        ...conversationHistory.slice(-8),
        {
          role: 'user',
          content: documentContext
            ? `PDF Document Context:\n${documentContext.slice(0, 12000)}\n\nUser Question: ${userMessage}`
            : userMessage
        }
      ];

      const fallbackResponse = await fetch(`${OPENROUTER_CONFIG.BASE_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Snap Study PDF Chat'
        },
        body: JSON.stringify({
          model: OPENROUTER_CONFIG.FALLBACK_MODEL,
          messages: fallbackMessages,
          temperature: 0.6,
          max_tokens: 1500,
          top_p: 0.9,
        }),
      });

      if (!fallbackResponse.ok) {
        throw new Error(`OpenRouter fallback API error: ${fallbackResponse.status}`);
      }

      const fallbackData = await fallbackResponse.json();
      const fallbackContent = fallbackData.choices?.[0]?.message?.content;

      if (!fallbackContent) {
        throw new Error('No fallback response content from OpenRouter');
      }

      return fallbackContent.trim();
    } catch (fallbackError) {
      console.error('OpenRouter fallback also failed:', fallbackError);
      throw new Error('OpenRouter service is currently unavailable. Please try again.');
    }
  }
}

export { OPENROUTER_CONFIG };