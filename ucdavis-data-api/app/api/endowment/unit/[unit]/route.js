// app/api/endowment/unit/[unit]/route.js

import { NextResponse } from 'next/server';
import endowmentData from "../../../../../data/endowmentData"

export async function GET(request, { params }) {
  const { unit } = params;
  
  // URL decoding for handling spaces and special characters in unit names
  const decodedUnit = decodeURIComponent(unit);
  
  // Case-insensitive search for the unit
  const unitData = endowmentData.find(item => 
    item.unit.toLowerCase() === decodedUnit.toLowerCase()
  );
  
  if (!unitData) {
    // Return 404 if unit not found
    return NextResponse.json(
      { error: `Unit "${decodedUnit}" not found` },
      { status: 404 }
    );
  }
  
  // Return the matching unit data
  return NextResponse.json(unitData);
}

// Optional: Support unit partial match
export async function POST(request) {
  const { searchTerm } = await request.json();
  
  if (!searchTerm || typeof searchTerm !== 'string') {
    return NextResponse.json(
      { error: 'Search term is required' },
      { status: 400 }
    );
  }
  
  // Find units that contain the search term (case-insensitive)
  const matchingUnits = endowmentData.filter(item =>
    item.unit.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  if (matchingUnits.length === 0) {
    return NextResponse.json(
      { error: `No units found matching "${searchTerm}"` },
      { status: 404 }
    );
  }
  
  return NextResponse.json(matchingUnits);
}