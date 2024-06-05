import React from 'react';
import UseAllStrategiesData from './UseAllStrategiesData';

const RankedStrategies = () => {
  const data = UseAllStrategiesData();

  // Convert data object to an array of strategies with their profits
  const strategiesArray = Object.keys(data).map((key) => ({
    strategy: key,
    profit: data[key],
  }));

  // Sort the strategies by profit in descending order
  strategiesArray.sort((a, b) => b.profit - a.profit);

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Strategy Rankings by Profit</h2>
      <ul style={styles.list}>
        {strategiesArray.map((item) => (
          <li key={item.strategy} style={styles.listItem}>
            <span style={styles.strategyText}>{item.strategy}</span>
            <span style={styles.profitText}>Profit: ₹{item.profit.toFixed(2)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    textAlign: 'center',
    backgroundColor: '#f0f2f5',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    maxWidth: '600px',
    margin: 'auto',
  },
  header: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '20px',
  },
  list: {
    listStyleType: 'none',
    padding: 0,
  },
  listItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '15px',
    margin: '10px 0',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  strategyText: {
    fontSize: '18px',
    color: '#555',
  },
  profitText: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#1a8e5f',
  },
};

export default RankedStrategies;
