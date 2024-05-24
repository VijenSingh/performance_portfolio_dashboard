import React, { useState, useEffect } from 'react';
import TradeList from './assets/components/TradeList';
import PerformanceMetrics from './assets/components/PerformanceMetrics';
import MaximumLossProfit from './assets/components/MaximumLossProfit';
import TradeForm from './assets/components/TradeForm';
import DonutChart from './assets/components/DonutChart';
import axios from 'axios';
import './App.css';


function App() {
  const [selectedStrategy, setSelectedStrategy] = useState('strategy1');
  const [selectedTab, setSelectedTab] = useState('dataForm');
  const [strategyData, setStrategyData] = useState([]);

  const handleStrategySelect = (strategy) => {
    setSelectedStrategy(strategy);
  };

  useEffect(() => {
    fetchDataForStrategy(selectedStrategy);
  }, [selectedStrategy]);

  const fetchDataForStrategy = async (strategy) => {
    try {
      const response = await axios.get(`/api/trades/${strategy}`);
      setStrategyData(response.data);
    } catch (error) {
      console.error('Error fetching trade data:', error);
    }
  };

  const handleChange = (e) => {
    setSelectedStrategy(e.target.value);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Portfolio Performance Dashboard</h1>
        <a href='#' onClick={() => setSelectedTab('dashboard')}>Dashboard</a>
        <a href='#' onClick={() => setSelectedTab('dataForm')}>DataForm</a>
      </header>
      <label>Select Strategy:</label>
      <select value={selectedStrategy} name="strategy" onChange={handleChange}>
        <option value="strategy1">Strategy 1</option>
        <option value="strategy2">Strategy 2</option>
        <option value="strategy3">Strategy 3</option>
      </select>
      <div className="container">
        {selectedTab === "dataForm" ? (
          <TradeForm onAddTrade={() => fetchDataForStrategy(selectedStrategy)} selectedStrategy={selectedStrategy} />
        ) : (
          <>
            <TradeList trades={strategyData} selectedStrategy={selectedStrategy} setTrades={setStrategyData}/>
            <PerformanceMetrics trades={strategyData} />
            <MaximumLossProfit trades={strategyData} />
            <DonutChart  title={"All Strategies Data"} />
          </>
        )}
      </div>
    </div>
  );
}

export default App;
