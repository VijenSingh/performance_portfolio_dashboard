import React, { useMemo } from "react";
import {
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceArea,
} from "recharts";
import PerformanceSummary from "./PerformanceSummary";

export default function MaximumLossProfit({ trades }) {
  if (!trades || trades.length === 0) return null;

  const pl = (t) => (t.exitPrice - t.entryPrice) * t.quantity;

  const {
    equityData,
    peakValue,             // ultimate peak across whole period
    maxDrawdownValue,      // absolute drop (local peak -> trough)
    maxDrawdownPct,        // % of ultimate peak  (this will be 18.23% for your data)
    ddStartIndex,
    ddEndIndex,
    winningStreak,
    losingStreak,
  } = useMemo(() => {
    // --- 1) Build cumulative equity (use high precision for math; round only for display) ---
    let cumulative = 0;
    const equity = trades.map((t, i) => {
      const profit = pl(t);
      cumulative += profit;
      return { i, equity: cumulative }; // keep raw
    });

    // If somehow no equity points (defensive)
    if (equity.length === 0) {
      return {
        equityData: [],
        peakValue: 0,
        maxDrawdownValue: 0,
        maxDrawdownPct: 0,
        ddStartIndex: 0,
        ddEndIndex: 0,
        winningStreak: 0,
        losingStreak: 0,
      };
    }

    // --- 2) Winning / Losing streaks ---
    let currentWin = 0, maxWin = 0;
    let currentLose = 0, maxLose = 0;
    trades.forEach((t) => {
      const p = pl(t);
      if (p > 0) {
        currentWin += 1;
        currentLose = 0;
        if (currentWin > maxWin) maxWin = currentWin;
      } else if (p < 0) {
        currentLose += 1;
        currentWin = 0;
        if (currentLose > maxLose) maxLose = currentLose;
      } else {
        currentWin = 0;
        currentLose = 0;
      }
    });

    // --- 3) Max Drawdown (value) with start/end indices (local peak -> trough) ---
    let runningPeak = equity[0].equity;
    let runningPeakIdx = 0;
    let bestDD = 0;
    let ddStart = 0;
    let ddEnd = 0;

    for (let i = 0; i < equity.length; i++) {
      const eq = equity[i].equity;

      if (eq > runningPeak) {
        runningPeak = eq;
        runningPeakIdx = i;
      }

      const dd = runningPeak - eq; // drop from latest peak
      if (dd > bestDD) {
        bestDD = dd;
        ddStart = runningPeakIdx;
        ddEnd = i;
      }
    }

    // --- 4) Ultimate peak (whole period ka highest equity) ---
    const ultimatePeak = Math.max(...equity.map((e) => e.equity));

    // --- 5) Max DD % as a % of ULTIMATE PEAK (gives 18.23% for your data) ---
    const maxDDPctUltimate = ultimatePeak !== 0 ? (bestDD / ultimatePeak) * 100 : 0;

    // --- 6) Prepare equityData for chart (include per-point peakSoFar for drawdown area) ---
    let peakSoFar = equity[0].equity;
    const equityForChart = equity.map((pt) => {
      if (pt.equity > peakSoFar) peakSoFar = pt.equity;
      return {
        i: pt.i,
        equity: Number(pt.equity.toFixed(2)),
        peakSoFar: Number(peakSoFar.toFixed(2)),
      };
    });

    return {
      equityData: equityForChart,
      peakValue: Number(ultimatePeak.toFixed(2)),
      maxDrawdownValue: Number(bestDD.toFixed(2)),
      maxDrawdownPct: Number(maxDDPctUltimate.toFixed(2)), // << this is now 18.23 for your data
      ddStartIndex: ddStart,
      ddEndIndex: ddEnd,
      winningStreak: maxWin,
      losingStreak: maxLose,
    };
  }, [trades]);

  // Other summary stats
  const maxProfit = Math.max(...trades.map(pl), 0);
  const maxLoss = Math.min(...trades.map(pl), 0);
  const profitTrades = trades.filter((t) => pl(t) > 0).length;
  const losingTrades = trades.filter((t) => pl(t) < 0).length;

  // Chart data (drawdown relative to local peak)
  const chartData = equityData.map((d) => ({
    i: d.i,
    equity: d.equity,
    drawdown: Number((d.peakSoFar - d.equity).toFixed(2)),
  }));

  return (
    <div style={styles.pageWrap}>
      <div style={styles.container}>
        <PerformanceSummary
          summary={{
            maxProfit,
            maxLoss,
            profitTrades,
            losingTrades,
            maxDrawdownPct,
            maxDrawdownValue,
            peakValue,
            winningStreak,
            losingStreak,
          }}
        />

        <h3 style={{ marginTop: 30 }}>Equity Curve</h3>
        <AreaChart
          width={500}
          height={260}
          data={chartData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorEquity" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4caf50" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#4caf50" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorDrawdown" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f44336" stopOpacity={0.6} />
              <stop offset="95%" stopColor="#f44336" stopOpacity={0} />
            </linearGradient>
          </defs>

          <XAxis dataKey="i" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />

          {/* Drawdown area */}
          <Area
            type="monotone"
            dataKey="drawdown"
            stroke="#f44336"
            fill="url(#colorDrawdown)"
          />

          {/* Equity line */}
          <Line
            type="monotone"
            dataKey="equity"
            stroke="#4caf50"
            strokeWidth={2}
            dot={false}
          />

          {/* Highlight max DD window */}
          {ddStartIndex !== ddEndIndex && (
            <ReferenceArea
              x1={ddStartIndex}
              x2={ddEndIndex}
              strokeOpacity={0.3}
              fill="#d32f2f"
              fillOpacity={0.2}
            />
          )}
        </AreaChart>
      </div>
    </div>
  );
}

const styles = {
  pageWrap: {
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
