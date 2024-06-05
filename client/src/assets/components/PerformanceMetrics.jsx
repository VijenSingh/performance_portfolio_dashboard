import React from 'react';
import Portfolio from './Portfolio';

function PerformanceMetrics({ trades }) {
  if (!trades || trades.length === 0) return null;

  const totalTrades = trades.length;
  const totalProfit = trades.reduce((acc, trade) => {
    const profitLoss = (trade.exitPrice - trade.entryPrice) * trade.quantity;
    return acc + profitLoss;
  }, 0);

  const averageProfit = totalProfit / totalTrades;

  return (
    <div style={styles.outerContainer}>
      <div style={styles.container}>
        <h2 style={styles.header}>Performance Metrics</h2>
        <p>Total Trades: <span style={styles.profitText}>{totalTrades}</span></p>
        <p>
          Total Profit: <span style={styles.profitText}>₹{totalProfit.toFixed(2)}</span>
        </p>
        <p>
          Average Profit per Trade: <span style={styles.profitText}>₹{averageProfit.toFixed(2)}</span>
        </p>
      </div>
      <div style={styles.portfolioContainer}>
        <Portfolio investment={140000} />
      </div>
    </div>
  );
}

const styles = {
  outerContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '50px',
    padding: '20px',
  },
  container: {
    width: '100%',
    maxWidth: '600px',
    padding: '20px',
    textAlign: 'center',
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    marginBottom: '20px',
  },
  header: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '20px',
  },
  portfolioContainer: {
    width: '100%',
    maxWidth: '600px',
    padding: '20px',
    textAlign: 'center',
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  },
  profitText: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#1a8e5f',
  },
};

export default PerformanceMetrics;
