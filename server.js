

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid'); 
const app = express();
const PORT = process.env.PORT || 3001;

app.use(bodyParser.json());

// Define storage folder
const storageFolder = path.join(__dirname, 'data');
if (!fs.existsSync(storageFolder)) {
  fs.mkdirSync(storageFolder);
}

// POST endpoint to add new trade data
app.post('/api/addTrade', (req, res) => {
  const tradeData = req.body;
  const { strategy, date, entryPrice, exitPrice, quantity } = tradeData;
  const filePath = path.join(storageFolder, `${strategy}.json`);
  try {
    let data = [];
    if (fs.existsSync(filePath)) {
      data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
    data.push({ id: uuidv4(), date, entryPrice, exitPrice, quantity });
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    res.status(200).json({ message: 'Trade data added successfully' });
  } catch (error) {
    console.error('Error adding trade data:', error);
    res.status(500).json({ error: 'Failed to add trade data' });
  }
});

// GET endpoint to fetch trade data for a specific strategy
app.get('/api/trades/:strategy', (req, res) => {
  const { strategy } = req.params;
  const filePath = path.join(storageFolder, `${strategy}.json`);
  try {
    if (fs.existsSync(filePath)) {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      res.status(200).json(data);
    } else {
      res.status(404).json({ error: 'No trade data found for the specified strategy' });
    }
  } catch (error) {
    console.error('Error fetching trade data:', error);
    res.status(500).json({ error: 'Failed to fetch trade data' });
  }
});

// Route to update a trade

app.put('/api/trades/:id', (req, res) => {
  const { id } = req.params;
  const updatedTrade = req.body;
  const strategy = updatedTrade.selectedStrategy;
  const filePath = path.join(storageFolder, `${strategy}.json`);
  try {
    if (fs.existsSync(filePath)) {
      let data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      data = data.map(trade => trade.id === id ? { ...trade, ...updatedTrade } : trade);
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      res.json(data.find(trade => trade.id === id));
    } else {
      res.status(404).json({ error: 'No trade data found for the specified strategy' });
    }
  } catch (error) {
    console.error('Error updating trade data:', error);
    res.status(500).json({ error: 'Failed to update trade data' });
  }
});

// Route to delete a trade

app.delete('/api/trades/:id', (req, res) => {
  const { id } = req.params;
  const { strategy } = req.query;
  const filePath = path.join(storageFolder, `${strategy}.json`);
  try {
    if (fs.existsSync(filePath)) {
      let data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      data = data.filter(trade => trade.id !== id);
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'No trade data found for the specified strategy' });
    }
  } catch (error) {
    console.error('Error deleting trade data:', error);
    res.status(500).json({ error: 'Failed to delete trade data' });
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
