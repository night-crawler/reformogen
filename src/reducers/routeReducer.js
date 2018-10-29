import { LOCATION_CHANGE } from 'react-router-redux';


export const routeReducer = (state = {}, action) => {
  switch (action.type) {
    case LOCATION_CHANGE:
      return { ...state, ...action.payload };

    default:
      return state;
  }
};
