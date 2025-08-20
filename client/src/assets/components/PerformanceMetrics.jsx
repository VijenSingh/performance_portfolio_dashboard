import React from "react";

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
        <div style={styles.card}>
          <h2 style={styles.title}>Performance Metrics</h2>
          <div style={styles.grid}>
            <KPI label="Total Trades" value={totalTrades} />
            <KPI label="Total Profit" value={`₹${totalProfit.toFixed(2)}`} />
            <KPI
              label="Average Profit per Trade"
              value={`₹${averageProfit.toFixed(2)}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function KPI({ label, value }) {
  // ✅ Number निकालो (₹ aur % हटा के)
  const numericValue = parseFloat(value.toString().replace(/[₹,%]/g, ""));

  const isPositive = numericValue >= 0;

  return (
    <div
      style={{
        ...styles.kpiBox,
        ...(isPositive ? styles.kpiPositive : styles.kpiNegative),
      }}
    >
      <div style={styles.kpiLabel}>{label}</div>

      <div
        style={{
          ...styles.kpiValue,
          ...(isPositive ? styles.kpiValuePositive : styles.kpiValueNegative),
        }}
      >
        {value}
      </div>
    </div>
  );
}

const styles = {
  card: { marginBottom: 24 },
  title: { fontSize: 22, fontWeight: 800, marginBottom: 16 },
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
  },
  kpiPositive: { outline: "1px solid rgba(26,142,95,0.18)" },
  kpiNegative: { outline: "1px solid rgba(255,59,48,0.18)" },
  kpiLabel: {
    fontSize: 12,
    fontWeight: 700,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  kpiValue: { fontSize: 20, fontWeight: 800 },
  kpiValuePositive: { color: "rgb(26, 142, 95)" }, // ✅ Green
  kpiValueNegative: { color: "rgb(255, 59, 48)" }, // ✅ Red
  outerContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: "50px",
    padding: "20px",
  },
  container: {
    width: "100%",
    maxWidth: "600px",
    padding: "20px",
    textAlign: "center",
    backgroundColor: "#fff",
    borderRadius: "10px",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
    marginBottom: "20px",
  },
};

export default PerformanceMetrics;
