import React from 'react';
import useAllStrategiesData from './UseAllStrategiesData';

const Portfolio = ({investment}) => {
  const data = useAllStrategiesData();

  // Sum the final cumulative profit/loss of all strategies
  const totalProfitLoss =
    data.Spiner_NF +
    data.RSI_OP_Buying +
    data.Brahmastra +
    data.Golden_Cross +
    data.NF_Supertrend;

  // Calculate the percentage return
  const percentageReturn = ((totalProfitLoss / investment) * 100).toFixed(2);

  return (
    <div>
      <h2 style={styles.header}>Portfolio Summary</h2>
      <p>Total Profit/Loss: <span style={styles.profitText}>₹{totalProfitLoss.toFixed(2)}</span></p>
      <p>Percentage Return: <span style={styles.profitText}>{percentageReturn}%</span></p>
    </div>
  );
};


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


export default Portfolio;
