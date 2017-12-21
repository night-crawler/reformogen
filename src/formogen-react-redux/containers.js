import { connect } from 'react-redux';

import { createStructuredSelector } from 'reselect';

import {
    formogenComponentDidMount, formogenComponentWillUnmount,
    requestMetaData, requestFormData,
    submitForm,
    fieldChanged
} from './actions';
import FormogenComponent from './components';

import {
    formogenName,
    title, description, fields,
    pristineFormData, dirtyFormData, actualFormData, dirtyFiles,
    shouldUploadFiles,
    submitUrl, submitMethod,
    isFormDataPristine, isFormDataDirty,
    submitMiddlewares,
    fieldErrorsMap, nonFieldErrorsMap,
    formFilesUploadProgress,
    isLoading, skipFetchingObject
} from './selectors';


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
    const { dispatch } = dispatchProps;

    const submit = () => {
        const {
            submitUrl, submitMethod,
            dirtyFormData, dirtyFiles,
            submitMiddlewares,
            skipFetchingObject,
        } = stateProps;
        const { sendFileQueueLength } = ownProps;

        return dispatch(
            submitForm({
                submitUrl, submitMethod, sendFileQueueLength,
                formData: dirtyFormData, formFiles: dirtyFiles,
                middlewares: submitMiddlewares,
                skipFetchingObject,
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
        formogenName,

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
        formFilesUploadProgress,

        // submit data
        submitUrl,
        submitMethod,

        // middlewares
        submitMiddlewares,

        // errors
        fieldErrorsMap,
        nonFieldErrorsMap,

        isLoading, skipFetchingObject,
    }),
    mapDispatchToProps,
    mergeProps
)(FormogenComponent);
