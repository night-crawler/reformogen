import { connect } from 'react-redux';

import { createStructuredSelector } from 'reselect';

import {
    formogenComponentDidMount, formogenComponentWillUnmount,
    requestMetaData, requestFormData,
    submitForm,
    fieldChanged
} from './actions';
import selectorFactories from './selectorFactories';
import FormogenComponent from './components';


const makeMapStateToProps = () => {
    // create private selectors (one for each instance of component)
    const formId = selectorFactories.makeFormId();

    const skipFetchingObject = selectorFactories.makeSkipFetchingObject();
    const formFilesUploadProgress = selectorFactories.makeFormFilesUploadProgress();

    const isLoading = selectorFactories.makeIsLoading();
    const isFormDataPristine = selectorFactories.makeIsFormDataPristine();
    const isFormDataDirty = selectorFactories.makeIsFormDataDirty();
    const shouldUploadFiles = selectorFactories.makeShouldUploadFiles();

    const title = selectorFactories.makeTitle();
    const description = selectorFactories.makeDescription();
    const fields = selectorFactories.makeFields();

    const pristineFormData = selectorFactories.makePristineFormData();
    const dirtyFormData = selectorFactories.makeDirtyFormData();
    const actualFormData = selectorFactories.makeActualFormData();
    const dirtyFiles = selectorFactories.makeDirtyFileData();

    const submitMethod = selectorFactories.makeSubmitMethod();
    const submitUrl = selectorFactories.makeSubmitUrl();

    const submitMiddlewares = selectorFactories.makeSubmitMiddlewares();

    const fieldErrorsMap = selectorFactories.makeFieldErrorsMap();
    const nonFieldErrorsMap = selectorFactories.makeNonFieldErrorsMap();

    return createStructuredSelector({
        // helps identify state's namespace of current formogen form
        formId,
        // misc flags
        skipFetchingObject,
        // states
        isLoading, isFormDataPristine, isFormDataDirty, shouldUploadFiles, formFilesUploadProgress,
        // metaData
        title, description, fields,
        // formData
        pristineFormData, dirtyFormData, actualFormData, dirtyFiles,
        // submit action url and method
        submitUrl, submitMethod,
        // middlewares (data flow)
        submitMiddlewares,
        // errors
        fieldErrorsMap, nonFieldErrorsMap,
    });
};

const mapDispatchToProps = dispatch => ({ dispatch });

const mergeProps = (stateProps, dispatchProps, ownProps) => {
    const { formId } = stateProps;
    const { dispatch } = dispatchProps;

    const componentDidMount = () => dispatch(formogenComponentDidMount(formId));
    const componentWillUnmount = () => dispatch(formogenComponentWillUnmount(formId));
    const getFormData = () => {
        const { objectUrl } = ownProps;
        if (objectUrl) return dispatch(requestFormData(objectUrl, formId));
        return Promise.resolve({});
    };
    const getMetaData = () => {
        const { metaDataUrl } = ownProps;
        return dispatch(requestMetaData(metaDataUrl, formId));
    };
    const handleFieldChanged = (event, data) => {
        return dispatch(fieldChanged(event, data, formId));
    };
    const submit = () => {
        const { skipFetchingObject, submitUrl, submitMethod,
            dirtyFormData, dirtyFiles, submitMiddlewares } = stateProps;

        const { sendFileQueueLength } = ownProps;

        const _props = {
            formId,
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
    makeMapStateToProps,
    mapDispatchToProps,
    mergeProps
)(FormogenComponent);
