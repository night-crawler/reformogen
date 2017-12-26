import { connect } from 'react-redux';

import { createStructuredSelector } from 'reselect';

import {
    formogenComponentDidMount, formogenComponentWillUnmount,
    requestMetaData, requestFormData,
    submitForm,
    fieldChanged
} from './actions';
import {
    formogenName,
    skipFetchingObject,
    title, description, fields,
    pristineFormData, dirtyFormData, actualFormData, dirtyFiles,
    isLoading, isFormDataPristine, isFormDataDirty, shouldUploadFiles, formFilesUploadProgress,
    submitUrl, submitMethod,
    submitMiddlewares,
    fieldErrorsMap, nonFieldErrorsMap,
} from './selectors';
import FormogenComponent from './components';


const mapDispatchToProps = (dispatch, props) => {
    return {
        dispatch,

        formogenComponentDidMount: name => dispatch(formogenComponentDidMount(name)),
        formogenComponentWillUnmount: name => dispatch(formogenComponentWillUnmount(name)),

        // TODO: objectUrl
        getFormData: () => props.objectUrl && dispatch(requestFormData(props.objectUrl)),
        getMetaData: () => dispatch(requestMetaData(props.metaDataUrl)),
        handleFieldChanged: (...args) => dispatch(fieldChanged(...args)),
    };
};

const mergeProps = (stateProps, dispatchProps, ownProps) => {
    const submit = () => {
        const { skipFetchingObject, submitUrl, submitMethod,
            dirtyFormData, dirtyFiles, submitMiddlewares } = stateProps;
        const { dispatch } = dispatchProps;
        const { sendFileQueueLength } = ownProps;

        const _props = {
            submitUrl,
            submitMethod,
            sendFileQueueLength,
            formData: dirtyFormData,
            formFiles: dirtyFiles,
            middlewares: submitMiddlewares,
            skipFetchingObject,
        };

        return dispatch(submitForm(_props));
    };

    return {
        ...stateProps, ...dispatchProps, ...ownProps,
        submit,
    };
};

export default connect(
    createStructuredSelector({
        // helps identify form
        formogenName,
        // misc flags
        skipFetchingObject,
        // metaData
        title, description, fields,
        // formData
        pristineFormData, dirtyFormData, actualFormData, dirtyFiles,
        // states
        isLoading, isFormDataPristine, isFormDataDirty, shouldUploadFiles, formFilesUploadProgress,
        // submit action url and method
        submitUrl, submitMethod,
        // middlewares (data flow)
        submitMiddlewares,
        // errors
        fieldErrorsMap, nonFieldErrorsMap,
    }),
    mapDispatchToProps,
    mergeProps
)(FormogenComponent);
