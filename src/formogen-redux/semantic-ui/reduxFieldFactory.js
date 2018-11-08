import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { formId, fieldValue } from '~/formogen-redux/selectors';

import { storeFieldData } from '~/formogen-redux/actions';


export function connectField(FieldComponent) {
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

  return connect(
    createStructuredSelector({
      formId,
      value: fieldValue
    }),
    dispatch => ({ dispatch }),
    mergeProps,
  )(FieldComponent);
}
