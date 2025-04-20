// File: data/statisticsUtils.js

export const calculateCorrelation = (x, y) => {
    const n = x.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((a, b, i) => a + b * y[i], 0);
    const sumXX = x.reduce((a, b) => a + b * b, 0);
    const sumYY = y.reduce((a, b) => a + b * b, 0);
    
    return (n * sumXY - sumX * sumY) / 
      (Math.sqrt((n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY)));
  };
  
  export const linearRegression = (x, y) => {
    const n = x.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((a, b, i) => a + b * y[i], 0);
    const sumXX = x.reduce((a, b) => a + b * b, 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    
    return { slope, intercept };
  };
  
  export const calculateMSE = (actual, predicted) => {
    return actual.reduce((sum, yi, i) => sum + Math.pow(yi - predicted[i], 2), 0) / actual.length;
  };
  
  export const calculateRSquared = (actual, predicted) => {
    const mean = actual.reduce((a, b) => a + b, 0) / actual.length;
    const totalSS = actual.reduce((a, b) => a + Math.pow(b - mean, 2), 0);
    const residualSS = actual.reduce((a, b, i) => a + Math.pow(b - predicted[i], 2), 0);
    
    return 1 - (residualSS / totalSS);
  };
  
  export const calculateAdjustedRSquared = (rSquared, n, p) => {
    return 1 - ((1 - rSquared) * (n - 1) / (n - p - 1));
  };
  
  export const calculateTStatistic = (slope, slopeError) => {
    return slope / slopeError;
  };
  
  export const calculatePValue = (tStat, degFreedom) => {
    // Simplified p-value calculation
    // In a real implementation, you'd use a t-distribution table or function
    const absTStat = Math.abs(tStat);
    if (absTStat > 3.291) return 0.001;
    if (absTStat > 2.576) return 0.01;
    if (absTStat > 1.96) return 0.05;
    if (absTStat > 1.645) return 0.1;
    return 0.2;
  };