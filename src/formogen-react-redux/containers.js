import { connect } from 'react-redux';

import { createStructuredSelector } from 'reselect';

import {
    formogenComponentDidMount, formogenComponentWillUnmount,
    requestMetaData, requestFormData,
    submitForm,
    fieldChanged
} from './actions';
import {
    namespace,
    skipFetchingObject,
    title, description, fields,
    pristineFormData, dirtyFormData, actualFormData, dirtyFiles,
    isLoading, isFormDataPristine, isFormDataDirty, shouldUploadFiles, formFilesUploadProgress,
    submitUrl, submitMethod,
    submitMiddlewares,
    fieldErrorsMap, nonFieldErrorsMap,
} from './selectors';
import FormogenComponent from './components';


const mapDispatchToProps = dispatch => ({ dispatch });

const mergeProps = (stateProps, dispatchProps, ownProps) => {
    const { namespace } = stateProps;
    const { dispatch } = dispatchProps;

    const componentDidMount = () => dispatch(formogenComponentDidMount(namespace));
    const componentWillUnmount = () => dispatch(formogenComponentWillUnmount(namespace));
    const getFormData = () => {
        const { objectUrl } = ownProps;
        if (objectUrl) return dispatch(requestFormData(objectUrl, namespace));
        return Promise.resolve({});
    };
    const getMetaData = () => {
        const { metaDataUrl } = ownProps;
        return dispatch(requestMetaData(metaDataUrl, namespace));
    };
    const handleFieldChanged = (event, data) => {
        return dispatch(fieldChanged(event, data, namespace));
    };
    const submit = () => {
        const { skipFetchingObject, submitUrl, submitMethod,
            dirtyFormData, dirtyFiles, submitMiddlewares } = stateProps;

        const { sendFileQueueLength } = ownProps;

        const _props = {
            namespace,
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
        componentDidMount, componentWillUnmount,
        getFormData, getMetaData, handleFieldChanged, submit,
    };
};

export default connect(
    createStructuredSelector({
        // helps identify state's namespace of current formogen form
        namespace,
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
