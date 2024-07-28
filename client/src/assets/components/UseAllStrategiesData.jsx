// Example of a custom hook
import { useState, useEffect } from 'react';
import axios from 'axios';

const UseAllStrategiesData = () => {
  const [data, setData] = useState({
    Sniper_NF: 0,
    RSI_OP_Buying: 0,
    Shambhu_Algo: 0,
    Mahabuddi_Algo: 0,
    NF_Supertrend: 0,
    Suprita:0,
    Shambhu:0,
    Mahabuddhi:0,
    Vasuki:0,
    Delta_Netural:0


  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response1 = await axios.get('/api/trades/strategy1');
        const response2 = await axios.get('/api/trades/strategy2');
        const response3 = await axios.get('/api/trades/strategy3');
        const response4 = await axios.get('/api/trades/strategy4');
        const response5 = await axios.get('/api/trades/strategy5');
        const response6 = await axios.get('/api/trades/strategy6');
        const response7 = await axios.get('/api/trades/strategy7');
        const response8 = await axios.get('/api/trades/strategy8');
        const response9 = await axios.get('/api/trades/strategy9');
        const response10 = await axios.get('/api/trades/strategy10');

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
          Sniper_NF: calculateCumulativePL(response1.data),
          RSI_OP_Buying: calculateCumulativePL(response2.data),
          Shambhu_Algo: calculateCumulativePL(response3.data),
          Mahabuddi_Algo: calculateCumulativePL(response4.data),
          NF_Supertrend: calculateCumulativePL(response5.data),
          Suprita: calculateCumulativePL(response6.data),
          Shambhu: calculateCumulativePL(response7.data),
          Mahabuddhi: calculateCumulativePL(response8.data),
          Vasuki: calculateCumulativePL(response9.data),
          Delta_Netural: calculateCumulativePL(response10.data),
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
