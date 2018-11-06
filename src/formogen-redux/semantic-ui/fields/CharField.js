import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { CharField as CharFieldComponent } from '~/formogen/semantic-ui/fields/CharField';

import { formId } from '~/formogen-redux/selectors';
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

export const CharField = connect(
  createStructuredSelector({
    formId
  }),
  mapDispatchToProps,
  mergeProps,
)(CharFieldComponent);
