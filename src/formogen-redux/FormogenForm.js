import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { FormogenForm as FormogenFormComponent } from '../formogen/FormogenForm';

import { metaData } from './selectors';
import { bootstrap, fetchNextFieldOptions } from './actions';


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
      bootstrap: () => dispatch(bootstrap({
        formId: ownProps.formId,
        describeUrl: ownProps.describeUrl,
        createUrl: ownProps.createUrl,
        objectUrl: ownProps.objectUrl,
      })),
      loadOptions: payload => dispatch(fetchNextFieldOptions(payload)),
    },

    dispatch: undefined,
  };
}

export const FormogenForm = connect(
  createStructuredSelector({
    metaData
  }),
  mapDispatchToProps,
  mergeProps,
)(FormogenFormComponent);
