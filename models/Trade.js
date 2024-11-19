const mongoose = require('mongoose');

const tradeSchema = new mongoose.Schema({
  strategy: { type: String, required: true },
  date: { type: String, required: true },
  entryPrice: { type: Number, required: true },
  exitPrice: { type: Number, required: true },
  quantity: { type: Number, required: true },
});

module.exports = mongoose.model('Trade', tradeSchema);
