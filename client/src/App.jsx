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
  const [isLoading, setIsLoading] = useState(false);
  const { dates, strategies } = UseAllStrategiesDataWithTime();

  useEffect(() => {
    fetchDataForStrategy(selectedStrategy);
  }, [selectedStrategy]);

  const fetchDataForStrategy = async (strategy) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`/api/trades/${strategy}`);
      setStrategyData(response.data);
    } catch (error) {
      console.error('Error fetching trade data AppJsx:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setSelectedStrategy(e.target.value);
  };

  const strategyOptions = [
    { value: "strategy1", label: "Sniper NF" },
    { value: "strategy2", label: "Prop Desk Ce-04" },
    { value: "strategy3", label: "Prop Desk Ce-01" },
    { value: "strategy4", label: "CE/PE" },
    { value: "strategy5", label: "BTC Daily Option Selling with SL" },
    { value: "strategy6", label: "Suprita" },
    { value: "strategy7", label: "Shambhu" },
    { value: "strategy8", label: "Mahabuddhi" },
    { value: "strategy9", label: "Vasuki" },
    { value: "strategy10", label: "OG BTC Daily Option Selling" },
    { value: "strategy11", label: "VJS" },
    { value: "strategy12", label: "SK" },
    { value: "strategy13", label: "DNS" },
    { value: "strategy14", label: "SIM" }
  ];

  return (
    <div className="App">
      <header className="App-header">
        <div className="header-content">
          <h1>Portfolio Performance Dashboard</h1>
          <nav className="nav-tabs">
            <button 
              className={`nav-tab ${selectedTab === 'dashboard' ? 'nav-tab-active' : ''}`}
              onClick={() => setSelectedTab('dashboard')}
            >
              Dashboard
            </button>
            <button 
              className={`nav-tab ${selectedTab === 'dataForm' ? 'nav-tab-active' : ''}`}
              onClick={() => setSelectedTab('dataForm')}
            >
              Data Form
            </button>
          </nav>
        </div>
      </header>

      <div className="strategy-selector-container">
        <div className="strategy-selector">
          <label htmlFor="strategy">Select Trading Strategy:</label>
          <div className="custom-select">
            <select id="strategy" value={selectedStrategy} name="strategy" onChange={handleChange}>
              {strategyOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            <div className="select-arrow"></div>
          </div>
        </div>
      </div>

      <div className="main-container">
        {selectedTab === "dataForm" ? (
          <div className="form-container">
            <TradeForm onAddTrade={() => fetchDataForStrategy(selectedStrategy)} selectedStrategy={selectedStrategy} />
          </div>
        ) : (
          <>
            {isLoading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading strategy data...</p>
              </div>
            ) : (
              <div className="dashboard-grid">
                <div className="grid-item full-width">
                  <TradeList trades={strategyData} selectedStrategy={selectedStrategy} setTrades={setStrategyData}/>
                </div>
                
                <div className="grid-item">
                  <PerformanceMetrics trades={strategyData} />
                </div>
                
                <div className="grid-item">
                  <MaximumLossProfit trades={strategyData} />
                </div>
                
                <div className="grid-item">
                  <Portfolio investment={20000} />
                </div>
                
                <div className="grid-item full-width">
                  <PerformanceTables trades={strategyData} />
                </div>
                
                <div className="grid-item">
                  <RankedStrategies />
                </div>
                
                <div className="grid-item">
                  <DonutChart title={"All Strategies Data"} />
                </div>
                
                <div className="grid-item full-width">
                  <PortfolioValue data={{dates, strategies}}/>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;