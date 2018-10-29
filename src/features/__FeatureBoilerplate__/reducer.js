import { 
  FETCH_FEATURE_SUCCESS
} from './constants';

export function featureReducer(state = {}, action) {
  const { type , payload } = action;

  switch (type) {
    case FETCH_FEATURE_SUCCESS:
      return {
        ...state,
        data: payload,
      };

    default:
      return state;
  }
}
