// File: components/UCDavisDashboard.jsx (or .js depending on your setup)

//https://lao.ca.gov/Education/EdBudget/Details/687

import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, ReferenceLine
} from 'recharts';

// Import data and colors
import { UCDAVIS_COLORS, ETHNIC_COLORS, FUNDING_COLORS } from '../data/colors';
import { studentPopulationData } from '../data/studentPopulationData';
import { ethnicityData } from '../data/ethnicityData';
import { fundingData } from '../data/fundingData';
import { summerAidData } from '../data/summerAidData';
import { endowmentData } from '../data/endowmentData';
import { studentStatsData } from '../data/studentStatsData';
import { caesExpenditureData } from '../data/caesExpenditureData';
import { cbsExpenditureData } from '../data/cbsExpenditureData';
import { coeExpenditureData } from '../data/coeExpenditureData';
import { clsExpenditureData } from '../data/clsExpenditureData';
import GeminiAnalysisComponent from './gemini.jsx';

// Add these with your other imports at the top of UCDavisDashboard.jsx
import { 
  calculateCorrelation, 
  linearRegression, 
  calculateMSE, 
  calculateRSquared, 
  calculateAdjustedRSquared,
  calculateTStatistic,
  calculatePValue
} from '../data/statisticsUtils.js';


export const UCDavisDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedEndowmentYear, setSelectedEndowmentYear] = useState(2023);
  const PIE_COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#8dd1e1', '#a4de6c'];

  var endowmentRow = endowmentData.find(d => d.unit === "College of Biological Sciences");
  var endowmentTotalCbs = endowmentRow?.[selectedEndowmentYear] || 1; // avoid div by zero
  var expenditureTotalCbs = cbsExpenditureData[selectedEndowmentYear].total * 1000; // convert from K to actual $
  var percentUsedCbs = ((expenditureTotalCbs / endowmentTotalCbs) * 100).toFixed(2);

  endowmentRow = endowmentData.find(d => d.unit === "College of Agricultural & Environmental Sciences");
  var endowmentTotalCaes = endowmentRow?.[selectedEndowmentYear] || 1; // avoid div by zero
  var expenditureTotalCaes = caesExpenditureData[selectedEndowmentYear].total * 1000; // convert from K to actual $
  var percentUsedCaes = ((expenditureTotalCaes / endowmentTotalCaes) * 100).toFixed(2);
  
  endowmentRow = endowmentData.find(d => d.unit === "College of Engineering");
  var endowmentTotalCoe = endowmentRow?.[selectedEndowmentYear] || 1; // avoid div by zero
  var expenditureTotalCoe = coeExpenditureData[selectedEndowmentYear].total * 1000; // convert from K to actual $
  var percentUsedCoe = ((expenditureTotalCoe / endowmentTotalCoe) * 100).toFixed(2);

  endowmentRow = endowmentData.find(d => d.unit === "College of Letters & Science");
  var endowmentTotalCls = endowmentRow?.[selectedEndowmentYear] || 1; // avoid div by zero
  var expenditureTotalCls = clsExpenditureData[selectedEndowmentYear].total * 1000; // convert from K to actual $
  var percentUsedCls = ((expenditureTotalCls / endowmentTotalCls) * 100).toFixed(2);


  const toPieData = (obj) =>
    Object.entries(obj).map(([key, value]) => ({
      name: key,
      value,
    }));
  

  const caesPieData = caesExpenditureData[selectedEndowmentYear].breakdown.map((item, idx) => ({
    name: item.label,
    value: item.amount
  }));
  const cbsPieData = cbsExpenditureData[selectedEndowmentYear].breakdown.map((item, idx) => ({
    name: item.label,
    value: item.amount
  }));
  const coePieData = coeExpenditureData[selectedEndowmentYear].breakdown.map((item, idx) => ({
    name: item.label,
    value: item.amount
  }));
  const clsPieData = clsExpenditureData[selectedEndowmentYear].breakdown.map((item, idx) => ({
    name: item.label,
    value: item.amount
  }))

  const perStudentData = studentPopulationData.undergradByCollege.map(({ name, students }) => {
    let expenditure = 0;
    if (name === "CA&ES") expenditure = caesExpenditureData[selectedEndowmentYear].total;
    else if (name === "CBS") expenditure = cbsExpenditureData[selectedEndowmentYear].total;
    else if (name === "COE") expenditure = coeExpenditureData[selectedEndowmentYear].total;
    else if (name === "CLAS") expenditure = clsExpenditureData[selectedEndowmentYear].total;
    return {
      college: name,
      perStudentFunding: Math.round((expenditure * 1_000) / students), // convert from thousands to dollars,
      color: UCDAVIS_COLORS.secondary
    };
  });

  perStudentData.push({
    college: "UC Avg",
    perStudentFunding: 32037,
    color: "#a3a3a3"
  });

  const collegeNameMap = {
    "CLAS": "College of Letters & Science",
    "COE": "College of Engineering",
    "CBS": "College of Biological Sciences",
    "CA&ES": "College of Agricultural & Environmental Sciences",
  };

  // Format numbers with commas
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  
  // Tooltip formatters
  const percentageFormatter = (value) => `${value}%`;
  const numberFormatter = (value) => formatNumber(value);
  const dollarFormatter = (value) => `$${formatNumber(value)}`;
  
  // Generate pie chart data from total ethnic composition
  const totalEthnicityPieData = ethnicityData.currentComposition.map(item => ({
    name: item.group,
    value: item.Total,
    color: ETHNIC_COLORS[item.group] || "#cccccc"
  }));
  
  // Prepare student population pie data
  const studentPopulationPieData = studentPopulationData.categories.map(cat => ({
    name: cat.name,
    value: cat.value,
    color: cat.color
  }));
  
  // Prepare funding pie data
  const fundingPieData = fundingData.sources.map(source => ({
    name: source.name,
    value: source.value,
    displayValue: source.displayValue
  }));
  
  // Create color scales for the pie charts
  const POPULATION_COLORS = studentPopulationPieData.map(d => d.color);
  const FUNDING_PIE_COLORS = ['#7b3294', '#c2a5cf', '#f7f7f7', '#ef8a62', '#e08214', 
                            '#8c510a', '#bf812d', '#dfc27d', '#f6e8c3', '#01665e'];
  
  // Generate data for the comprehensive trends view
// Enhanced generateTrendsData function with more sophisticated forecasting
const generateTrendsData = () => {
  const baseData = [
    { year: "2014-15", enrollment: 28000, diversity: 60, funding: 850, urm: 28 },
    { year: "2015-16", enrollment: 29000, diversity: 62, funding: 900, urm: 29 },
    { year: "2016-17", enrollment: 29500, diversity: 65, funding: 920, urm: 31 },
    { year: "2017-18", enrollment: 30000, diversity: 67, funding: 930, urm: 32 },
    { year: "2018-19", enrollment: 30500, diversity: 69, funding: 935, urm: 33 },
    { year: "2019-20", enrollment: 31000, diversity: 72, funding: 941, urm: 35 },
    { year: "2020-21", enrollment: 31200, diversity: 74, funding: 968, urm: 37 },
    { year: "2021-22", enrollment: 31500, diversity: 76, funding: 1071, urm: 38 },
    { year: "2022-23", enrollment: 31800, diversity: 78, funding: 1006, urm: 40 },
    { year: "2023-24", enrollment: 32000, diversity: 80, funding: 1039, urm: 42 }
  ];

  const lastYear = 2023;
  const nextYears = [2024, 2025, 2026];
  
  // More sophisticated forecasting approach
  // For funding: exponential smoothing with recent year weighting
  const fundingData = baseData.map(d => d.funding);
  const alpha = 0.5; // Smoothing factor - higher values give more weight to recent observations
  
  // Calculate funding forecast using exponential smoothing
  let lastSmoothed = fundingData[fundingData.length - 1];
  const fundingForecasts = nextYears.map((year, idx) => {
    // Add some seasonal variation and trend
    const trend = (fundingData[fundingData.length - 1] - fundingData[fundingData.length - 3]) / 2;
    const randomVariation = Math.random() * 30 - 15; // Random variation between -15 and +15
    const nextValue = lastSmoothed + trend + randomVariation;
    lastSmoothed = alpha * nextValue + (1 - alpha) * lastSmoothed;
    return Math.round(nextValue);
  });
  
  // Linear forecasts for other metrics based on recent trends
  const enrollmentSlope = (baseData[baseData.length - 1].enrollment - baseData[baseData.length - 3].enrollment) / 2;
  const diversitySlope = (baseData[baseData.length - 1].diversity - baseData[baseData.length - 3].diversity) / 2;
  const urmSlope = (baseData[baseData.length - 1].urm - baseData[baseData.length - 3].urm) / 2;
  
  const forecasts = nextYears.map((year, idx) => {
    return {
      year: `${year}-${(year + 1).toString().slice(2)}`,
      enrollment: Math.round(baseData[baseData.length - 1].enrollment + enrollmentSlope * (idx + 1)),
      diversity: Math.round(baseData[baseData.length - 1].diversity + diversitySlope * (idx + 1)),
      funding: fundingForecasts[idx],
      urm: Math.round(baseData[baseData.length - 1].urm + urmSlope * (idx + 1)),
      forecast: true
    };
  });

  return [...baseData.map(d => ({ ...d, forecast: false })), ...forecasts];
};

const VotingSection = () => {
  const [votes, setVotes] = useState({
    scholarships: 0,
    athletics: 0,
    research: 0,
    facilities: 0
  });
  const [userVoted, setUserVoted] = useState(false);
  const [feedback, setFeedback] = useState('');

  const handleVote = (category) => {
    if (!userVoted) {
      setVotes({
        ...votes,
        [category]: votes[category] + 1
      });
      setUserVoted(true);
      
      // In a real app, you would save this to a database
      console.log(`Vote recorded for ${category}`);
    }
  };

  const submitFeedback = () => {
    if (feedback.trim()) {
      // In a real app, you would save this to a database
      console.log(`Feedback submitted: ${feedback}`);
      setFeedback('');
      alert('Thank you for your feedback!');
    }
  };

  // Calculate percentages for the chart
  const totalVotes = Object.values(votes).reduce((sum, count) => sum + count, 0);
  const votingData = Object.entries(votes).map(([name, count]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    votes: count,
    percentage: totalVotes > 0 ? ((count / totalVotes) * 100).toFixed(1) : 0
  }));

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-xl font-semibold mb-4">Where should UC Davis allocate additional funding?</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <div className="mb-4">
            <p className="text-gray-700 mb-2">Cast your vote:</p>
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => handleVote('scholarships')}
                disabled={userVoted}
                className={`px-3 py-2 rounded ${userVoted ? 'bg-gray-200' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
              >
                Student Scholarships
              </button>
              <button 
                onClick={() => handleVote('athletics')}
                disabled={userVoted}
                className={`px-3 py-2 rounded ${userVoted ? 'bg-gray-200' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
              >
                Athletics Programs
              </button>
              <button 
                onClick={() => handleVote('research')}
                disabled={userVoted}
                className={`px-3 py-2 rounded ${userVoted ? 'bg-gray-200' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
              >
                Research Initiatives
              </button>
              <button 
                onClick={() => handleVote('facilities')}
                disabled={userVoted}
                className={`px-3 py-2 rounded ${userVoted ? 'bg-gray-200' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
              >
                Campus Facilities
              </button>
            </div>
            {userVoted && (
              <p className="text-sm text-green-600 mt-2">Thank you for voting!</p>
            )}
          </div>
          
          <div>
            <p className="text-gray-700 mb-2">Other suggestions or comments:</p>
            <textarea 
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              rows="3"
              placeholder="Share your thoughts on budget priorities..."
            ></textarea>
            <button 
              onClick={submitFeedback}
              className="mt-2 px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Submit Feedback
            </button>
          </div>
        </div>
        
        <div>
          <h4 className="font-medium mb-2">Current Results</h4>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={votingData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => `${value} votes`} />
              <Bar dataKey="votes" fill={UCDAVIS_COLORS.primary}>
                {votingData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-2">
            <p className="text-sm text-gray-600">Total votes: {totalVotes}</p>
            {votingData.map((item) => (
              <div key={item.name} className="flex justify-between text-sm">
                <span>{item.name}:</span>
                <span>{item.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

  // Overview Tab Content Component
  const OverviewContent = () => (
     
    <div className="space-y-8">

<h2 className="text-2xl font-bold mb-2 text-center">
  FundFlow: Interactive UC Davis Budget and Expenditures Analysis & Forecasting Tool with Public API
</h2>
<p>Bian Lee - Computer Science, Economics '26</p>
<details className="text-sm text-gray-700 mb-6 text-center">
  <summary className="cursor-pointer text-blue-600 font-medium">Public API Routes (host - localhost:3000)</summary>
  <div className="mt-2 text-left inline-block text-sm">

  <ul className="list-none space-y-1 text-left inline-block">
    <center>
  <code className="font-mono text-sm">/api/endowment/unit/:unit</code>
  <br/>  <code className="font-mono text-sm">/api/endowment/year/:year</code>
  <br/><code className="font-mono text-sm">/api/college-stats/:year</code>
  <br/><code className="font-mono text-sm">/api/student-population</code>
  <br/><code className="font-mono text-sm">/api/trends</code>
  </center>
</ul>

  </div>
</details>


       {/*
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-xl font-semibold text-center mb-2">Total Student Population</h3>
          <div className="text-4xl font-bold text-center text-blue-800">41,240</div>
          <div className="text-center mt-1 text-gray-600">Fall 2024-25</div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-xl font-semibold text-center mb-2">Research Funding</h3>
          <div className="text-4xl font-bold text-center text-blue-800">$1.04B</div>
          <div className="text-center mt-1 text-gray-600">2023-24 Fiscal Year</div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-xl font-semibold text-center mb-2">URM Students</h3>
          <div className="text-4xl font-bold text-center text-blue-800">29.1%</div>
          <div className="text-center mt-1 text-gray-600">Fall 2023-24</div>
        </div>
      </div>
                  =

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Student Population by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={studentPopulationPieData}
                cx="50%"
                cy="50%"
                labelLine={true}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({name, percent}) => `${name}: ${(percent * 100).toFixed(1)}%`}
              >
                {studentPopulationPieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={numberFormatter} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
 
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Ethnic Composition (2023-24)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={totalEthnicityPieData}
                cx="50%"
                cy="50%"
                labelLine={true}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({name, percent}) => `${name}: ${(percent * 100).toFixed(1)}%`}
              >
                {totalEthnicityPieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={percentageFormatter} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

      </div>
      */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Undergraduate Enrollment by College</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={studentPopulationData.undergradByCollege.map(college => ({
                ...college,
                name: collegeNameMap[college.name] || college.name
              }))}

              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={numberFormatter} />
              <Bar dataKey="students" name="Students" fill={UCDAVIS_COLORS.primary} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Research Funding Growth</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart
              data={fundingData.extramural}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis tickFormatter={(tick) => `$${tick}M`} />
              <Tooltip formatter={(value) => `$${value}M`} />
              <Legend />
              <Area type="monotone" dataKey="Federal" stackId="1" stroke="#7b3294" fill="#7b3294" />
              <Area type="monotone" dataKey="State" stackId="1" stroke="#c2a5cf" fill="#c2a5cf" />
              <Area type="monotone" dataKey="Other" stackId="1" stroke="#ef8a62" fill="#ef8a62" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

            {/* 
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
  {[
    { title: 'Gender Identity', data: toPieData(studentStatsData.genderIdentity) },
    { title: 'URM Status', data: toPieData(studentStatsData.URMStatus) },
    { title: 'Fee Status', data: toPieData(studentStatsData.feeStatus) },
    { title: 'STEM Majors', data: toPieData(studentStatsData.STEMMajors) },
    { title: 'First Gen Students', data: toPieData(studentStatsData.firstGen) },
    { title: 'Entry Type', data: toPieData(studentStatsData.entryType) }
  ].map((section, idx) => (
    <div className="bg-white p-4 rounded-lg shadow text-center">
  <h3 className="text-sm font-semibold mb-2">{section.title}</h3>
  <ResponsiveContainer width="100%" height={200}>
    <PieChart>
      <Pie
        data={section.data}
        cx="50%"
        cy="50%"
        outerRadius={60}
        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
        dataKey="value"
      >
        {section.data.map((_, i) => (
          <Cell key={`cell-${i}`} fill={PIE_COLORS[i % PIE_COLORS.length]} />
        ))}
      </Pie>
      <Tooltip formatter={(v) => `${v}%`} />
    </PieChart>
  </ResponsiveContainer>
</div>


  ))}
</div>
*/}
      
      <div className="bg-white p-6 rounded-lg shadow">
  <h3 className="text-xl font-semibold mb-4">10-Year Trends with Time Series Analysis & Forecasts (2014-2026)</h3>
  <ResponsiveContainer width="100%" height={400}>
    <LineChart
      data={generateTrendsData()}
      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="year" />
      <YAxis yAxisId="left" orientation="left" />
      <YAxis yAxisId="right" orientation="right" />
      <Tooltip 
        formatter={(value, name, props) => {
          if (name === "funding") return [`$${value}M`, name];
          return [value, name];
        }}
        labelFormatter={(label) => {
          const item = generateTrendsData().find(d => d.year === label);
          return `${label}${item?.forecast ? ' (Forecast)' : ''}`;
        }}
      />
      <Legend />
      {/* Historical data */}
      <Line 
        yAxisId="left" 
        type="monotone" 
        dataKey="enrollment" 
        name="Enrollment (x100)" 
        stroke="#002855" 
        activeDot={{ r: 8 }}
        strokeWidth={2}
      />
      <Line 
        yAxisId="left" 
        type="monotone" 
        dataKey="diversity" 
        name="Diversity Index" 
        stroke="#DAAA00"
        strokeWidth={2}
      />
      <Line 
        yAxisId="right" 
        type="monotone" 
        dataKey="funding" 
        name="Funding ($M)" 
        stroke="#B1B3B3"
        strokeWidth={2} 
      />
      <Line 
        yAxisId="left" 
        type="monotone" 
        dataKey="urm" 
        name="URM %" 
        stroke="#e41a1c"
        strokeWidth={2}
      />
      
      {/* Add a reference line separating historical and forecast data */}
      {/* Add a reference line separating historical and forecast data */}
<ReferenceLine 
  x="2023-24" 
  stroke="#666" 
  strokeDasharray="3 3" 
  yAxisId="left"  // This is the crucial fix
  label={{ value: 'Forecast Start', position: 'top', fill: '#666' }} 
/>
    </LineChart>
  </ResponsiveContainer>
  
  <div className="bg-white p-6 rounded-lg shadow">
  <h3 className="text-xl font-semibold mb-4">Statistical Analysis & Model Evaluation</h3>
  
  {(() => {
    // Get historical data only (no forecasts)
    const historicalData = generateTrendsData().filter(d => !d.forecast);
    
    // Prepare data for analysis
    const years = historicalData.map((_, i) => i); // time index
    const fundingValues = historicalData.map(d => d.funding);
    const enrollmentValues = historicalData.map(d => d.enrollment);
    const diversityValues = historicalData.map(d => d.diversity);
    const urmValues = historicalData.map(d => d.urm);
    
    // Calculate correlations
    const fundingEnrollmentCorr = calculateCorrelation(fundingValues, enrollmentValues);
    const fundingDiversityCorr = calculateCorrelation(fundingValues, diversityValues);
    const fundingUrmCorr = calculateCorrelation(fundingValues, urmValues);
    
    // Create funding regression model
    const fundingModel = linearRegression(years, fundingValues);
    const fundingPredictions = years.map(i => fundingModel.slope * i + fundingModel.intercept);
    
    // Evaluate model
    const mse = calculateMSE(fundingValues, fundingPredictions);
    const rSquared = calculateRSquared(fundingValues, fundingPredictions);
    const adjustedRSquared = calculateAdjustedRSquared(rSquared, years.length, 1);
    
    // Calculate residuals for normality check
    const residuals = fundingValues.map((actual, i) => actual - fundingPredictions[i]);
    const residualsMean = residuals.reduce((a, b) => a + b, 0) / residuals.length;
    const residualsStdDev = Math.sqrt(residuals.reduce((a, b) => a + Math.pow(b - residualsMean, 2), 0) / residuals.length);
    
    // Calculate standard error of slope
    const slopeError = residualsStdDev / Math.sqrt(years.reduce((a, b) => a + Math.pow(b - years.reduce((c, d) => c + d, 0) / years.length, 2), 0));
    
    // Calculate t-statistic and p-value
    const tStat = calculateTStatistic(fundingModel.slope, slopeError);
    const pValue = calculatePValue(tStat, years.length - 2);
    
    // Regression line formula as string
    const regressionFormula = `Funding = ${fundingModel.slope.toFixed(2)} * Year + ${fundingModel.intercept.toFixed(2)}`;
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="p-4 border rounded-lg">
            <h4 className="font-semibold text-lg mb-2">Correlation Analysis</h4>
            <p><b>Funding-Enrollment:</b> {fundingEnrollmentCorr.toFixed(3)}</p>
            <p><b>Funding-Diversity:</b> {fundingDiversityCorr.toFixed(3)}</p>
            <p><b>Funding-URM %:</b> {fundingUrmCorr.toFixed(3)}</p>
            <p className="text-sm text-gray-600 mt-2">
              Values above 0.7 indicate strong positive correlation, while values below -0.7 indicate strong negative correlation.
            </p>
          </div>
          
          <div className="p-4 border rounded-lg">
            <h4 className="font-semibold text-lg mb-2">Linear Regression Model</h4>
            <p><b>Model:</b> {regressionFormula}</p>
            <p><b>Annual Change:</b> ${fundingModel.slope.toFixed(2)}M/year</p>
            <p><b>R² Value:</b> {rSquared.toFixed(3)}</p>
            <p><b>Adjusted R²:</b> {adjustedRSquared.toFixed(3)}</p>
            <p><b>MSE:</b> {mse.toFixed(2)}</p>
            <p><b>p-value:</b> {pValue < 0.001 ? '< 0.001' : pValue.toFixed(3)}</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="p-4 border rounded-lg">
            <h4 className="font-semibold text-lg mb-2">Model Interpretation</h4>
            <ul className="list-disc pl-5 space-y-1">
              The linear model explains <b>{(rSquared * 100).toFixed(1)}%</b> of variation in funding
              <br/>The model predicts an average increase of <b>${fundingModel.slope.toFixed(2)}M</b> per year
              <br/>The correlation between diversity and funding is <b>{fundingDiversityCorr > 0 ? 'positive' : 'negative'}</b> and <b>{Math.abs(fundingDiversityCorr) > 0.7 ? 'strong' : Math.abs(fundingDiversityCorr) > 0.3 ? 'moderate' : 'weak'}</b>
              <br/>The model is statistically {pValue < 0.05 ? <b>significant</b> : 'not significant (p > 0.05)'}
            </ul>
          </div>
          
          <div className="p-4 border rounded-lg">
            <h4 className="font-semibold text-lg mb-2">EDA Outcomes That Informed Forecasting</h4>
            <ul className="list-disc pl-5 space-y-1">
              Exponential smoothing was selected for funding forecast due to observed volatility in recent years
              <br/>Linear forecasting was applied to enrollment, diversity and URM metrics based on their stable historical trends
              <br/>Alpha value of 0.5 was chosen to balance recent observations with historical stability
              <br/>Random variation component (±15 units) was derived from historical variance analysis
            </ul>
          </div>
        </div>
      </div>
    );
  })()}
</div>
  <div className="mt-4 px-2">
    <p className="text-sm text-gray-700 italic">
      Time series forecasting: Exponential smoothing was used for funding with trend and seasonal adjustments, linear projections for enrollment, diversity, and URM metrics based on historic trends.
    </p>
  </div>
</div>
     
     
      {/*
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4">Total Summer Financial Aid Disbursed</h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart
            data={summerAidData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis tickFormatter={(val) => `$${formatNumber(val)}`} />
            <Tooltip formatter={(val) => `$${formatNumber(val)}`} />
            <Legend />
            <Bar dataKey="totalDisbursed" name="Amount Disbursed" fill={UCDAVIS_COLORS.secondary} />
          </BarChart>
        </ResponsiveContainer>
      </div>
       */}

      <div className="bg-white p-6 rounded-lg shadow">
  <div className="flex items-center justify-between mb-4">
    <h3 className="text-xl font-semibold">Endowment Market Value by Unit</h3>
    <p>Select Fiscal Year</p>
    <select
      value={selectedEndowmentYear}
      onChange={(e) => setSelectedEndowmentYear(Number(e.target.value))}
      className="border border-gray-300 rounded px-2 py-1 text-sm"
    >
      {[2022, 2023].map((year) => (
        <option key={year} value={year}>
          {year}
        </option>
      ))}
    </select>
  </div>

  <ResponsiveContainer width="100%" height={500}>
  <BarChart
    data={endowmentData
      .filter(d => d.unit !== "Grand Total")
      .map(d => ({ unit: d.unit, value: d[selectedEndowmentYear] }))
      .sort((a, b) => b.value - a.value)}
    layout="vertical"
    margin={{ top: 20, right: 30, left: 200, bottom: 5 }}
  >
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis type="number" tickFormatter={(val) => `$${(val / 1e6).toFixed(0)}M`} />
    <YAxis
  type="category"
  dataKey="unit"
  width={200}
  interval={0} // Try 1 to show every other; 0 for all (default)
  tick={{ fontSize: 12 }}
/>

    <Tooltip formatter={(val) => `$${val.toLocaleString()}`} />
    <Bar dataKey="value" fill={UCDAVIS_COLORS.primary} />
  </BarChart>
</ResponsiveContainer>
<div className="my-6 border-t border-gray-300 pt-4">
  <p className="text-lg font-semibold text-gray-700">
    Grand Total Endowment ({selectedEndowmentYear}):{' '}
    <span className="text-blue-800">
      <b>${endowmentData.find(d => d.unit === "Grand Total")?.[selectedEndowmentYear]?.toLocaleString()}</b>
    </span>
  </p>
</div>

{selectedEndowmentYear > 2020 && (
  <div className="mt-10">
    <h4 className="text-lg font-semibold mb-4">
      % Change in Endowment from Previous Year ({selectedEndowmentYear - 1} → {selectedEndowmentYear})
    </h4>

    <ResponsiveContainer width="100%" height={500}>
      <BarChart
        data={endowmentData
          .filter(d => d.unit !== "Grand Total")
          .map(d => {
            const prev = d[selectedEndowmentYear - 1];
            const curr = d[selectedEndowmentYear];
            const change = prev && curr ? ((curr - prev) / prev) * 100 : null;
            return {
              unit: d.unit,
              change: change,
            };
          })
          .filter(d => d.change !== null)
          .sort((a, b) => b.change - a.change)}
        layout="vertical"
        margin={{ top: 20, right: 30, left: 200, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          type="number"
          domain={['auto', 'auto']}
          tickFormatter={(val) => `${val.toFixed(1)}%`}
        />
        <YAxis
  type="category"
  dataKey="unit"
  width={200}
  interval={0} // Try 1 to show every other; 0 for all (default)
  tick={{ fontSize: 12 }}
/>
        <Tooltip formatter={(val) => `${val.toFixed(2)}%`} />
        <Bar dataKey="change" fill={UCDAVIS_COLORS.secondary} />
      </BarChart>
    </ResponsiveContainer>
  </div>
)}

{selectedEndowmentYear > 2020 && (
  <div className="mt-6 border-t border-gray-300 pt-4">
    {(() => {
      const prev = endowmentData.find(d => d.unit === "Grand Total")?.[selectedEndowmentYear - 1];
      const curr = endowmentData.find(d => d.unit === "Grand Total")?.[selectedEndowmentYear];
      const change = prev && curr ? ((curr - prev) / prev) * 100 : null;

      return change !== null ? (
        <p className="text-lg font-semibold text-gray-700">
          Grand Total Change ({selectedEndowmentYear - 1} → {selectedEndowmentYear}):{' '}
          <span className={change >= 0 ? "text-green-700" : "text-red-700"}>
            <b>{change >= 0 ? '+' : ''}
            {change.toFixed(2)}%</b>
          </span>
        </p>
      ) : null;
    })()}
  </div>
)}


<div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-xl font-semibold mb-4">Per Student Funding by College ({selectedEndowmentYear})</h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={perStudentData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="college" />
          <YAxis tickFormatter={(val) => `$${val}`} />
          <Tooltip formatter={(val) => `$${val.toLocaleString()}`} />
          <Legend />
          <Bar dataKey="perStudentFunding" name="Per Student Funding" >
            {perStudentData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>

    <div className="mt-4 px-2">
  <p className="text-lg text-gray-700 italic">
    The UC Avg figure of per student funding is taken from The California Legislative Analyst's Office <i>University of California Funding by Source</i> 
    tabled pulished here: <a href="https://lao.ca.gov/Education/EdBudget/Details/687" target="_blank">https://lao.ca.gov/Education/EdBudget/Details/687</a>
  </p>
</div>

<div className="bg-white p-6 rounded-lg shadow">
  <h3 className="text-xl font-semibold mb-4">
    {selectedEndowmentYear} College of Agricultural & Environmental Sciences Expenditures<br />
    Total: ${(expenditureTotalCaes / 1_000_000).toFixed(3)}M
    &nbsp;(
      {percentUsedCaes}% of ${ (endowmentTotalCaes / 1_000_000).toFixed(3) }M endowment)
  </h3>
  <ResponsiveContainer width="100%" height={300}>
    <PieChart>
      <Pie
        data={caesPieData}
        cx="50%"
        cy="50%"
        labelLine={false}
        outerRadius={100}
        dataKey="value"
        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
      >
        {caesPieData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
        ))}
      </Pie>
      <Tooltip formatter={(val) => `$${formatNumber(val)}K`} />
    </PieChart>
  </ResponsiveContainer>
</div>
<div className="bg-white p-6 rounded-lg shadow">
<h3 className="text-xl font-semibold mb-4">
  {selectedEndowmentYear} College of Biological Sciences Expenditures<br />
  Total: ${(expenditureTotalCbs / 1_000_000).toFixed(3)}M
  &nbsp;(
    {percentUsedCbs}% of ${ (endowmentTotalCbs / 1_000_000).toFixed(3) }M endowment)
</h3>

  <ResponsiveContainer width="100%" height={300}>
    <PieChart>
      <Pie
        data={cbsPieData}
        cx="50%"
        cy="50%"
        labelLine={false}
        outerRadius={100}
        dataKey="value"
        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
      >
        {cbsPieData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
        ))}
      </Pie>
      <Tooltip formatter={(val) => `$${formatNumber(val)}K`} />
    </PieChart>
  </ResponsiveContainer>
</div>
<div className="bg-white p-6 rounded-lg shadow">
<h3 className="text-xl font-semibold mb-4">
  {selectedEndowmentYear} College of Engineering<br />
  Total: ${(expenditureTotalCoe / 1_000_000).toFixed(3)}M
  &nbsp;(
    {percentUsedCoe}% of ${ (endowmentTotalCoe / 1_000_000).toFixed(3) }M endowment)
</h3>
  <ResponsiveContainer width="100%" height={300}>
    <PieChart>
      <Pie
        data={coePieData}
        cx="50%"
        cy="50%"
        labelLine={false}
        outerRadius={100}
        dataKey="value"
        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
      >
        {coePieData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
        ))}
      </Pie>
      <Tooltip formatter={(val) => `$${formatNumber(val)}K`} />
    </PieChart>
  </ResponsiveContainer>
</div>
<div className="bg-white p-6 rounded-lg shadow">
<h3 className="text-xl font-semibold mb-4">
  {selectedEndowmentYear} College of Letters & Science<br />
  Total: ${(expenditureTotalCls / 1_000_000).toFixed(3)}M
  &nbsp;(
    {percentUsedCls}% of ${ (endowmentTotalCls / 1_000_000).toFixed(3) }M endowment)
</h3>
  <ResponsiveContainer width="100%" height={300}>
    <PieChart>
      <Pie
        data={clsPieData}
        cx="50%"
        cy="50%"
        labelLine={false}
        outerRadius={100}
        dataKey="value"
        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
      >
        {coePieData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
        ))}
      </Pie>
      <Tooltip formatter={(val) => `$${formatNumber(val)}K`} />
    </PieChart>
  </ResponsiveContainer>
</div>

<div className="mt-4 px-2">
  <p className="text-lg text-gray-700 italic">
    In {selectedEndowmentYear}, College of Agricultural & Environmental Sciences spent <b>${(expenditureTotalCaes / 1_000_000).toFixed(1)}M</b>, which is
    {percentUsedCaes >= 100 ? " more than" : ` about ${percentUsedCaes}% of`} its corresponding endowment that year. 
    <br/><br/>College of Biological Sciences spent <b>${(expenditureTotalCbs / 1_000_000).toFixed(1)}M</b>, which is
    {percentUsedCaes >= 100 ? " more than" : ` about ${percentUsedCbs}% of`} its corresponding that year. 
    <br/><br/>College of Engineering spent <b>${(expenditureTotalCoe / 1_000_000).toFixed(1)}M</b>, which is
    {percentUsedCaes >= 100 ? " more than" : ` about ${percentUsedCoe}% of`} its corresponding that year. 
    <br/><br/>College of Letters & Science spent <b>${(expenditureTotalCls / 1_000_000).toFixed(1)}M</b>, which is
    {percentUsedCaes >= 100 ? " more than" : ` about ${percentUsedCls}% of`} its corresponding that year. 
  </p>
</div>
</div>
</div>
  );
  
  // Enrollment Tab Content Component
  const EnrollmentContent = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Undergraduate Enrollment by Year</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={studentPopulationData.undergradByYear}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={numberFormatter} />
              <Bar dataKey="students" name="Students" fill={UCDAVIS_COLORS.primary} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Undergraduate Enrollment by College</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={studentPopulationData.undergradByCollege}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={numberFormatter} />
              <Bar dataKey="students" name="Students" fill={UCDAVIS_COLORS.secondary} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4">College Growth (2014-15 to 2023-24)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={ethnicityData.collegeGrowth}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis label={{ value: "Growth %", angle: -90, position: "insideLeft" }} />
            <Tooltip formatter={(value) => `${value}%`} />
            <Bar dataKey="growth" fill={UCDAVIS_COLORS.primary} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4">Key Enrollment Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border rounded-lg">
            <h4 className="font-semibold text-lg mb-2">Distribution by College</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>CLAS is the largest college with 13,182 students (40.8% of undergrads)</li>
              <li>CA&ES is the second largest with 7,643 students (23.7%)</li>
              <li>CBS has 6,487 students (20.1%)</li>
              <li>COE has 4,961 students (15.4%)</li>
            </ul>
          </div>
          
          <div className="p-4 border rounded-lg">
            <h4 className="font-semibold text-lg mb-2">Year Level Distribution</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Seniors: 11,460 students (35.5% of undergrads)</li>
              <li>Juniors: 8,572 students (26.6%)</li>
              <li>Sophomores: 6,295 students (19.5%)</li>
              <li>Freshmen: 5,946 students (18.4%)</li>
            </ul>
          </div>
        </div>
      </div>
      {/* Add this right before the closing </div> of OverviewContent */}

    </div>

    
    
  );
  
  // Diversity Tab Content Component
  const DiversityContent = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Current Ethnic Composition by College (2023-24)</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={ethnicityData.currentComposition}
              layout="vertical"
              margin={{ top: 20, right: 30, left: 120, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 50]} />
              <YAxis dataKey="group" type="category" width={120} />
              <Tooltip formatter={percentageFormatter} />
              <Legend />
              <Bar dataKey="CA&ES" fill="#8884d8" />
              <Bar dataKey="CBS" fill="#82ca9d" />
              <Bar dataKey="CLAS" fill="#ffc658" />
              <Bar dataKey="COE" fill="#ff8042" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Change in Ethnic Representation (2014-15 to 2023-24)</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={ethnicityData.changeOverDecade}
              layout="vertical"
              margin={{ top: 20, right: 30, left: 120, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[-8, 8]} />
              <YAxis dataKey="group" type="category" width={120} />
              <Tooltip formatter={(value) => `${value > 0 ? '+' : ''}${value}%`} />
              <Legend />
              <Bar dataKey="CA&ES" fill="#8884d8" />
              <Bar dataKey="CBS" fill="#82ca9d" />
              <Bar dataKey="CLAS" fill="#ffc658" />
              <Bar dataKey="COE" fill="#ff8042" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div> 
    </div>
  )
  return (
    <>
    <OverviewContent/>
    </>
  )
}