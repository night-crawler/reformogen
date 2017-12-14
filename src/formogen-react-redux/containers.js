import { connect } from 'react-redux';

import { createStructuredSelector } from 'reselect';

import { fetchMetaData, fetchFormData, submitForm, fieldChanged } from './actions';
import FormogenReactReduxComponent from './components';

import {
    title, description, fields,
    pristineFormData, dirtyFormData, actualFormData, dirtyFiles,
    isFormDataReady, isMetaDataReady, shouldUploadFiles,
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
        const { submitUrl, submitMethod, dirtyFormData, pipePreSubmit, dirtyFiles } = stateProps;
        const { sendFileQueueLength } = ownProps;

        return dispatch(
            submitForm({
                submitUrl, submitMethod,
                // TODO: add pipePreSubmit for formFiles
                formData: pipePreSubmit(dirtyFormData), formFiles: dirtyFiles,
                sendFileQueueLength
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
        isFormDataReady,
        isMetaDataReady,
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
    }),
    mapDispatchToProps,
    mergeProps
)(FormogenReactReduxComponent);
