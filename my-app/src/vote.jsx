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

const VotingSection = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedEndowmentYear, setSelectedEndowmentYear] = useState(2023);
  const PIE_COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#8dd1e1', '#a4de6c'];

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

  export default VotingSection