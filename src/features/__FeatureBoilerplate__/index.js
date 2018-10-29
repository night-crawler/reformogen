import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { pathname } from '~/features/Routing/selectors';

import { Feature } from './Feature';
import {
  data
} from './selectors';


function mapDispatchToProps(dispatch) {
  return { dispatch };
}

function mergeProps(stateProps, dispatchProps, ownProps) {
  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    dispatch: undefined,
  };
}

export const FeatureBoilerplate = connect(
  createStructuredSelector({
    pathname,
    data
  }),
  mapDispatchToProps,
  mergeProps,
)(Feature);
