import { combineReducers, createStore, applyMiddleware, compose } from 'redux';

const __DEV__ = process.env.NODE_ENV !== 'production';

export default function createConfiguredStore(reducers = {}, middlewares = []) {
    if (__DEV__) {
        // middlewares.push();
    }

    let composeEnhancers = compose;

    if (__DEV__) {
        if (typeof window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ === 'function') {
            composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
        }
    }

    return createStore(
        combineReducers(reducers),
        composeEnhancers(applyMiddleware(...middlewares))
    );
}
