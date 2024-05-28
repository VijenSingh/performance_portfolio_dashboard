

export const addTrade = (tradeData) => ({
    type: 'ADD_TRADE',
    payload: tradeData,
  });
  
  export const deleteTrade = (tradeId) => ({
    type: 'DELETE_TRADE',
    payload: tradeId,
  });
  
  // Add more action creators for other trade-related actions
  