import { routerMiddleware } from 'react-router-redux';
import { applyMiddleware, compose, createStore } from 'redux';
import { apiMiddleware } from 'redux-api-middleware';
import createLogger from 'redux-logger';
import thunkMiddleware from 'redux-thunk';

import createRootReducer from './reducers';


export default function configureStore(initialState = {}, history) {
  const middlewares = [
    apiMiddleware,
    thunkMiddleware,
    createLogger,
    routerMiddleware(history),
  ];

  const enhancers = [
    applyMiddleware(...middlewares),
  ];

  const composeEnhancers =
        process.env.NODE_ENV !== 'production' &&
        typeof window === 'object' &&
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
          ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
            shouldHotReload: false,
          })
          : compose;

  const store = createStore(
    createRootReducer(),
    initialState,
    composeEnhancers(...enhancers)
  );

  return store;
}
