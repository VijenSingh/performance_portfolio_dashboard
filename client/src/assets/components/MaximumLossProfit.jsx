import React from 'react';
import '../css/maximumLossProfit.css'


function MaximumLossProfit({trades}) {

  if (!trades || trades.length === 0) return null;

  
  const maxProfit = Math.max(...trades.map(trade => (trade.exitPrice - trade.entryPrice) * trade.quantity));
  const maxLoss = Math.min(...trades.map(trade => (trade.exitPrice - trade.entryPrice) * trade.quantity));


  return (
    <div className="maximum-loss-profit">
      <h2>Maximum Profit and Loss</h2>
      <p>Maximum Profit: {maxProfit.toFixed(2)}</p>
      <p>Maximum Loss: {maxLoss.toFixed(2)}</p>
    </div>
  );
}

export default MaximumLossProfit;
