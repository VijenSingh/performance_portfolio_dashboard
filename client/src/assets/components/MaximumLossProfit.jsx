import React, { useMemo } from "react";
import RankedStrategies from "./RankedStrategies";

/**
 * Advanced MaximumLossProfit component with an Equity Curve chart
 * - Shows Max Profit/Loss, trade counts
 * - Computes equity curve, peak, Max DD (₹) and (%)
 * - Renders a responsive, animated Recharts line chart with gradient stroke
 * - Shades the largest drawdown segment on the chart
 */

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceArea,
} from "recharts";

export default function MaximumLossProfit({ trades }) {
  if (!trades || trades.length === 0) return null;

  // --- Helpers ---
  const pl = (t) => (t.exitPrice - t.entryPrice) * t.quantity;

  // --- Aggregate metrics ---
  const maxProfit = Math.max(...trades.map(pl));
  const maxLoss = Math.min(...trades.map(pl));
  const profitTrades = trades.filter((t) => t.exitPrice > t.entryPrice).length;
  const losingTrades = trades.filter((t) => t.exitPrice < t.entryPrice).length;

  // --- Equity curve + Max Drawdown (₹ and %) ---
  const {
    equityData,
    peakValue,
    maxDrawdownValue,
    maxDrawdownPct,
    ddStartIndex,
    ddEndIndex,
  } = useMemo(() => {
    let cumulative = 0;
    const equity = trades.map((t, i) => {
      cumulative += pl(t);
      return { i, equity: Number(cumulative.toFixed(2)) };
    });

    let peak = equity[0]?.equity ?? 0;
    let maxDDValue = 0; // ₹
    let maxDDPct = 0; // %
    let ddStart = 0;
    let ddEnd = 0;

    equity.forEach((pt, idx) => {
      if (pt.equity > peak) {
        peak = pt.equity;
      }
      const ddValue = peak - pt.equity; // absolute ₹ drawdown
      const ddPct = peak !== 0 ? (ddValue / Math.abs(peak)) * 100 : 0; // percentage drawdown

      if (ddValue > maxDDValue) {
        maxDDValue = ddValue;
        maxDDPct = ddPct;
        // Find the most recent peak index for highlighting drawdown segment
        // Walk backward to locate the index where equity == current peak
        let pIdx = idx;
        for (let j = idx; j >= 0; j--) {
          if (equity[j].equity >= peak) {
            pIdx = j;
            break;
          }
        }
        ddStart = pIdx;
        ddEnd = idx;
      }
    });

    return {
      equityData: equity,
      peakValue: peak,
      maxDrawdownValue: Number(maxDDValue.toFixed(2)),
      maxDrawdownPct: Number(maxDDPct.toFixed(2)),
      ddStartIndex: ddStart,
      ddEndIndex: ddEnd,
    };
  }, [trades]);

  // Fancy tooltip formatter
  const tooltipFormatter = (value, name, props) => {
    if (name === "Equity") return [`₹${Number(value).toFixed(2)}`, "Equity"];
    return [value, name];
  };

  return (
    <div style={styles.pageWrap}>
      <div style={styles.card}>
        <div style={styles.headerRow}>
          <h2 style={styles.title}>Performance Summary</h2>
          <div style={styles.badge}>Advanced</div>
        </div>

        <div style={styles.kpiGrid}>
          <KPI label="Maximum Profit" value={`₹${maxProfit.toFixed(2)}`} positive />
          <KPI label="Maximum Loss" value={`₹${maxLoss.toFixed(2)}`} negative />
          <KPI label="Profit Trades" value={profitTrades} positive />
          <KPI label="Losing Trades" value={losingTrades} negative />
          <KPI label="Max Drawdown (%)" value={`${maxDrawdownPct.toFixed(2)}%`} negative />
          <KPI label="Max Drawdown (₹)" value={`₹${maxDrawdownValue.toFixed(2)}`} negative />
          <KPI label="Peak Value" value={`₹${peakValue.toFixed(2)}`} positive />
        </div>

        <div style={styles.chartWrap}>
          <div style={styles.chartHeader}>
            <h3 style={styles.chartTitle}>Equity Curve</h3>
            <p style={styles.subtleText}>Shaded region highlights the largest drawdown</p>
          </div>

          <div style={styles.chartCard}>
            {/* Gradient & glow via SVG defs inside chart */}
            <ResponsiveContainer width="100%" height={340}>
              <LineChart data={equityData} margin={{ top: 10, right: 16, bottom: 8, left: 0 }}>
                <defs>
                  <linearGradient id="equityStroke" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#1a8e5f" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#2e86de" stopOpacity={0.9} />
                  </linearGradient>
                  <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                <CartesianGrid strokeDasharray="3 6" opacity={0.3} />
                <XAxis dataKey="i" tick={{ fontSize: 12 }} tickMargin={6} />
                <YAxis tick={{ fontSize: 12 }} tickMargin={6} domain={["auto", "auto"]} />
                <Tooltip formatter={tooltipFormatter} labelFormatter={(i) => `Trade #${i}`} />

                {/* Shade the largest drawdown window */}
                {ddEndIndex > ddStartIndex && (
                  <ReferenceArea x1={ddStartIndex} x2={ddEndIndex} y1={"auto"} y2={"auto"} fill="#ff3b30" fillOpacity={0.07} />
                )}

                <Line
                  type="monotone"
                  dataKey="equity"
                  name="Equity"
                  stroke="url(#equityStroke)"
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 5 }}
                  style={{ filter: "url(#glow)" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 24 }}>
        <RankedStrategies />
      </div>

      {/* Decorative animated background */}
      <div style={styles.bgGrid} />
    </div>
  );
}

function KPI({ label, value, positive, negative }) {
  return (
    <div style={{
      ...styles.kpiBox,
      ...(positive ? styles.kpiPositive : {}),
      ...(negative ? styles.kpiNegative : {}),
    }}>
      <div style={styles.kpiLabel}>{label}</div>
      <div style={styles.kpiValue}>{value}</div>
    </div>
  );
}

// --- Inline styles (advanced CSS look without Tailwind) ---
const styles = {
  pageWrap: {
    position: "relative",
    padding: "48px 16px 64px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    minHeight: "100vh",
    background: "linear-gradient(180deg, #f6f9ff 0%, #fdfdfd 100%)",
  },
  card: {
    width: "min(100%, 980px)",
    background: "rgba(255,255,255,0.8)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    borderRadius: 24,
    border: "1px solid rgba(0,0,0,0.06)",
    boxShadow:
      "0 10px 30px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.6)",
    padding: 24,
  },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 800,
    letterSpacing: 0.2,
    margin: 0,
    color: "#1b1f24",
  },
  badge: {
    padding: "6px 12px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 700,
    background:
      "linear-gradient(90deg, rgba(26,142,95,0.1), rgba(46,134,222,0.1))",
    border: "1px solid rgba(26,142,95,0.25)",
    color: "#1a8e5f",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  kpiGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 16,
    marginTop: 12,
  },
  kpiBox: {
    background: "linear-gradient(180deg, #ffffff, #f8fbff)",
    border: "1px solid rgba(0,0,0,0.06)",
    borderRadius: 16,
    padding: 16,
    boxShadow: "0 6px 16px rgba(0,0,0,0.06)",
    transition: "transform 200ms ease, box-shadow 200ms ease",
  },
  kpiPositive: {
    outline: "1px solid rgba(26,142,95,0.18)",
  },
  kpiNegative: {
    outline: "1px solid rgba(255,59,48,0.18)",
  },
  kpiLabel: {
    fontSize: 12,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: 1,
    color: "#6b7280",
    marginBottom: 6,
  },
  kpiValue: {
    fontSize: 20,
    fontWeight: 800,
    color: "#0f172a",
  },
  chartWrap: {
    marginTop: 24,
  },
  chartHeader: {
    display: "flex",
    alignItems: "baseline",
    gap: 12,
    marginBottom: 8,
  },
  chartTitle: {
    margin: 0,
    fontSize: 20,
    fontWeight: 800,
    color: "#0f172a",
  },
  subtleText: {
    margin: 0,
    fontSize: 12,
    color: "#64748b",
  },
  chartCard: {
    position: "relative",
    borderRadius: 20,
    border: "1px solid rgba(0,0,0,0.06)",
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.9), rgba(248,251,255,0.9))",
    boxShadow: "0 10px 24px rgba(0,0,0,0.08)",
    padding: 8,
  },
  bgGrid: {
    position: "fixed",
    inset: 0,
    backgroundImage:
      "radial-gradient(circle at 20% 20%, rgba(26,142,95,0.08), transparent 35%), radial-gradient(circle at 80% 0%, rgba(46,134,222,0.08), transparent 35%), linear-gradient(transparent 0 98%, rgba(0,0,0,0.04) 99% )",
    backgroundSize: "1200px 1200px, 1000px 1000px, 28px 28px",
    pointerEvents: "none",
    zIndex: -1,
    animation: "floatGrad 18s ease-in-out infinite",
  },
};
