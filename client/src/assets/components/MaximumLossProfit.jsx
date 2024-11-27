import React from 'react';
import '../css/maximumLossProfit.css';
import RankedStrategies from './RankedStrategies';

function MaximumLossProfit({ trades }) {
  if (!trades || trades.length === 0) return null;

  const maxProfit = Math.max(...trades.map(trade => (trade.exitPrice - trade.entryPrice) * trade.quantity));
  const maxLoss = Math.min(...trades.map(trade => (trade.exitPrice - trade.entryPrice) * trade.quantity));

  const profitTrades = trades.filter(trade => trade.exitPrice > trade.entryPrice).length;
  const losingTrades = trades.filter(trade => trade.exitPrice < trade.entryPrice).length;

  // Calculate equity curve
  let cumulative = 0;
  const equityCurve = trades.map(trade => {
    cumulative += (trade.exitPrice - trade.entryPrice) * trade.quantity;
    return cumulative;
  });

  let peak = equityCurve[0];
  let maxDrawdown = 0; // Percentage drawdown
  let maxDrawdownValue = 0; // Absolute monetary drawdown

  equityCurve.forEach(value => {
    if (value > peak) {
      peak = value; // Update peak
    }
    const drawdown = peak - value; // Absolute drawdown in ₹
    const drawdownPercentage = (drawdown / peak) * 100; // Drawdown in %
    if (drawdownPercentage > maxDrawdown) {
      maxDrawdown = drawdownPercentage; // Update max percentage drawdown
      maxDrawdownValue = drawdown; // Update max absolute drawdown
    }
  });

  return (
    <div>
      <div style={styles.container}>
        <h2 style={styles.header}>Maximum Profit and Loss</h2>
        <p>Maximum Profit: <span style={styles.profitText}>₹{maxProfit.toFixed(2)}</span></p>
        <p>Maximum Loss: <span style={styles.lossText}>₹{maxLoss.toFixed(2)}</span></p>
        <p>Number of Profit Trades: <span style={styles.profitText}>{profitTrades}</span></p>
        <p>Number of Losing Trades: <span style={styles.lossText}>{losingTrades}</span></p>
        <p>Maximum Drawdown(%): <span style={styles.lossText}>{maxDrawdown.toFixed(2)}%</span></p>
        <p>Maximum Drawdown (₹): <span style={styles.lossText}>₹{maxDrawdownValue.toFixed(2)}</span></p>
        <p>Peak Value: <span style={styles.profitText}>₹{peak.toFixed(2)}</span></p>
      </div>
      <RankedStrategies />
    </div>
  );
}

const styles = {
  container: {
    width: '80%',
    maxWidth: '600px',
    padding: '20px',
    textAlign: 'center',
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    marginBottom: '20px',
    marginTop: '70px',
  },
  header: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '20px',
  },
  profitText: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#1a8e5f',
  },
  lossText: {
    color: 'red',
    fontWeight: 'bold',
  },
};

export default MaximumLossProfit;
