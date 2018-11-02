import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { FormogenFormComponent } from './FormogenFormComponent';
import { 
  
} from './selectors';


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

    dispatch: undefined,
  };
}

export const FormogenForm = connect(
  createStructuredSelector({

  }),
  mapDispatchToProps,
  mergeProps,
)(FormogenFormComponent);
