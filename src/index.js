import '@babel/polyfill';
import 'semantic-ui-css/semantic.min.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import './index.css';
import createHistory from 'history/createBrowserHistory';

import { App } from '~/features/App';

import * as serviceWorker from './serviceWorker';
import configureStore from './configureStore';
import initialState from './initialState';


const history = createHistory();
const store = configureStore(initialState, history);

const render = () => {
  ReactDOM.render(
    <Provider store={ store }>
      <ConnectedRouter history={ history }>
        <App />
      </ConnectedRouter>
    </Provider>,
    document.getElementById('root')
  );
};
render();
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
