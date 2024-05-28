
const initialState = {
    trades: [],
  };
  
  const tradeReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'ADD_TRADE':
        return {
          ...state,
          trades: [...state.trades, action.payload],
        };
      case 'DELETE_TRADE':
        return {
          ...state,
          trades: state.trades.filter((trade) => trade.id !== action.payload),
        };
      // Add more cases for other trade-related actions
      default:
        return state;
    }
  };
  
  export default tradeReducer;
  