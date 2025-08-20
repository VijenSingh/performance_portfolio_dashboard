import React, { useMemo } from "react";
import PerformanceSummary from "./PerformanceSummary";

export default function MaximumLossProfit({ trades }) {
  if (!trades || trades.length === 0) return null;

  const pl = (t) => (t.exitPrice - t.entryPrice) * t.quantity;

  const {
    equityData,
    peakValue,
    maxDrawdownValue,
    maxDrawdownPct,
    ddStartIndex,
    ddEndIndex,
    winningStreak,
    losingStreak,
  } = useMemo(() => {
    let cumulative = 0;
    const equity = trades.map((t, i) => {
      cumulative += pl(t);
      return { i, equity: Number(cumulative.toFixed(2)) };
    });

    let peak = equity[0]?.equity ?? 0;
    let maxDDValue = 0;
    let maxDDPct = 0;
    let ddStart = 0;
    let ddEnd = 0;

    // Calculate winning and losing streaks
    let currentWinStreak = 0;
    let maxWinStreak = 0;
    let currentLoseStreak = 0;
    let maxLoseStreak = 0;

    trades.forEach((trade) => {
      const profit = pl(trade);
      if (profit > 0) {
        currentWinStreak += 1;
        currentLoseStreak = 0;
        if (currentWinStreak > maxWinStreak) {
          maxWinStreak = currentWinStreak;
        }
      } else if (profit < 0) {
        currentLoseStreak += 1;
        currentWinStreak = 0;
        if (currentLoseStreak > maxLoseStreak) {
          maxLoseStreak = currentLoseStreak;
        }
      } else {
        // If profit is 0 (neutral trade), reset both streaks
        currentWinStreak = 0;
        currentLoseStreak = 0;
      }
    });

    equity.forEach((pt, idx) => {
      if (pt.equity > peak) peak = pt.equity;
      const ddValue = peak - pt.equity;
      const ddPct = peak !== 0 ? (ddValue / Math.abs(peak)) * 100 : 0;
      if (ddValue > maxDDValue) {
        maxDDValue = ddValue;
        maxDDPct = ddPct;
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
      winningStreak: maxWinStreak,
      losingStreak: maxLoseStreak,
    };
  }, [trades]);

  const maxProfit = Math.max(...trades.map(pl));
  const maxLoss = Math.min(...trades.map(pl));
  const profitTrades = trades.filter((t) => t.exitPrice > t.entryPrice).length;
  const losingTrades = trades.filter((t) => t.exitPrice < t.entryPrice).length;

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