// Example of a custom hook
import { useState, useEffect } from 'react';
import axios from 'axios';

const UseAllStrategiesData = () => {
  const [data, setData] = useState({
    Sniper_NF: 0,
    Prop_Desk_Ce_04: 0,
    Prop_Desk_Ce_01: 0,
    CE_PE: 0,
    Range_Breakout: 0,
    Suprita:0,
    Shambhu:0,
    Mahabuddhi:0,
    Vasuki:0,
    NF_Selling_Long_Term:0,
    VJS:0,
    SK:0,
    DNS:0,
    SIM:0


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
        const response11 = await axios.get('/api/trades/strategy11');
        const response12 = await axios.get('/api/trades/strategy12');
        const response13 = await axios.get('/api/trades/strategy13');
        const response14 = await axios.get('/api/trades/strategy14');

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
          Prop_Desk_Ce_04: calculateCumulativePL(response2.data),
          Prop_Desk_Ce_01: calculateCumulativePL(response3.data),
          CE_PE: calculateCumulativePL(response4.data),
          Range_Breakout: calculateCumulativePL(response5.data),
          Suprita: calculateCumulativePL(response6.data),
          Shambhu: calculateCumulativePL(response7.data),
          Mahabuddhi: calculateCumulativePL(response8.data),
          Vasuki: calculateCumulativePL(response9.data),
          NF_Selling_Long_Term: calculateCumulativePL(response10.data),
          VJS: calculateCumulativePL(response11.data),
          SK: calculateCumulativePL(response12.data),
          DNS: calculateCumulativePL(response13.data),
          SIM: calculateCumulativePL(response14.data),

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
