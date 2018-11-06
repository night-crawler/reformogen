import { combineReducers } from 'redux';

import { formogenReducer } from '~/formogen-redux/reducer';


export const createRootReducer = injectedReducers => combineReducers({
  formogen: formogenReducer,
  ...injectedReducers,
});
