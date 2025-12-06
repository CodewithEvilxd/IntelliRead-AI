// API Testing utility to check which services are working
interface APIResult {
  status: 'unknown' | 'working' | 'error' | 'no_key';
  models: string[];
  error: string | null;
}

interface OpenAIModel {
  id: string;
  object: string;
  created: number;
  owned_by: string;
}

interface OpenRouterModel {
  id: string;
  name: string;
  description: string;
}

interface GroqModel {
  id: string;
  object: string;
  created: number;
  owned_by: string;
}

export async function testAPIs() {
  const results: {
    openai: APIResult;
    openrouter: APIResult;
    groq: APIResult;
  } = {
    openai: { status: 'unknown', models: [], error: null },
    openrouter: { status: 'unknown', models: [], error: null },
    groq: { status: 'unknown', models: [], error: null }
  };

  // Test OpenAI
  try {
    const openaiKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (openaiKey && openaiKey !== 'your_openai_api_key_here') {
      const response = await fetch('https://api.openai.com/v1/models', {
        headers: {
          'Authorization': `Bearer ${openaiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data: { data: OpenAIModel[] } = await response.json();
        const chatModels = data.data
          .filter((model) => model.id.includes('gpt'))
          .map((model) => model.id);
        results.openai = { status: 'working', models: chatModels, error: null };
      } else {
        results.openai = { status: 'error', models: [], error: `HTTP ${response.status}` };
      }
    } else {
      results.openai = { status: 'no_key', models: [], error: 'API key not set' };
    }
  } catch (error) {
    results.openai = { status: 'error', models: [], error: error instanceof Error ? error.message : 'Unknown error' };
  }

  // Test OpenRouter
  try {
    const openrouterKey = import.meta.env.VITE_OPENROUTER_API_KEY;
    if (openrouterKey && openrouterKey !== 'your_openrouter_api_key_here') {
      const response = await fetch('https://openrouter.ai/api/v1/models', {
        headers: {
          'Authorization': `Bearer ${openrouterKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data: { data: OpenRouterModel[] } = await response.json();
        const chatModels = data.data
          .filter((model) => model.id.includes('gpt') || model.id.includes('openai'))
          .slice(0, 5) // Limit to first 5
          .map((model) => model.id);
        results.openrouter = { status: 'working', models: chatModels, error: null };
      } else {
        results.openrouter = { status: 'error', models: [], error: `HTTP ${response.status}` };
      }
    } else {
      results.openrouter = { status: 'no_key', models: [], error: 'API key not set' };
    }
  } catch (error) {
    results.openrouter = { status: 'error', models: [], error: error instanceof Error ? error.message : 'Unknown error' };
  }

  // Test Groq
  try {
    const groqKeys = [
      import.meta.env.VITE_GROQ_API_KEY_1,
      import.meta.env.VITE_GROQ_API_KEY_2,
      import.meta.env.VITE_GROQ_API_KEY_3
    ].filter(key => key && key !== 'groq-api-key-1-goes-here');

    if (groqKeys.length > 0) {
      // Simple test with first available key
      const response = await fetch('https://api.groq.com/openai/v1/models', {
        headers: {
          'Authorization': `Bearer ${groqKeys[0]}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data: { data: GroqModel[] } = await response.json();
        const models = data.data.map((model) => model.id);
        results.groq = { status: 'working', models, error: null };
      } else {
        results.groq = { status: 'error', models: [], error: `HTTP ${response.status}` };
      }
    } else {
      results.groq = { status: 'no_key', models: [], error: 'API keys not set' };
    }
  } catch (error) {
    results.groq = { status: 'error', models: [], error: error instanceof Error ? error.message : 'Unknown error' };
  }

  return results;
}

interface ChatTestResult {
  status: 'untested' | 'success' | 'error';
  response: string | null;
  error: string | null;
}

export async function testChatWithPDF() {
  const testResults: {
    openai: ChatTestResult;
    openrouter: ChatTestResult;
    groq: ChatTestResult;
  } = {
    openai: { status: 'untested', response: null, error: null },
    openrouter: { status: 'untested', response: null, error: null },
    groq: { status: 'untested', response: null, error: null }
  };

  const testMessage = "Hello, can you understand this test message?";
  const testContext = "This is a test PDF document with some sample content for testing AI responses.";

  // Test OpenAI
  try {
    const { chatWithOpenAI } = await import('../services/openaiService');
    const response = await chatWithOpenAI(testMessage, [], testContext);
    testResults.openai = { status: 'success', response: response.substring(0, 100) + '...', error: null };
  } catch (error) {
    testResults.openai = { status: 'error', response: null, error: error instanceof Error ? error.message : 'Unknown error' };
  }

  // Test OpenRouter
  try {
    const { chatWithOpenRouter } = await import('../services/openRouterService');
    const response = await chatWithOpenRouter(testMessage, [], testContext);
    testResults.openrouter = { status: 'success', response: response.substring(0, 100) + '...', error: null };
  } catch (error) {
    testResults.openrouter = { status: 'error', response: null, error: error instanceof Error ? error.message : 'Unknown error' };
  }

  // Test Groq
  try {
    const { chatWithContext } = await import('../services/groqService');
    const response = await chatWithContext(testMessage, [], testContext);
    testResults.groq = { status: 'success', response: response.substring(0, 100) + '...', error: null };
  } catch (error) {
    testResults.groq = { status: 'error', response: null, error: error instanceof Error ? error.message : 'Unknown error' };
  }

  return testResults;
}