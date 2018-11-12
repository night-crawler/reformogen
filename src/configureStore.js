import { routerMiddleware } from 'react-router-redux';
import { applyMiddleware, compose, createStore } from 'redux';
// import { apiMiddleware } from 'redux-api-middleware';
import createLogger from 'redux-logger';
// import thunkMiddleware from 'redux-thunk';
import createSagaMiddleware from 'redux-saga';

import rootSaga from '~/rootSaga';

import { createRootReducer } from './reducers';

import { responseAdapterRegistry, DjangoRestFrameworkResponseAdapter } from '~/formogen-redux/ResponseAdapters';

const sagaMiddleware = createSagaMiddleware();
responseAdapterRegistry.register(/\/api\/v/, DjangoRestFrameworkResponseAdapter);

export default function configureStore(initialState = {}, history) {
  const middlewares = [
    sagaMiddleware,
    // apiMiddleware,
    // thunkMiddleware,
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

  store.runSaga = sagaMiddleware.run;
  store.injectedReducers = {}; // Reducer registry
  store.injectedSagas = {}; // Saga registry

  store.runSaga(rootSaga);


  return store;
}
