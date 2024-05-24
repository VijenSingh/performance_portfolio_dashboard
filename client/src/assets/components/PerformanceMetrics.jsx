import React from 'react';
import '../css/performanceMetrics.css'


function PerformanceMetrics({trades}) {

  if (!trades || trades.length === 0) return null;
  const totalTrades = trades.length;
  const totalProfit = trades.reduce((acc, trade) => {
    const profitLoss = (trade.exitPrice - trade.entryPrice) * trade.quantity;
    return acc + profitLoss;
  }, 0);
  
  const averageProfit = totalProfit / totalTrades;

  return (
    <div className="performance-metrics">
      <h2>Performance Metrics</h2>
      <p>Total Trades: {totalTrades}</p>
      <p>Total Profit: {totalProfit.toFixed(2)}</p>
      <p>Average Profit per Trade: {averageProfit.toFixed(2)}</p>
    </div>
  );
}

export default PerformanceMetrics;
