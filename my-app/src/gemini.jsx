// File: components/GeminiAnalysisComponent.jsx

import React, { useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell, LineChart, Line } from 'recharts';

const GeminiAnalysisComponent = ({ 
  endowmentData, 
  studentPopulationData, 
  fundingData, 
  selectedEndowmentYear,
  collegeNameMap
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [analysisQuery, setAnalysisQuery] = useState('');
  const [comparisonChart, setComparisonChart] = useState(null);
  const [analysisError, setAnalysisError] = useState(null);
  const [selectedAnalysisTab, setSelectedAnalysisTab] = useState('result');

  // Predefined analysis topics
  const analysisSuggestions = [
    "Analyze funding disparities between colleges",
    "Identify trends in budget allocation efficiency",
    "Compare endowment growth trajectories",
    "Suggest optimal funding distribution",
    "Predict future budget needs based on enrollment changes"
  ];

  const handleAnalyzeClick = () => {
    setIsAnalyzing(true);
    setAnalysisError(null);
    setAnalysisResult(null);
    setComparisonChart(null);
    
    // For a real Gemini integration, you would use their frontend SDK here
    // import { GoogleGenerativeAI } from "@google/generative-ai";
    // But for now, we'll simulate the response
    
    try {
      // In a real implementation with the Gemini frontend SDK:
      /*
      const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
      
      const query = analysisQuery || "Analyze funding distribution across colleges";
      
      const prompt = `
        As a financial analysis AI, analyze the UC Davis budget data for year ${selectedEndowmentYear}, focusing on: ${query}
        
        Data context:
        Endowment data: ${JSON.stringify(endowmentData)}
        Student population: ${JSON.stringify(studentPopulationData.undergradByCollege)}
        Funding data: ${JSON.stringify(fundingData)}
        
        Format your response as JSON with the following structure:
        {
          "analysis": "Your comprehensive analysis here...",
          "insights": ["Insight 1", "Insight 2", "Insight 3", "Insight 4"],
          "recommendations": ["Recommendation 1", "Recommendation 2", "Recommendation 3", "Recommendation 4"],
          "visualizationSuggestion": "Description of suggested visualization"
        }
      `;
      
      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();
      
      // Parse the JSON response
      const jsonResponse = JSON.parse(text);
      */
      
      // We'll simulate a response instead
      setTimeout(() => {
        simulateGeminiResponse(analysisQuery || "Analyze funding distribution across colleges");
      }, 1500);
      
    } catch (error) {
      console.error("Error analyzing data with Gemini:", error);
      setAnalysisError("Failed to analyze data. Please try again later.");
      setIsAnalyzing(false);
    }
  };
  
  // Simulate Gemini response for development
  const simulateGeminiResponse = (query) => {
    const lowerQuery = query.toLowerCase();
    let result;
    
    if (lowerQuery.includes("disparit") || lowerQuery.includes("distribution")) {
      result = {
        analysis: `Based on the data for ${selectedEndowmentYear}, there are significant funding disparities between UC Davis colleges when analyzed on a per-student basis. The College of Engineering (COE) receives approximately $18,942 per student, which is 37% higher than the College of Letters & Science (CLAS) at $13,834 per student. This disparity reflects different resource requirements across disciplines, but may warrant review to ensure equitable educational experiences.`,
        insights: [
          "Engineering disciplines typically require more expensive infrastructure and equipment, explaining part of the higher per-student funding",
          "The College of Letters & Science serves the largest student population but receives less per-student funding than other colleges",
          "Biological Sciences shows strong funding efficiency with balanced per-student allocation",
          "Agricultural & Environmental Sciences benefits from significant endowment growth, reflecting industry partnerships"
        ],
        recommendations: [
          "Review allocation formulas to ensure they account for both discipline-specific needs and enrollment scale",
          "Implement performance-based metrics for evaluating funding effectiveness",
          "Develop shared resource models for interdisciplinary programs to maximize efficiency",
          "Expand industry partnership programs in underrepresented colleges"
        ],
        chartData: generateDisparityChartData()
      };
    } else if (lowerQuery.includes("trend") || lowerQuery.includes("growth")) {
      result = {
        analysis: `The trend analysis of UC Davis endowment growth from ${selectedEndowmentYear-1} to ${selectedEndowmentYear} reveals uneven growth patterns. While the College of Engineering showed the strongest year-over-year growth at 8.7%, the College of Letters & Science experienced more modest growth at 3.2%. This differential growth trajectory has implications for long-term resource availability and strategic planning.`,
        insights: [
          "Engineering disciplines have attracted significantly increased donor interest, likely due to industry partnerships",
          "The College of Biological Sciences has maintained consistent growth despite market fluctuations",
          "Agricultural & Environmental Sciences demonstrates stable funding patterns correlated with research output",
          "Growth in endowment doesn't always translate to proportional increases in student funding"
        ],
        recommendations: [
          "Develop targeted endowment growth strategies for lower-performing colleges",
          "Establish cross-college funding mechanisms to balance resource availability",
          "Create transparent metrics connecting endowment growth to student outcomes",
          "Invest in development staff for colleges with lower growth trajectories"
        ],
        chartData: generateGrowthChartData()
      };
    } else if (lowerQuery.includes("efficien") || lowerQuery.includes("optimal")) {
      result = {
        analysis: `Efficiency analysis of UC Davis budget allocation reveals opportunities for optimization. When comparing expenditure patterns across colleges, there's evidence that administrative overhead varies significantly, from 12% to 21% of total expenditures. The College of Biological Sciences demonstrates the most efficient model, with 79% of funding directly supporting academic programs and research.`,
        insights: [
          "Administrative efficiency varies significantly across colleges",
          "Direct academic program support ranges from 64% to 79% of total expenditures",
          "Research-to-teaching expenditure ratios show disciplinary differences",
          "Operational efficiency correlates with more stable year-over-year budgeting"
        ],
        recommendations: [
          "Implement best practices from the College of Biological Sciences across other units",
          "Establish standardized efficiency metrics for cross-college comparison",
          "Create incentive systems for administrative efficiency improvements",
          "Develop shared service models for common administrative functions"
        ],
        chartData: generateEfficiencyChartData()
      };
    } else {
      result = {
        analysis: `Analysis of UC Davis funding data for ${selectedEndowmentYear} reveals several key patterns and opportunities. The four major colleges show distinctive funding profiles, with varying levels of endowment utilization, per-student funding, and expenditure priorities. The College of Agricultural & Environmental Sciences has the largest endowment but shows moderate per-student funding, suggesting opportunities for optimization.`,
        insights: [
          "Per-student funding varies significantly across colleges, from $13,834 to $18,942",
          "Research expenditure percentage correlates with graduate student enrollment",
          "Administrative overhead varies from 12% to 21% of total expenditures",
          "Endowment utilization rates range from 3.2% to 4.8% annually"
        ],
        recommendations: [
          "Implement cross-college best practices for administrative efficiency",
          "Review allocation formulas based on both enrollment and discipline-specific needs",
          "Develop performance metrics connecting funding to student outcomes",
          "Establish transparent reporting on endowment utilization effectiveness"
        ],
        chartData: generateOverviewChartData()
      };
    }
    
    setAnalysisResult(result);
    setComparisonChart(result.chartData);
    setIsAnalyzing(false);
  };
  
  // Generate sample chart data for different analysis types
  const generateDisparityChartData = () => {
    return {
      title: "Per-Student Funding by College",
      type: "bar",
      data: [
        { name: "COE", value: 18942, fill: "#002855" },
        { name: "CBS", value: 16523, fill: "#DAAA00" },
        { name: "CA&ES", value: 15108, fill: "#B1B3B3" },
        { name: "CLAS", value: 13834, fill: "#747174" },
        { name: "UC Avg", value: 14200, fill: "#E85A4F" }
      ]
    };
  };
  
  const generateGrowthChartData = () => {
    return {
      title: "Year-over-Year Endowment Growth",
      type: "bar",
      data: [
        { name: "COE", value: 8.7, fill: "#002855" },
        { name: "CBS", value: 6.2, fill: "#DAAA00" },
        { name: "CA&ES", value: 5.1, fill: "#B1B3B3" },
        { name: "CLAS", value: 3.2, fill: "#747174" },
        { name: "Univ Avg", value: 5.8, fill: "#E85A4F" }
      ]
    };
  };
  
  const generateEfficiencyChartData = () => {
    return {
      title: "Direct Academic Support (% of Budget)",
      type: "bar",
      data: [
        { name: "CBS", value: 79, fill: "#DAAA00" },
        { name: "COE", value: 73, fill: "#002855" },
        { name: "CA&ES", value: 70, fill: "#B1B3B3" },
        { name: "CLAS", value: 64, fill: "#747174" },
        { name: "Univ Avg", value: 72, fill: "#E85A4F" }
      ]
    };
  };
  
  const generateOverviewChartData = () => {
    return {
      title: "Comparative College Funding Metrics",
      type: "radar",
      data: [
        { category: "Endowment Size", COE: 72, CBS: 65, CAES: 85, CLAS: 78 },
        { category: "Per-Student", COE: 88, CBS: 76, CAES: 70, CLAS: 64 },
        { category: "Research %", COE: 82, CBS: 78, CAES: 75, CLAS: 58 },
        { category: "Admin Efficiency", COE: 75, CBS: 89, CAES: 72, CLAS: 68 },
        { category: "Growth Rate", COE: 87, CBS: 74, CAES: 65, CLAS: 52 }
      ]
    };
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-xl font-semibold mb-4">Gemini AI Budget Analysis</h3>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          What would you like Gemini to analyze?
        </label>
        <textarea
          value={analysisQuery}
          onChange={(e) => setAnalysisQuery(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md"
          placeholder="E.g., Analyze funding disparities between colleges and suggest optimization strategies"
          rows="2"
        />
        <div className="flex flex-wrap gap-2 mt-2">
          {analysisSuggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => setAnalysisQuery(suggestion)}
              className="text-xs bg-gray-100 hover:bg-gray-200 py-1 px-2 rounded"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={handleAnalyzeClick}
          disabled={isAnalyzing}
          className={`px-4 py-2 rounded-md ${
            isAnalyzing
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isAnalyzing ? 'Analyzing...' : 'Analyze with Gemini AI'}
        </button>
        
        <div className="text-sm text-gray-600">
          <div className="flex items-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-1">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#8B5CF6" />
              <path d="M2 17L12 22L22 17" stroke="#8B5CF6" strokeWidth="2" />
              <path d="M2 12L12 17L22 12" stroke="#8B5CF6" strokeWidth="2" />
            </svg>
            <span>Powered by Google Gemini</span>
          </div>
        </div>
      </div>
      
      {analysisError && (
        <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded mb-4">
          {analysisError}
        </div>
      )}
      
      {isAnalyzing && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
          <p className="mt-2 text-gray-600">Gemini is analyzing your financial data...</p>
        </div>
      )}
      
      {analysisResult && (
        <div>
          <div className="border-b border-gray-200 mb-4">
            <nav className="flex -mb-px">
              <button
                onClick={() => setSelectedAnalysisTab('result')}
                className={`mr-8 py-2 border-b-2 font-medium text-sm ${
                  selectedAnalysisTab === 'result'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Analysis
              </button>
              <button
                onClick={() => setSelectedAnalysisTab('insights')}
                className={`mr-8 py-2 border-b-2 font-medium text-sm ${
                  selectedAnalysisTab === 'insights'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Key Insights
              </button>
              <button
                onClick={() => setSelectedAnalysisTab('recommendations')}
                className={`py-2 border-b-2 font-medium text-sm ${
                  selectedAnalysisTab === 'recommendations'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Recommendations
              </button>
            </nav>
          </div>
          
          {selectedAnalysisTab === 'result' && (
            <div>
              <p className="text-gray-800 mb-4">{analysisResult.analysis}</p>
              
              {comparisonChart && comparisonChart.type === 'bar' && (
                <div className="mt-6">
                  <h4 className="text-sm font-medium mb-2">{comparisonChart.title}</h4>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={comparisonChart.data}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip
                        formatter={(value) =>
                          comparisonChart.title.includes('%')
                            ? `${value}%`
                            : comparisonChart.title.includes('Student')
                            ? `$${value}`
                            : value
                        }
                      />
                      <Legend />
                      <Bar dataKey="value" name="Value" fill="#8884d8">
                        {comparisonChart.data.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
              
              {comparisonChart && comparisonChart.type === 'radar' && (
                <div className="mt-6">
                  <h4 className="text-sm font-medium mb-2">{comparisonChart.title}</h4>
                  <p className="text-sm text-gray-500 mb-2">Index values (0-100) normalized for comparison</p>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={comparisonChart.data}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="category" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="COE" stroke="#002855" activeDot={{ r: 8 }} />
                      <Line type="monotone" dataKey="CBS" stroke="#DAAA00" activeDot={{ r: 8 }} />
                      <Line type="monotone" dataKey="CAES" stroke="#B1B3B3" activeDot={{ r: 8 }} />
                      <Line type="monotone" dataKey="CLAS" stroke="#747174" activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          )}
          
          {selectedAnalysisTab === 'insights' && (
            <div>
              <ul className="space-y-3">
                {analysisResult.insights.map((insight, index) => (
                  <li key={index} className="flex items-start">
                    <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-800 mr-2 flex-shrink-0">
                      {index + 1}
                    </span>
                    <span>{insight}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {selectedAnalysisTab === 'recommendations' && (
            <div>
              <ul className="space-y-3">
                {analysisResult.recommendations.map((recommendation, index) => (
                  <li key={index} className="flex items-start">
                    <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-green-100 text-green-800 mr-2 flex-shrink-0">
                      {index + 1}
                    </span>
                    <span>{recommendation}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      
      <div className="mt-6 pt-4 border-t border-gray-200 text-xs text-gray-500">
        <p className="mb-1">
          <strong>Implementation Note:</strong> In a production application, you would integrate with the Gemini API 
          using Google's frontend SDK:
        </p>
        <code className="block bg-gray-100 p-2 rounded text-xs">
          {`// Install the SDK: npm install @google/generative-ai
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the API with your key from environment variable
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

// Generate content
const result = await model.generateContent(prompt);`}
        </code>
      </div>
    </div>
  );
};

export default GeminiAnalysisComponent;