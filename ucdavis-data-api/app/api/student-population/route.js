// app/api/student-population/route.js

import { NextResponse } from 'next/server';

export async function GET() {
  // This is simplified data - replace with your actual student population data
  const studentPopulationData = {
    total: 32273,
    undergradByCollege: [
      { name: "CLAS", fullName: "College of Letters & Science", students: 13182 },
      { name: "CA&ES", fullName: "College of Agricultural & Environmental Sciences", students: 7643 },
      { name: "CBS", fullName: "College of Biological Sciences", students: 6487 },
      { name: "COE", fullName: "College of Engineering", students: 4961 }
    ],
    undergradByYear: [
      { name: "Freshman", students: 5946 },
      { name: "Sophomore", students: 6295 },
      { name: "Junior", students: 8572 },
      { name: "Senior", students: 11460 }
    ]
  };
  
  return NextResponse.json(studentPopulationData);
}