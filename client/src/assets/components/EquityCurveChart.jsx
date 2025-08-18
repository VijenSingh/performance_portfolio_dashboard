import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

function EquityCurveChart({ equityData }) {
  
     if (!equityData || equityData.length === 0) {
    return <div>No data available</div>;
  }
  return (
    <div style={styles.chartWrap}>
      <h3 style={styles.chartTitle}>📈 Equity Curve</h3>
      <div style={styles.chartCard}>
        <ResponsiveContainer width="100%" height={380}>
          <LineChart data={equityData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="date"
              tickFormatter={(date) =>
                new Date(date).toLocaleDateString("en-GB")
              }
              angle={-35}
              textAnchor="end"
              tick={{ fontSize: 12, fill: "#6B7280" }}
              height={60}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "#6B7280" }}
              tickFormatter={(val) => `₹${val}`}
            />
            <Tooltip
              formatter={(value) => [`₹${value}`, "Cumulative P/L"]}
              labelFormatter={(label) =>
                `Date: ${new Date(label).toLocaleDateString("en-GB")}`
              }
              contentStyle={{
                backgroundColor: "#fff",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                border: "1px solid #e5e7eb",
              }}
            />
            <Line
              type="monotone"
              dataKey="cumulativePL"
              stroke="#4B70C0"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6, stroke: "#1D4ED8", strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

const styles = {
  chartWrap: {
    width: "100%",
    marginTop: 24,
    padding: "0 12px",
  },
  chartTitle: {
    textAlign: "center",
    marginBottom: 16,
    fontSize: 20,
    fontWeight: 600,
    color: "#1F2937",
  },
  chartCard: {
    width: "100%",
    borderRadius: 16,
    border: "1px solid rgba(0,0,0,0.05)",
    background: "linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)",
    padding: 16,
    boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
  },
};

export default EquityCurveChart;
