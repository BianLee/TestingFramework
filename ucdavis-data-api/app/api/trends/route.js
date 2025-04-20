// app/api/trends/route.js

import { NextResponse } from 'next/server';

export async function GET() {
  // Historical data only
  const historicalData = [
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

  const result = {
    metadata: {
      description: "UC Davis historical trends data",
      lastUpdated: "2023-12-01",
      metrics: {
        enrollment: "Total student enrollment",
        diversity: "Diversity index (0-100)",
        funding: "Research funding in millions ($M)",
        urm: "Underrepresented minority percentage"
      }
    },
    data: historicalData
  };

  return NextResponse.json(result);
}