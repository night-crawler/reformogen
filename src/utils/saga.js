
import { put } from 'redux-saga/effects';


export function* processError(errorType, exception) {
  yield put({
    type: errorType,
    payload: { exception }
  });
}

export function singleApiCall({ 
  method, 
  processResponse = response => response.body, 
  onError = processError,
  types: [ REQUEST_TYPE, SUCCESS_TYPE, ERROR_TYPE ],
}) {
  const fn = function* ({ type = REQUEST_TYPE, payload, meta={} } = {}) {
    // * we provide come additional request context to make easier to manipulate with data in reducers
    // TODO: use some callback here instead of this code later
    const extendedMeta = {
      ...meta,  // user might want to pass something too
      request: payload,  // add payload options in case we may need them
    };

    try {
      const response = yield method({ ...payload });
      const processedResponse = processResponse(response, type, payload);
      
      yield put({ 
        type: SUCCESS_TYPE, 
        payload: processedResponse, 
        meta: extendedMeta,
      });
      
      // * we return the processed result and some originally received stuff
      return { 
        rawResult: response, 
        result: processedResponse, 
        meta: extendedMeta,
      };
    } catch(error) { 
      yield onError(ERROR_TYPE, error); 
      return { error, meta: extendedMeta };
    }
  };
  Object.defineProperty(fn, 'name', { 
    value: method.name || `${REQUEST_TYPE}`
  });
  return fn;
}
