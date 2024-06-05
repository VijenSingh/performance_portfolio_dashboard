import React from 'react';
import '../css/maximumLossProfit.css'
import RankedStrategies from './RankedStrategies';


function MaximumLossProfit({trades}) {

  if (!trades || trades.length === 0) return null;

  
  const maxProfit = Math.max(...trades.map(trade => (trade.exitPrice - trade.entryPrice) * trade.quantity));
  const maxLoss = Math.min(...trades.map(trade => (trade.exitPrice - trade.entryPrice) * trade.quantity));


  return (
    <div>
    <div style={styles.container}>
      <h2 style={styles.header}>Maximum Profit and Loss</h2>
      <p>Maximum Profit: <span style={styles.profitText}>₹{maxProfit.toFixed(2)}</span></p>
      <p>Maximum Loss: <span style={styles.profitText}>₹{maxLoss.toFixed(2)}</span></p>
      </div>
      <RankedStrategies/>
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
    width: '80%',
    maxWidth: '600px',
    padding: '20px',
    textAlign: 'center',
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    marginBottom: '20px',
    marginTop: '70px'
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

export default MaximumLossProfit;



