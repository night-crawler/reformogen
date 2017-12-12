import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';


import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';

import createConfiguredStore from './store';
import { apiMiddleware } from 'redux-api-middleware';

import formogen from './formogen-react-redux/reducers';


let store = createConfiguredStore(
    {
        formogen
    },
    [
        apiMiddleware,
        thunkMiddleware,
        createLogger
    ]
);

ReactDOM.render(
    <Provider store={ store }>
        <App />
    </Provider>,
    document.getElementById('root')
);

registerServiceWorker();
