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
      <div className="strategy-selector">
        <label htmlFor="strategy">Select Strategy:</label>
        <select id="strategy" value={selectedStrategy} name="strategy" onChange={handleChange}>
          <option value="strategy1">Sniper NF</option>
          <option value="strategy2">RSI OP Buying</option>
          <option value="strategy3">Shambhu Algo</option>
          <option value="strategy4">Mahabuddi Algo</option>
          <option value="strategy5">NF Supertrend</option>
          <option value="strategy6">Suprita</option>
          <option value="strategy7">Shambhu</option>
          <option value="strategy8">Mahabuddhi</option>
          <option value="strategy9">Vasuki</option>
          <option value="strategy10">Delta Netural</option>

        </select>
      </div>
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
