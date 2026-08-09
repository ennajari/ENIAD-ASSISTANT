import { useState } from 'react';
import ragApiService from '../../services/ragApiService';

const ApiConnectionTest = () => {
  const [testResult, setTestResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const runConnectionTest = async () => {
    setIsLoading(true);
    setTestResult(null);
    
    try {
      const result = await ragApiService.testConnection();
      setTestResult(result);
    } catch (error) {
      setTestResult({
        status: 'error',
        error: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testDirectQuery = async () => {
    setIsLoading(true);
    setTestResult(null);
    
    try {
      const result = await ragApiService.query({
        query: 'Hello, this is a test message. Can you respond?',
        language: 'en',
        options: {
          chatId: 'debug_test_' + Date.now()
        }
      });
      setTestResult({
        status: 'query_success',
        result: result
      });
    } catch (error) {
      setTestResult({
        status: 'query_failed',
        error: error.message,
        details: error
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
        🔧 API Connection Debug Tool
      </h2>
      
      <div className="space-y-4">
        <div className="flex gap-4">
          <button
            onClick={runConnectionTest}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {isLoading ? '🔄 Testing...' : '🔍 Test Connection'}
          </button>
          
          <button
            onClick={testDirectQuery}
            disabled={isLoading}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
          >
            {isLoading ? '🔄 Testing...' : '💬 Test Query'}
          </button>
        </div>

        {testResult && (
          <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
              Test Result:
            </h3>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-medium">Status:</span>
                <span className={`px-2 py-1 rounded text-sm ${
                  testResult.status === 'connected' || testResult.status === 'query_success'
                    ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                    : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                }`}>
                  {testResult.status}
                </span>
              </div>
              
              {testResult.endpoint && (
                <div>
                  <span className="font-medium">Endpoint:</span>
                  <code className="ml-2 px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded text-sm">
                    {testResult.endpoint}
                  </code>
                </div>
              )}
              
              {testResult.error && (
                <div>
                  <span className="font-medium text-red-600">Error:</span>
                  <div className="mt-1 p-2 bg-red-50 dark:bg-red-900 rounded text-sm">
                    {testResult.error}
                  </div>
                </div>
              )}
              
              {testResult.details && (
                <div>
                  <span className="font-medium">Details:</span>
                  <pre className="mt-1 p-2 bg-gray-200 dark:bg-gray-600 rounded text-sm overflow-auto">
                    {JSON.stringify(testResult.details, null, 2)}
                  </pre>
                </div>
              )}
              
              {testResult.response && (
                <div>
                  <span className="font-medium">Response:</span>
                  <pre className="mt-1 p-2 bg-gray-200 dark:bg-gray-600 rounded text-sm overflow-auto">
                    {JSON.stringify(testResult.response, null, 2)}
                  </pre>
                </div>
              )}
              
              {testResult.result && (
                <div>
                  <span className="font-medium">Query Result:</span>
                  <pre className="mt-1 p-2 bg-gray-200 dark:bg-gray-600 rounded text-sm overflow-auto">
                    {JSON.stringify(testResult.result, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        )}
        
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
          <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
            🛠️ Troubleshooting Tips:
          </h4>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <li>• Make sure your Next.js API server is running (usually on port 3000)</li>
            <li>• Check that the VITE_RAG_API_BASE_URL in .env points to the correct domain</li>
            <li>• Verify your /api/chat endpoint is accessible</li>
            <li>• Check browser console for CORS errors</li>
            <li>• Ensure your API accepts POST requests with chatId and prompt</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ApiConnectionTest;
