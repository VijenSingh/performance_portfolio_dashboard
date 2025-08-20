import React, { useState, useEffect } from 'react';
import TradeList from './assets/components/TradeList';
import PerformanceMetrics from './assets/components/PerformanceMetrics';
import MaximumLossProfit from './assets/components/MaximumLossProfit';
import TradeForm from './assets/components/TradeForm';
import DonutChart from './assets/components/DonutChart';
import axios from 'axios';
import './App.css';
import PortfolioValue from './assets/components/PortfolioValue';
import UseAllStrategiesDataWithTime from './assets/components/UseAllStrategiesDataWithTime';
import PerformanceTables from './assets/components/PerformanceTables';
import Portfolio from './assets/components/Portfolio';
import RankedStrategies from './assets/components/RankedStrategies';



function App() {
  const [selectedStrategy, setSelectedStrategy] = useState('strategy1');
  const [selectedTab, setSelectedTab] = useState('dataForm');
  const [strategyData, setStrategyData] = useState([]);
  //const timeSeriesData = UseAllStrategiesDataWithTime();
   const { dates, strategies } = UseAllStrategiesDataWithTime();

  // Transform `strategies` into heatmap format
  // const heatmapData = Object.keys(strategies).map((strategy) => ({
  //   strategy,
  //   ...strategies[strategy]
  // }));
 
  useEffect(() => {

    fetchDataForStrategy(selectedStrategy);
  }, [selectedStrategy]);

  const fetchDataForStrategy = async (strategy) => {
    try {
      const response = await axios.get(`/api/trades/${strategy}`);
     
      setStrategyData(response.data);
    } catch (error) {
      console.error('Error fetching trade data AppJsx:', error);
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
          <option value="strategy2">Prop Desk Ce-04</option>
          <option value="strategy3">Prop Desk Ce-01</option>
          <option value="strategy4">CE/PE</option>
          <option value="strategy5">BTC Daily Option Selling with SL</option>
          <option value="strategy6">Suprita</option>
          <option value="strategy7">Shambhu</option>
          <option value="strategy8">Mahabuddhi</option>
          <option value="strategy9">Vasuki</option>
          <option value="strategy10">OG BTC Daily Option Selling</option>
          <option value="strategy11">VJS</option>
          <option value="strategy12">SK</option>
          <option value="strategy13">DNS</option>
          <option value="strategy14">SIM</option>

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
           
           
              <Portfolio investment = {20000} />
               
                <div style={{ marginTop: "40px", zIndex: 2, position: "relative" }}>
                  <PerformanceTables trades={strategyData} />
                  </div>
                  <div style={{ marginTop: "40px", zIndex: 2, position: "relative" }}>
    <RankedStrategies />
  </div>
                <div style={{ marginTop: "40px", zIndex: 2, position: "relative" }}>
                   <DonutChart  title={"All Strategies Data"} />
                  </div>
               
           <div style={{ marginTop: "40px", zIndex: 2, position: "relative" }}>
                   <PortfolioValue data={{dates, strategies }}/>
                  </div>
           
           
           
           
           
          </>
        )}
      </div>
    </div>
  );
}

export default App;
