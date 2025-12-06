import React, { useState } from 'react';
import { testAPIs, testChatWithPDF } from '../utils/apiTest';

interface APIResult {
  status: string;
  models: string[];
  error: string | null;
}

interface ChatTestResult {
  status: string;
  response: string | null;
  error: string | null;
}

const APITest: React.FC = () => {
  const [apiResults, setApiResults] = useState<{
    openai: APIResult;
    openrouter: APIResult;
    groq: APIResult;
  } | null>(null);
  const [chatResults, setChatResults] = useState<{
    openai: ChatTestResult;
    openrouter: ChatTestResult;
    groq: ChatTestResult;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const runAPITest = async () => {
    setLoading(true);
    try {
      const results = await testAPIs();
      setApiResults(results);
    } catch (error) {
      console.error('API test failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const runChatTest = async () => {
    setLoading(true);
    try {
      const results = await testChatWithPDF();
      setChatResults(results);
    } catch (error) {
      console.error('Chat test failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-vintage-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-vintage-black mb-8">API Testing Dashboard</h1>

        <div className="grid gap-6 md:grid-cols-2">
          {/* API Status Test */}
          <div className="bg-white rounded-xl shadow-vintage p-6">
            <h2 className="text-xl font-semibold text-vintage-black mb-4">API Status Check</h2>
            <button
              onClick={runAPITest}
              disabled={loading}
              className="w-full bg-vintage-black text-white py-3 px-4 rounded-lg hover:bg-vintage-gray-800 disabled:opacity-50"
            >
              {loading ? 'Testing...' : 'Test API Status'}
            </button>

            {apiResults && (
              <div className="mt-4 space-y-3">
                {Object.entries(apiResults).map(([service, result]) => (
                  <div key={service} className="border rounded-lg p-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium capitalize">{service}</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        result.status === 'working' ? 'bg-green-100 text-green-800' :
                        result.status === 'error' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {result.status}
                      </span>
                    </div>
                    {result.models.length > 0 && (
                      <div className="text-sm text-gray-600">
                        <strong>Models:</strong> {result.models.join(', ')}
                      </div>
                    )}
                    {result.error && (
                      <div className="text-sm text-red-600">
                        <strong>Error:</strong> {result.error}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Chat Test */}
          <div className="bg-white rounded-xl shadow-vintage p-6">
            <h2 className="text-xl font-semibold text-vintage-black mb-4">PDF Chat Test</h2>
            <button
              onClick={runChatTest}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Testing...' : 'Test PDF Chat'}
            </button>

            {chatResults && (
              <div className="mt-4 space-y-3">
                {Object.entries(chatResults).map(([service, result]) => (
                  <div key={service} className="border rounded-lg p-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium capitalize">{service}</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        result.status === 'success' ? 'bg-green-100 text-green-800' :
                        result.status === 'error' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {result.status}
                      </span>
                    </div>
                    {result.response && (
                      <div className="text-sm text-gray-600">
                        <strong>Response:</strong> {result.response}
                      </div>
                    )}
                    {result.error && (
                      <div className="text-sm text-red-600">
                        <strong>Error:</strong> {result.error}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-800 mb-2">API Priority for PDF Chats:</h3>
          <ol className="text-sm text-yellow-700 list-decimal list-inside space-y-1">
            <li><strong>OpenAI (Direct)</strong> - GPT-4o-mini primary</li>
            <li><strong>OpenRouter</strong> - Alternative ChatGPT access</li>
            <li><strong>Groq</strong> - Llama models fallback</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default APITest;