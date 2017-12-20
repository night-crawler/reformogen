import { connect } from 'react-redux';

import { createStructuredSelector } from 'reselect';

import { requestMetaData, requestFormData, submitForm, fieldChanged } from './actions';
import FormogenComponent from './components';

import {
    title, description, fields,
    pristineFormData, dirtyFormData, actualFormData, dirtyFiles,
    // isFormDataReady, isMetaDataReady,
    shouldUploadFiles,
    submitUrl, submitMethod,
    isFormDataPristine, isFormDataDirty,
    pipePreSubmit, pipePreSuccess, pipePreValidationError,
    fieldErrorsMap, nonFieldErrorsMap,
    formFilesUploadProgress,
    isLoading,
} from './selectors';


const mapDispatchToProps = (dispatch, props) => {
    return {
        dispatch,

        // TODO: objectUrl
        getFormData: () => props.objectUrl && dispatch(requestFormData(props.objectUrl)),

        getMetaData: () => dispatch(requestMetaData(props.metaDataUrl)),

        handleFieldChanged: (...args) => dispatch(fieldChanged(...args)),
    };
};

const mergeProps = (stateProps, dispatchProps, ownProps) => {
    const { dispatch } = dispatchProps;

    const submit = () => {
        const {
            submitUrl, submitMethod,
            dirtyFormData, dirtyFiles,
            pipePreSubmit, pipePreValidationError, pipePreSuccess
        } = stateProps;
        const { sendFileQueueLength } = ownProps;

        return dispatch(
            submitForm({
                submitUrl, submitMethod, sendFileQueueLength,
                formData: dirtyFormData, formFiles: dirtyFiles,

                // TODO: add pipePreSubmit for formFiles
                // callbacks
                pipePreSubmit, pipePreValidationError, pipePreSuccess,
            })
        );
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
        // isFormDataReady,
        // isMetaDataReady,
        isFormDataPristine,
        isFormDataDirty,
        shouldUploadFiles,

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

        isLoading,

        formFilesUploadProgress,
    }),
    mapDispatchToProps,
    mergeProps
)(FormogenComponent);
