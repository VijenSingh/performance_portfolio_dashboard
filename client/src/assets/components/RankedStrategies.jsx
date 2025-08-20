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
    <div style={styles.card}>
      <h2 style={styles.title}>Strategy Rankings by Profit</h2>
      <div style={styles.grid}>
        {strategiesArray.map((item) => (
          <div
            key={item.strategy}
            style={{
              ...styles.kpiBox,
              ...(item.profit >= 0 ? styles.kpiPositive : styles.kpiNegative),
            }}
          >
            <div style={styles.kpiLabel}>{item.strategy}</div>
            <div
              style={{
                ...styles.kpiValue,
                ...(item.profit >= 0 ? styles.kpiValuePositive : styles.kpiValueNegative),
              }}
            >
              ₹{item.profit.toFixed(2)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  card: {
    background: "linear-gradient(180deg, #ffffff, #f8fbff)",
    border: "1px solid rgba(0,0,0,0.06)",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    boxShadow: "0 6px 16px rgba(0,0,0,0.06)",
    textAlign: "left",
  },
  title: { fontSize: 22, fontWeight: 800, marginBottom: 16, textAlign: "center" },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 16,
  },
  kpiBox: {
    background: "linear-gradient(180deg, #ffffff, #f8fbff)",
    border: "1px solid rgba(0,0,0,0.06)",
    borderRadius: 16,
    padding: 16,
    boxShadow: "0 6px 16px rgba(0,0,0,0.06)",
    textAlign: "center",
  },
  kpiPositive: { outline: "1px solid rgba(26,142,95,0.18)" },
  kpiNegative: { outline: "1px solid rgba(255,59,48,0.18)" },

  kpiLabel: {
    fontSize: 14,
    fontWeight: 700,
    textTransform: "uppercase",
    marginBottom: 8,
    color: "#555",
  },
  kpiValue: { fontSize: 20, fontWeight: 800 },
  kpiValuePositive: { color: "rgb(26, 142, 95)" }, // ✅ Green
  kpiValueNegative: { color: "rgb(255, 59, 48)" }, // ✅ Red
};

export default RankedStrategies;
