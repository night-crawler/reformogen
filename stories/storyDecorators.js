import React from 'react';
import { Form, Segment, Container } from 'semantic-ui-react';
import createHistory from 'history/createBrowserHistory';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';

import initialState from '~/initialState';

import configureStore from '~/configureStore';

const history = createHistory();
const store = configureStore(initialState, history);

export const withContainerSegmentForm = storyFn =>
  <Container fluid={ true }>
    <Segment basic={ true } color='red'>
      <Form>
        { storyFn() }
      </Form>
    </Segment>
  </Container>;

export const withContainerSegment = storyFn =>
  <Container fluid={ true }>
    <Segment basic={ true } color='red'>
      { storyFn() }
    </Segment>
  </Container>;

export const withStore = storyFn => 
  <Provider store={ store }>
    <ConnectedRouter history={ history }>
      { storyFn() }
    </ConnectedRouter>
  </Provider>;
