import { combineReducers } from 'redux';
import { formogenReducer } from 'reformogen-redux/build/reducer';


export const createRootReducer = injectedReducers => combineReducers({
  formogen: formogenReducer,
  ...injectedReducers,
});
