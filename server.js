

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid'); 
const app = express();
const PORT = process.env.PORT || 5001;
const connectDB = require('./db');
// Load environment variables
require('dotenv').config();
app.use(bodyParser.json());

// Connect to MongoDB
connectDB();

const Trade = require('./models/Trade');

app.post('/api/addTrade', async (req, res) => {
  const { strategy, date, entryPrice, exitPrice, quantity } = req.body;
  try {
    const trade = new Trade({ strategy, date, entryPrice, exitPrice, quantity });
    await trade.save();
    res.status(201).json({ message: 'Trade added successfully', trade });
  } catch (error) {
    console.error('Error adding trade data:', error);
    res.status(500).json({ error: 'Failed to add trade data' });
  }
});


app.get('/api/trades/:strategy', async (req, res) => {
  const { strategy } = req.params;
  try {
    const trades = await Trade.find({ strategy });
    if (trades.length === 0) {
      return res.status(404).json({ error: 'No trade data found for the specified strategy' });
    }
    res.status(200).json(trades);
  } catch (error) {
    console.error('Error fetching trade data:', error);
    res.status(500).json({ error: 'Failed to fetch trade data' });
  }
});


app.put('/api/trades/:id', async (req, res) => {
  const { id } = req.params;
  const updatedTrade = req.body;
  try {
    const trade = await Trade.findByIdAndUpdate(id, updatedTrade, { new: true });
    if (!trade) {
      return res.status(404).json({ error: 'Trade not found' });
    }
    res.json(trade);
  } catch (error) {
    console.error('Error updating trade data:', error);
    res.status(500).json({ error: 'Failed to update trade data' });
  }
});


app.delete('/api/trades/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const trade = await Trade.findByIdAndDelete(id);
    if (!trade) return res.status(404).send('Trade not found');
    res.status(200).send('Trade deleted');
  } catch (err) {
    console.error('Error deleting trade:', err);
    res.status(500).send('Internal Server Error');
  }
});


// Serve the React app
app.use(express.static(path.join(__dirname, 'client/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/dist', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
