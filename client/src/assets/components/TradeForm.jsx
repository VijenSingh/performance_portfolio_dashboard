// TradeForm.jsx

import React, { useState } from 'react';
import axios from 'axios';
import '../css/tradeForm.css';

function TradeForm({ onAddTrade, selectedStrategy }) {
  const [formData, setFormData] = useState({
    date: '',
    entryPrice: '',
    exitPrice: '',
    quantity: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.date && formData.entryPrice && formData.exitPrice && formData.quantity) {
      const quantity = parseInt(formData.quantity);
      const tradeData = { ...formData, quantity, strategy: selectedStrategy };
      try {
        await axios.post('/api/addTrade', tradeData);
        onAddTrade(tradeData);
        setFormData({
          date: '',
          entryPrice: '',
          exitPrice: '',
          quantity: '',
        });
      } catch (error) {
        console.error('Error submitting trade data:', error);
      }
    } else {
      alert('Please fill in all fields');
    }
  };

  return (
    <form className="trade-form" onSubmit={handleSubmit}>
      <h2>Add Trade</h2>
      <div>
        <label>Date:</label>
        <input type="date" name="date" value={formData.date} onChange={handleChange} />
      </div>
      <div>
        <label>Entry Price:</label>
        <input type="number" name="entryPrice" value={formData.entryPrice} onChange={handleChange} />
      </div>
      <div>
        <label>Exit Price:</label>
        <input type="number" name="exitPrice" value={formData.exitPrice} onChange={handleChange} />
      </div>
      <div>
        <label>Quantity:</label>
        <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} />
      </div>
      <button type="submit">Add Trade</button>
    </form>
  );
}

export default TradeForm;
