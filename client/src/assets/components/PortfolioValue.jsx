import React from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { Tooltip as ReactTooltip } from "react-tooltip";
import "../css/heatmap.css";

const PortfolioValue = ({ data }) => {
  const { dates, strategies } = data;

  // Generate heatmap data
  const heatmapData = dates.map((date) => {
    let totalValue = 0;

    Object.keys(strategies).forEach((strategy) => {
      const strategyData = strategies[strategy];
      if (strategyData[date] !== undefined) {
        totalValue += strategyData[date];
      }
    });

    return {
      date: date,
      value: totalValue,
    };
  });

  const today = new Date();
  const startDate = new Date("2024-01-01");

  // Fill in all months and their totals
  const allMonths = Array.from({ length: 12 }, (_, i) =>
    new Date(2024, i).toLocaleString("default", { month: "short", year: "numeric" })
  );

  const monthlyTotals = allMonths.reduce((acc, month) => {
    acc[month] = 0; // Initialize all months with 0
    return acc;
  }, {});

  heatmapData.forEach((item) => {
    const month = new Date(item.date).toLocaleString("default", { month: "short", year: "numeric" });
    monthlyTotals[month] += item.value;
  });

  const months = Object.keys(monthlyTotals);

  return (
    <div style={{ width: "100%", padding: "20px", margin: "40px" }}>
      <h2>Daywise Breakdown</h2>
      <div style={{ overflowX: "auto" }}>
        <CalendarHeatmap
          startDate={startDate}
          endDate={today}
          values={heatmapData}
          gutterSize={5}
          horizontal={true}
          classForValue={(value) => {
            if (!value) return "color-empty";
            if (value.value > 0) return "color-green";
            if (value.value < 0) return "color-red";
            return "color-empty";
          }}
          tooltipDataAttrs={(value) => ({
            "data-tooltip-id": "heatmap-tooltip",
            "data-tooltip-content":
              value && value.value !== null && value.value !== undefined
                ? `${value.date}: ${value.value}`
                : `${value ? value.date : "No Date"}`,
          })}
          showWeekdayLabels={true}
        />
        {/* Custom Month Labels */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginLeft: "30px",
            marginTop: "-20px", // Adjust positioning
          }}
        >
          {months.map((month, index) => (
            <div key={index} style={{ textAlign: "center", width: "7.5%" }}>
              <div style={{ marginBottom: "5px" }}>{month}</div>
            </div>
          ))}
        </div>
        {/* Monthly Totals */}
        <div style={{ display: "flex", justifyContent: "space-between", marginLeft: "30px" }}>
          {months.map((month, index) => (
            <div key={index} style={{ textAlign: "center", width: "7.5%" }}>
              <span>{monthlyTotals[month].toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>
      <ReactTooltip id="heatmap-tooltip" />
    </div>
  );
};

export default PortfolioValue;
