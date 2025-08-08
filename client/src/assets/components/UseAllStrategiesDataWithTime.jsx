import { useState, useEffect } from "react";
import axios from "axios";

const UseAllStrategiesDataWithTime = () => {
  const [data, setData] = useState({
    dates: [],
    strategies: {}
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data for all strategies
        const responses = await Promise.all([
          axios.get("/api/trades/strategy1"),
          axios.get("/api/trades/strategy2"),
          axios.get("/api/trades/strategy3"),
          axios.get("/api/trades/strategy4"),
          axios.get("/api/trades/strategy5"),
          axios.get("/api/trades/strategy6"),
          axios.get("/api/trades/strategy7"),
          axios.get("/api/trades/strategy8"),
          axios.get("/api/trades/strategy9"),
          axios.get("/api/trades/strategy10"),
          axios.get("/api/trades/strategy11"),
          axios.get("/api/trades/strategy12"),
          axios.get("/api/trades/strategy13"),
          axios.get("/api/trades/strategy14")
        ]);

        // Mapping strategy names
        const strategyNames = [
          "Sniper_NF",
          "Prop_Desk_Ce_04",
          "Prop_Desk_Ce_01",
          "CE_PE",
          "Range_Breakout",
          "Suprita",
          "Shambhu",
          "Mahabuddhi",
          "Vasuki",
          "NF_Selling_Long_Term",
          "VJS",
          "SK",
          "DNS",
          "SIM"
        ];

        // Helper function to calculate daily P&L
        const calculateDailyPL = (trades) => {
          const dailyPL = {};
          trades.forEach((trade) => {
            const date = trade.date; // Assuming each trade has a `date` field
            const profitLoss =
              (trade.exitPrice - trade.entryPrice) * trade.quantity;
            dailyPL[date] = (dailyPL[date] || 0) + profitLoss;
          });
          return dailyPL;
        };

        // Aggregate data for all strategies
        const strategiesData = {};
        const allDates = new Set();

        responses.forEach((response, index) => {
          const dailyPL = calculateDailyPL(response.data);
          strategiesData[strategyNames[index]] = dailyPL;

          // Collect all unique dates
          Object.keys(dailyPL).forEach((date) => allDates.add(date));
        });

        // Convert `allDates` to a sorted array
        const sortedDates = Array.from(allDates).sort();

        // Ensure all strategies have values for all dates (fill missing with 0)
        Object.keys(strategiesData).forEach((strategy) => {
          sortedDates.forEach((date) => {
            if (!strategiesData[strategy][date]) {
              strategiesData[strategy][date] = 0;
            }
          });
        });

        setData({
          dates: sortedDates,
          strategies: strategiesData
        });
      } catch (error) {
        console.error("Error fetching trade data:", error);
      }
    };

    fetchData();
  }, []);

  return data;
};

export default UseAllStrategiesDataWithTime;