// Example of a custom hook
import { useState, useEffect } from 'react';
import axios from 'axios';

const UseAllStrategiesData = () => {
  const [data, setData] = useState({
    Spiner_NF: 0,
    RSI_OP_Buying: 0,
    Brahmastra: 0,
    Golden_Cross: 0,
    NF_Supertrend: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response1 = await axios.get('/api/trades/strategy1');
        const response2 = await axios.get('/api/trades/strategy2');
        const response3 = await axios.get('/api/trades/strategy3');
        const response4 = await axios.get('/api/trades/strategy4');
        const response5 = await axios.get('/api/trades/strategy5');

        // Calculate cumulative PL for each strategy
        const calculateCumulativePL = (trades) => {
          let cumulativePL = 0;
          trades.forEach((trade) => {
            const profitLoss = parseFloat(
              ((trade.exitPrice - trade.entryPrice) * parseInt(trade.quantity)).toFixed(2)
            );
            cumulativePL += profitLoss;
          });
          return cumulativePL;
        };

        setData({
          Spiner_NF: calculateCumulativePL(response1.data),
          RSI_OP_Buying: calculateCumulativePL(response2.data),
          Brahmastra: calculateCumulativePL(response3.data),
          Golden_Cross: calculateCumulativePL(response4.data),
          NF_Supertrend: calculateCumulativePL(response5.data),
        });
      } catch (error) {
        console.error('Error fetching trade data:', error);
      }
    };

    fetchData();
  }, []);

  return data;
};

export default UseAllStrategiesData;
