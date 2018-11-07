import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { CharField as CharFieldComponent } from '~/formogen/semantic-ui/fields/CharField';

import { formId, fieldValue } from '~/formogen-redux/selectors';

import { storeFieldData } from '~/formogen-redux/actions';


function mapDispatchToProps(dispatch) {
  return { dispatch };
}

function mergeProps(stateProps, dispatchProps, ownProps) {
  const { dispatch } = dispatchProps;
  const { formId } = ownProps;

  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps,

    onChange: (e, { name, value }) => dispatch(storeFieldData(formId, name, value)),
    dispatch: undefined,
  };
}

export const CharField = connect(
  createStructuredSelector({
    formId,
    value: fieldValue
  }),
  mapDispatchToProps,
  mergeProps,
)(CharFieldComponent);
