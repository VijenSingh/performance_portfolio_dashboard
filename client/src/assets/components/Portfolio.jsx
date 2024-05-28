import React from 'react';
import useAllStrategiesData from './UseAllStrategiesData';

const Portfolio = ({investment}) => {
  const data = useAllStrategiesData();

  // Sum the final cumulative profit/loss of all strategies
  const totalProfitLoss =
    data.Spiner_NF +
    data.RSI_OP_Buying +
    data.Brahmastra +
    data.Golden_Cross +
    data.NF_Supertrend;

  // Calculate the percentage return
  const percentageReturn = ((totalProfitLoss / investment) * 100).toFixed(2);

  return (
    <div>
      <h2>Portfolio Summary</h2>
      <p>Total Profit/Loss: {totalProfitLoss.toFixed(2)}</p>
      <p>Percentage Return: {percentageReturn}%</p>
    </div>
  );
};

export default Portfolio;
