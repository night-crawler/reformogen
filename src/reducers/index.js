import { combineReducers } from 'redux';

import { routeReducer } from './routeReducer';


const createRootReducer = injectedReducers => combineReducers({
  route: routeReducer,

  ...injectedReducers,
});
export default createRootReducer;
