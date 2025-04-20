// App.js
import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { UCDavisDashboard } from './Hello';
import VotingSection from './vote';

function App() {
  return (
    <BrowserRouter>
    <center>
      <div className="min-h-screen bg-gray-50">
        {/* Navigation bar */}
        <nav className="bg-blue-900 text-white p-4">
          <div className="container mx-auto flex items-center justify-between">
            <Link to="/" className="text-xl font-bold">FundFlow</Link>
            <div className="space-x-4">
              <Link to="/vote" className="hover:underline">Vote</Link>
            </div>
          </div>
        </nav>
        
        {/* Main content with same container as your dashboard */}
        <div className="container mx-auto py-6 px-4">
          <Routes>
            <Route path="/" element={<UCDavisDashboard />} />
            <Route path="/vote" element={<VotingSection />} />
          </Routes>
        </div>
      </div>
      </center>
    </BrowserRouter>
  );
}

export default App;