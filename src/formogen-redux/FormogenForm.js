import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { FormogenForm as FormogenFormComponent } from '../formogen/FormogenForm';

import { } from './selectors';
import { bootstrap } from './actions';


function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

function mergeProps(stateProps, dispatchProps, ownProps) {
  const { dispatch } = dispatchProps;

  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps,

    actions: {
      bootstrap: () => dispatch(bootstrap())
    },

    dispatch: undefined,
  };
}

export const FormogenForm = connect(
  createStructuredSelector({

  }),
  mapDispatchToProps,
  mergeProps,
)(FormogenFormComponent);
