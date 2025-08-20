import React, { useMemo } from "react";
import PerformanceSummary from "./PerformanceSummary";


export default function MaximumLossProfit({ trades }) {
  if (!trades || trades.length === 0) return null;

  const pl = (t) => (t.exitPrice - t.entryPrice) * t.quantity;

  const maxProfit = Math.max(...trades.map(pl));
  const maxLoss = Math.min(...trades.map(pl));
  const profitTrades = trades.filter((t) => t.exitPrice > t.entryPrice).length;
  const losingTrades = trades.filter((t) => t.exitPrice < t.entryPrice).length;

  const { equityData, peakValue, maxDrawdownValue, maxDrawdownPct, ddStartIndex, ddEndIndex } =
    useMemo(() => {
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
      };
    }, [trades]);

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
          
        }}
      />
    </div>
    </div>
  );
}

const styles = {
  pageWrap: {
    // padding: "48px 16px 64px",
    // display: "flex",
    // flexDirection: "column",
    // alignItems: "center",
    // minHeight: "100vh",
    // background: "linear-gradient(180deg, #f6f9ff 0%, #fdfdfd 100%)",

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
