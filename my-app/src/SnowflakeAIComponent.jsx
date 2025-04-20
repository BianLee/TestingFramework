// File: components/SnowflakeAIComponent.jsx
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// This component demonstrates Snowflake AI integration for UC Davis FundFlow dashboard
export const SnowflakeAIComponent = () => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [endpoint, setEndpoint] = useState('https://account-name.snowflakecomputing.com/api/v2/statements');
  const [showConfiguration, setShowConfiguration] = useState(false);
  const [modelType, setModelType] = useState('llm');
  const [aiRecommendations, setAiRecommendations] = useState(null);
  const [generatedChartData, setGeneratedChartData] = useState(null);

  // Simulates sending a query to Snowflake API
  const sendQuery = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      // In a real implementation, this would be an actual API call to Snowflake
      // Example of how the REST API call would be structured:
      /*
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'X-Snowflake-Authorization-Token-Type': 'KEYPAIR_JWT'
        },
        body: JSON.stringify({
          statement: `SELECT SNOWFLAKE.${modelType === 'llm' ? 'LLM_QUERY' : 'IMAGE_GENERATE'}(
            '${query}'
          )`,
          timeout: 60,
          database: 'AI_DB',
          schema: 'PUBLIC',
          warehouse: 'COMPUTE_WH'
        })
      });
      
      const data = await response.json();
      */
      
      // Simulate API response for demo purposes
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (modelType === 'llm') {
        // Simulate LLM response
        const mockResponse = simulateLLMResponse(query);
        setResponse(mockResponse);
        
        // Generate mock recommendations based on query
        if (query.toLowerCase().includes('funding') || query.toLowerCase().includes('budget')) {
          setAiRecommendations(generateFundingRecommendations());
          setGeneratedChartData(generateMockForecastData());
        } else if (query.toLowerCase().includes('enrollment') || query.toLowerCase().includes('student')) {
          setAiRecommendations(generateEnrollmentRecommendations());
          setGeneratedChartData(generateMockEnrollmentData());
        } else {
          setAiRecommendations(null);
          setGeneratedChartData(null);
        }
      } else {
        // Simulate image generation response
        setResponse({
          type: 'image',
          content: 'Image generation simulated. In a real implementation, this would return an image URL.'
        });
        setAiRecommendations(null);
        setGeneratedChartData(null);
      }
    } catch (error) {
      console.error('Error calling Snowflake API:', error);
      setResponse({ 
        type: 'error', 
        content: 'Error calling Snowflake API. Please check your configuration and try again.' 
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Mock LLM response generator
  const simulateLLMResponse = (query) => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('funding') || lowerQuery.includes('budget')) {
      return {
        type: 'text',
        content: `Based on the UC Davis budget data analysis, the university has seen a steady increase in research funding over the past decade, with the most significant growth in the College of Engineering and College of Biological Sciences. The current fiscal year shows a 7.3% increase in total endowment funds compared to the previous year. The College of Agricultural & Environmental Sciences continues to receive the highest percentage of funding at approximately 32% of the total university research budget.`
      };
    } else if (lowerQuery.includes('enrollment') || lowerQuery.includes('student')) {
      return {
        type: 'text',
        content: `UC Davis enrollment data shows a diverse student body with increasing representation of underrepresented minorities over the past five years. The College of Letters & Science maintains the highest enrollment at 40.8% of total undergraduate population. The data indicates a 12% increase in international student enrollment since 2018, with significant growth in graduate programs. Current student-to-faculty ratios average 20:1 across most colleges, with the College of Engineering having the lowest ratio at 16:1.`
      };
    } else if (lowerQuery.includes('diversity') || lowerQuery.includes('demographic')) {
      return {
        type: 'text',
        content: `Diversity metrics at UC Davis show positive trends across all colleges. The percentage of underrepresented minorities has increased by 8.3% over the past decade. The College of Letters & Science leads in diversity metrics with 42% of students identifying as first-generation college students. Gender balance varies by college, with the College of Biological Sciences having the highest percentage of female students at 62%, while the College of Engineering has made significant strides in increasing female enrollment from 24% to 32% over the past five years.`
      };
    } else {
      return {
        type: 'text',
        content: `I've analyzed the UC Davis data based on your query. The university shows strong performance across key metrics including enrollment, funding, research output, and student success rates. The data suggests opportunities for enhanced resource allocation in certain departments. For more specific insights, please ask about particular aspects such as funding, enrollment, diversity, or specific college performance.`
      };
    }
  };
  
  // Generate mock funding recommendations
  const generateFundingRecommendations = () => {
    return [
      "Increase allocation to undergraduate research programs by 15% based on ROI analysis",
      "Redistribute endowment spending to prioritize departments with higher job placement rates",
      "Consider implementing performance-based funding model for academic departments",
      "Explore new public-private partnership opportunities for STEM facilities expansion"
    ];
  };
  
  // Generate mock enrollment recommendations
  const generateEnrollmentRecommendations = () => {
    return [
      "Expand transfer student pathways for underrepresented communities",
      "Implement targeted recruitment strategies for STEM disciplines with gender imbalances",
      "Develop additional support programs for first-generation college students",
      "Consider enrollment cap adjustments for high-demand majors based on job market analysis"
    ];
  };
  
  // Generate mock forecast data for visualization
  const generateMockForecastData = () => {
    return [
      { year: '2023', actual: 850, forecast: 850 },
      { year: '2024', actual: 920, forecast: 920 },
      { year: '2025', actual: null, forecast: 990 },
      { year: '2026', actual: null, forecast: 1070 },
      { year: '2027', actual: null, forecast: 1150 },
      { year: '2028', actual: null, forecast: 1240 }
    ];
  };
  
  // Generate mock enrollment data
  const generateMockEnrollmentData = () => {
    return [
      { year: '2023', actual: 31800, forecast: 31800 },
      { year: '2024', actual: 32400, forecast: 32400 },
      { year: '2025', actual: null, forecast: 33100 },
      { year: '2026', actual: null, forecast: 33800 },
      { year: '2027', actual: null, forecast: 34500 },
      { year: '2028', actual: null, forecast: 35200 }
    ];
  };

  // Sample queries to help users get started
  const sampleQueries = [
    "Analyze the funding trends for UC Davis colleges and recommend allocation strategies",
    "Predict enrollment changes based on demographic shifts in California",
    "Compare research output and funding efficiency across colleges",
    "Identify potential areas for cost optimization in administrative spending"
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Snowflake AI-Powered Analytics</h3>
        <button 
          onClick={() => setShowConfiguration(!showConfiguration)}
          className="text-blue-600 hover:text-blue-800 text-sm"
        >
          {showConfiguration ? 'Hide Configuration' : 'Show Configuration'}
        </button>
      </div>
      
      {showConfiguration && (
        <div className="mb-6 p-4 bg-gray-50 rounded border">
          <h4 className="font-medium mb-2">Snowflake API Configuration</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">API Endpoint</label>
              <input
                type="text"
                value={endpoint}
                onChange={(e) => setEndpoint(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="https://account-name.snowflakecomputing.com/api/v2/statements"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Enter your Snowflake API key"
              />
            </div>
          </div>
          <div className="mt-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Model Type</label>
            <div className="flex space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  checked={modelType === 'llm'}
                  onChange={() => setModelType('llm')}
                  className="form-radio"
                />
                <span className="ml-2">LLM (Text Generation)</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  checked={modelType === 'image'}
                  onChange={() => setModelType('image')}
                  className="form-radio"
                />
                <span className="ml-2">Image Generation</span>
              </label>
            </div>
          </div>
          <div className="mt-3 text-xs text-gray-500">
            <p>Get started with a free 120-day Snowflake student trial. See documentation for API setup.</p>
          </div>
        </div>
      )}
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Enter your query for AI analysis
        </label>
        <div className="flex">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-grow p-2 border border-gray-300 rounded-l"
            placeholder="E.g., Analyze funding trends and suggest optimal allocations"
          />
          <button
            onClick={sendQuery}
            disabled={loading || !query.trim()}
            className={`px-4 py-2 rounded-r ${loading || !query.trim() ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
          >
            {loading ? 'Processing...' : 'Analyze'}
          </button>
        </div>
      </div>
      
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-1">Sample queries:</h4>
        <div className="flex flex-wrap gap-2">
          {sampleQueries.map((sampleQuery, index) => (
            <button
              key={index}
              onClick={() => setQuery(sampleQuery)}
              className="text-xs py-1 px-2 bg-gray-100 hover:bg-gray-200 rounded"
            >
              {sampleQuery}
            </button>
          ))}
        </div>
      </div>
      
      {response && (
        <div className="mt-6">
          <h4 className="font-medium mb-2">AI Analysis Results:</h4>
          <div className="bg-gray-50 p-4 rounded border">
            {response.type === 'text' ? (
              <p className="text-gray-800">{response.content}</p>
            ) : response.type === 'image' ? (
              <div className="text-center">
                <p className="text-gray-800 mb-2">{response.content}</p>
                <div className="bg-gray-200 h-48 flex items-center justify-center rounded">
                  <span className="text-gray-500">[Image would be displayed here]</span>
                </div>
              </div>
            ) : (
              <p className="text-red-600">{response.content}</p>
            )}
          </div>
        </div>
      )}
      
      {aiRecommendations && (
        <div className="mt-6">
          <h4 className="font-medium mb-2">AI-Generated Recommendations:</h4>
          <ul className="bg-blue-50 p-4 rounded border border-blue-100">
            {aiRecommendations.map((rec, index) => (
              <li key={index} className="mb-2 flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {generatedChartData && (
        <div className="mt-6">
          <h4 className="font-medium mb-2">AI-Generated Forecast:</h4>
          <div className="bg-white border rounded p-4">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={generatedChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="actual" 
                  stroke="#002855" 
                  strokeWidth={2} 
                  name="Actual"
                  dot={{ r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="forecast" 
                  stroke="#DAAA00" 
                  strokeWidth={2} 
                  strokeDasharray="5 5"
                  name="AI Forecast" 
                />
              </LineChart>
            </ResponsiveContainer>
            <p className="text-sm text-gray-600 mt-2 italic">
              * Forecast generated using Snowflake AI based on historical data trends and contextual factors
            </p>
          </div>
        </div>
      )}
      
      <div className="mt-6 pt-4 border-t text-sm">
        <p className="text-gray-700">
          <strong>About Snowflake AI Integration:</strong> This component demonstrates how to leverage Snowflake's LLM capabilities through their REST API. Students can get started with a free 120-day trial and embed AI-powered features into applications with minimal setup.
        </p>
        <p className="text-gray-700 mt-2">
          Learn more about building AI-powered applications with Snowflake at <a href="#" className="text-blue-600 hover:underline">Snowflake Student Program</a>.
        </p>
      </div>
    </div>
  );
};

export default SnowflakeAIComponent;