import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { GenericField as GenericFieldComponent } from '../../../formogen/semantic-ui/fields/GenericField';

// import { } from '../../selectors';
// import { bootstrap } from '../../actions';


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

export const GenericField = connect(
  createStructuredSelector({

  }),
  mapDispatchToProps,
  mergeProps,
)(GenericFieldComponent);
