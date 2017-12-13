import { connect } from 'react-redux';

import { createStructuredSelector } from 'reselect';

import { fetchMetaData, fetchFormData, submitForm, fieldChanged, sendFiles } from './actions';
import FormogenReactReduxComponent from './components';

import {
    title, description, fields,
    pristineFormData, dirtyFormData, actualFormData, dirtyFiles,
    isFormDataReady, isMetaDataReady,
    submitUrl, submitMethod,
    isFormDataPristine, isFormDataDirty,
    pipePreSubmit, pipePreSuccess, pipePreValidationError,
    fieldErrorsMap, nonFieldErrorsMap,


    shouldSendFiles,
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
    const { shouldSendFiles, pristineFormData, dirtyFiles } = stateProps;

    if (shouldSendFiles)
        dispatch(sendFiles(dirtyFiles, pristineFormData.urls));

    const submit = () => {
        const { submitUrl, submitMethod, dirtyFormData, isFormDataDirty, pipePreSubmit } = stateProps;

        if (isFormDataDirty)
            return dispatch(submitForm(submitUrl, submitMethod, pipePreSubmit(dirtyFormData)));
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
        dirtyFiles,

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

        // errors
        fieldErrorsMap,
        nonFieldErrorsMap,


        shouldSendFiles,
    }),
    mapDispatchToProps,
    mergeProps
)(FormogenReactReduxComponent);
