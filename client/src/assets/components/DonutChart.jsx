import React,{useState,useEffect} from 'react';
import axios from 'axios';
import { Doughnut } from 'react-chartjs-2';

const DonutChart = ({  title }) => {

    const [strategyData1, setStrategyData1] = useState([]);
    const [strategyData2, setStrategyData2] = useState([]);
    const [strategyData3, setStrategyData3] = useState([]);

    const fetchDataForStrategy = async (strategy) => {
        try {
          const response = await axios.get(`/api/trades/${strategy}`);
          if(strategy === "strategy1"){
          setStrategyData1(response.data);
          }
          else if(strategy === "strategy2"){
            setStrategyData2(response.data);
            }
            else
            setStrategyData3(response.data);
        } catch (error) {
          console.error('Error fetching trade data:', error);
        }
      };

      useEffect(() => {
        fetchDataForStrategy('strategy1');
        fetchDataForStrategy('strategy2');
        fetchDataForStrategy('strategy3');
      }, []);
      
      const calculateCumulativePL = (trades) => {
        let cumulativePL = 0;
        return trades.map((trade) => {
          const profitLoss = parseFloat(((trade.exitPrice - trade.entryPrice) * parseInt(trade.quantity)).toFixed(2));
          cumulativePL += profitLoss;
          return  cumulativePL;
        });
      };
     const roi_one =  calculateCumulativePL(strategyData1)
     const roi_two =  calculateCumulativePL(strategyData2)
     const roi_three =  calculateCumulativePL(strategyData3)
     const roi_one1 = roi_one[roi_one.length-1]
     const roi_one2 = roi_two[roi_two.length-1]
     const roi_one3 = roi_three[roi_three.length-1]
      const data={strategy1: roi_one1, strategy2: roi_one2, strategy3: roi_one3}
    
  const chartData = {
    labels: Object.keys(data),
    datasets: [
      {
        data: Object.values(data).map(Number),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: title,
      },
    },
  };

  return (
    <div style={{ position: 'relative', height: '400px', width: '400px' }}>
      <Doughnut data={chartData} options={options} />
    </div>
  );
};

export default DonutChart;
