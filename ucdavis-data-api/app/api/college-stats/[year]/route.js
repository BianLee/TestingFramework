// app/api/college-stats/[year]/route.js

import { NextResponse } from 'next/server';
import endowmentData from '../../../../data/endowmentData';
// Import your other data modules as needed (student population, expenditures, etc.)

export async function GET(request, { params }) {
  const { year } = params;
  const yearNum = parseInt(year);
  
  if (isNaN(yearNum)) {
    return NextResponse.json(
      { error: 'Year must be a number' },
      { status: 400 }
    );
  }
  
  // Check if we have data for the requested year
  if (!endowmentData[0][yearNum]) {
    return NextResponse.json(
      { error: `No data found for year ${yearNum}` },
      { status: 404 }
    );
  }
  
  // Example college stats calculation
  // In a real implementation, you'd use actual expenditure data
  const findEndowment = (unitName) => {
    const row = endowmentData.find(d => d.unit === unitName);
    return row ? row[yearNum] || 0 : 0;
  };
  
  const collegeData = [
    {
      id: "caes",
      name: "College of Agricultural & Environmental Sciences",
      endowment: findEndowment("College of Agricultural & Environmental Sciences"),
      // Add other metrics like expenditure, students, etc.
    },
    {
      id: "cbs",
      name: "College of Biological Sciences",
      endowment: findEndowment("College of Biological Sciences"),
      // Add other metrics
    },
    {
      id: "coe",
      name: "College of Engineering",
      endowment: findEndowment("College of Engineering"),
      // Add other metrics
    },
    {
      id: "cls",
      name: "College of Letters & Science",
      endowment: findEndowment("College of Letters & Science"),
      // Add other metrics
    }
  ];
  
  // Add calculated fields as needed
  collegeData.forEach(college => {
    college.endowmentFormatted = `$${(college.endowment/1000000).toFixed(2)}M`;
  });
  
  return NextResponse.json(collegeData);
}