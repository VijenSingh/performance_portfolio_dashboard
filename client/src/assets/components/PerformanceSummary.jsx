import React from "react";

export default function PerformanceSummary({ summary }) {
  return (
    <div style={styles.card}>
      <h2 style={styles.title}>Performance Summary</h2>
      <div style={styles.grid}>
        <KPI label="Maximum Profit" value={`₹ ${summary.maxProfit.toFixed(2)}`} positive />
        <KPI label="Maximum Loss" value={`₹ ${summary.maxLoss.toFixed(2)}`} negative />
        <KPI label="Profit Trades" value={summary.profitTrades} positive />
        <KPI label="Losing Trades" value={summary.losingTrades} negative />
        <KPI label="Max Drawdown (%)" value={`${summary.maxDrawdownPct.toFixed(2)}%`} negative />
        <KPI label="Max Drawdown (₹)" value={`₹ ${summary.maxDrawdownValue.toFixed(2)}`} negative />
        <KPI label="Peak Value" value={`₹ ${summary.peakValue.toFixed(2)}`} positive />
        <KPI label="Winning Streak" value={`${summary.winningStreak}`} positive />
        <KPI label="Losing Streak" value={`${summary.losingStreak}`} negative />

      </div>
    </div>
  );
}

function KPI({ label, value, positive, negative }) {
  return (
    <div
      style={{
        ...styles.kpiBox,
        ...(positive ? styles.kpiPositive : {}),
        ...(negative ? styles.kpiNegative : {}),
      }}
    >
      <div style={styles.kpiLabel}>{label}</div>
      <div
        style={{
          ...styles.kpiValue,
          ...(positive ? styles.kpiValuePositive : {}),
          ...(negative ? styles.kpiValueNegative : {}),
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
    color: "#555",
  },
  kpiValue: { fontSize: 20, fontWeight: 800 },
  kpiValuePositive: { color: "rgb(26, 142, 95)" }, // ✅ Green
  kpiValueNegative: { color: "rgb(255, 59, 48)" }, // ✅ Red
};
