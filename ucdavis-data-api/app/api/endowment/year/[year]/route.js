// app/api/endowment/year/[year]/route.js

import { NextResponse } from 'next/server';
import endowmentData from '../../../../../data/endowmentData';

export async function GET(request, { params }) {
  const { year } = params;
  const yearNum = parseInt(year);
  
  if (isNaN(yearNum)) {
    return NextResponse.json(
      { error: 'Year must be a number' }, 
      { status: 400 }
    );
  }
  
  const yearData = endowmentData.map(item => ({
    unit: item.unit,
    value: item[yearNum] || null
  })).filter(item => item.value !== null);
  
  if (yearData.length === 0) {
    return NextResponse.json(
      { error: `No data found for year ${yearNum}` },
      { status: 404 }
    );
  }
  
  return NextResponse.json(yearData);
}