
import { Doughnut } from 'react-chartjs-2';
import UseAllStrategiesData from './UseAllStrategiesData';

const DonutChart = ({  title }) => {

    const data = UseAllStrategiesData(); 
  const chartData = {
    labels: Object.keys(data),
    datasets: [
      {
        data: Object.values(data).map(Number),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56','#8fce00','#FF69B4'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#8fce00', '#FF69B4'],
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
