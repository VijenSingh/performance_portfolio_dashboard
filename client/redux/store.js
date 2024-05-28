
import { createStore, combineReducers } from 'redux';
import tradeReducer from './reducers/tradeReducer'; // Create this file later for your trade-related actions

const rootReducer = combineReducers({
  trade: tradeReducer, // You might have other reducers in the future
});

const store = createStore(rootReducer);

export default store;
