import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { formId, finalFieldValue, initialFieldValue, asyncFieldOptions } from '~/formogen-redux/selectors';

import { storeFieldData } from '~/formogen-redux/actions';

import { AsyncManyToManyField as AsyncManyToManyFieldComponent } from '~/formogen/semantic-ui/fields/AsyncManyToManyField';

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

export const AsyncManyToManyField = connect(
  createStructuredSelector({
    formId,
    initialValue: initialFieldValue,
    value: finalFieldValue,
    options: asyncFieldOptions
  }),
  dispatch => ({ dispatch }),
  mergeProps,
)(AsyncManyToManyFieldComponent);
