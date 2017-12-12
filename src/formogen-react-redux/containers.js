import { connect } from 'react-redux';

import { createStructuredSelector } from 'reselect';

import { fetchMetaData, fetchFormData, submitForm, fieldChanged } from './actions';
import FormogenReactReduxComponent from './components';

import {
    title, description, fields,
    pristineFormData, dirtyFormData, actualFormData,
    isFormDataReady, isMetaDataReady,
    submitUrl, submitMethod,
    isFormDataPristine, isFormDataDirty,
    pipePreSubmit, pipePreSuccess, pipePreValidationError,

    fieldErrorsMap, nonFieldErrorsMap,
} from './selectors';


const mapDispatchToProps = (dispatch, props) => {
    return {
        dispatch,

        fetchMetaData: () => props.objectUrl && dispatch(fetchFormData(props.objectUrl)),
        fetchFormData: () => dispatch(fetchMetaData(props.metaDataUrl)),
        handleFieldChanged: (...args) => dispatch(fieldChanged(...args)),
    };
};

const mergeProps = (stateProps, dispatchProps, ownProps) => {
    const { dispatch } = dispatchProps;

    const submit = () => {
        const { submitUrl, submitMethod, dirtyFormData, isFormDataDirty, pipePreSubmit } = stateProps;
        if (isFormDataDirty) {
            const data = pipePreSubmit(dirtyFormData);
            console.log('data', data);
            const action = submitForm(submitUrl, submitMethod, data);
            console.log(action);
            dispatch(action);
        } else
            // TODO: ?
            console.log('All form fields are pristine! Change something to submit');
    };

    return {
        ...stateProps,
        ...dispatchProps,
        ...ownProps,

        submit,
    };
};

export default connect(
    createStructuredSelector({
        // metaData
        title,
        description,
        fields,

        // formData
        pristineFormData,
        dirtyFormData,
        actualFormData,

        // states
        isFormDataReady,
        isMetaDataReady,
        isFormDataPristine,
        isFormDataDirty,

        // submit data
        submitUrl,
        submitMethod,

        // pipe line
        pipePreSubmit,
        pipePreSuccess,
        pipePreValidationError,



        fieldErrorsMap,
        nonFieldErrorsMap,
    }),
    mapDispatchToProps,
    mergeProps
)(FormogenReactReduxComponent);
