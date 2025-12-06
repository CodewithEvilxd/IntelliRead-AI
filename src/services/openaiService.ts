import type { GroqMessage } from '../types';

// OpenAI API configuration
const OPENAI_CONFIG = {
  BASE_URL: 'https://api.openai.com/v1',
  DEFAULT_MODEL: 'gpt-4o-mini', // Cost-effective GPT-4 alternative
  FALLBACK_MODEL: 'gpt-3.5-turbo',
  TIMEOUT_MS: 60000,
  GENERATION_PARAMS: {
    temperature: 0.7,
    max_tokens: 2000,
    top_p: 0.95,
    frequency_penalty: 0.1,
    presence_penalty: 0.05,
  }
};

// Enhanced PDF analysis prompt for ChatGPT - Comprehensive Multi-API Analysis
export const pdfAnalysisPrompt = `You are an elite AI assistant specializing in comprehensive PDF document analysis. You excel at thoroughly reading and understanding PDF content from multiple perspectives, extracting deep insights, and providing detailed, comprehensive responses.

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

Your mission is to provide the most thorough, accurate, and comprehensive analysis possible by fully utilizing the document content provided.`;

const getOpenAIApiKey = () => {
  return import.meta.env.VITE_OPENAI_API_KEY;
};

export async function chatWithOpenAI(
  userMessage: string,
  conversationHistory: GroqMessage[] = [],
  documentContext?: string
): Promise<string> {
  const apiKey = getOpenAIApiKey();
  if (!apiKey) {
    throw new Error('OpenAI API key not configured');
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
    const response = await fetch(`${OPENAI_CONFIG.BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: OPENAI_CONFIG.DEFAULT_MODEL,
        messages,
        ...OPENAI_CONFIG.GENERATION_PARAMS,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('No response content from OpenAI');
    }

    return content.trim();
  } catch (error) {
    console.error('OpenAI API error:', error);

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

      const fallbackResponse = await fetch(`${OPENAI_CONFIG.BASE_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: OPENAI_CONFIG.FALLBACK_MODEL,
          messages: fallbackMessages,
          temperature: 0.6,
          max_tokens: 1500,
          top_p: 0.9,
        }),
      });

      if (!fallbackResponse.ok) {
        throw new Error(`OpenAI fallback API error: ${fallbackResponse.status}`);
      }

      const fallbackData = await fallbackResponse.json();
      const fallbackContent = fallbackData.choices?.[0]?.message?.content;

      if (!fallbackContent) {
        throw new Error('No fallback response content from OpenAI');
      }

      return fallbackContent.trim();
    } catch (fallbackError) {
      console.error('OpenAI fallback also failed:', fallbackError);
      throw new Error('OpenAI service is currently unavailable. Please try again.');
    }
  }
}

export { OPENAI_CONFIG };