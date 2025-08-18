import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import UseAllStrategiesData from "./UseAllStrategiesData";

const COLORS = ['#00FFFF', '#36A2EB', '#FFCE56','#8fce00','#FF69B4','#FF3C33','#581845','#4F5F52','#0A4949','#F1820C'];

const DonutChartRecharts = ({ title }) => {
  const data = UseAllStrategiesData();
  
  const chartData = Object.keys(data).map((key, index) => ({
    name: key,
    value: Number(data[key]),
  }));

  return (
    <div style={{ width: '400px', height: '400px' }}>
      <h3 style={{ textAlign: 'center', marginBottom: 16 }}>{title}</h3>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={80}
            outerRadius={120}
            label={false} // 2 decimal places
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => value.toFixed(2)} /> 
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DonutChartRecharts;
