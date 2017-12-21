import { createSelector } from 'reselect';

import _ from 'lodash';

import { getDirtyFields, updateFormDataWithDefaults } from './utils';


// =============== STARTERS ===============

// all changeable and received data
export const formogen = state => state.formogen;

// initial data from own props
export const initial = (state, props) => props;


// =============== METADATA ===============

// received meta data (from remote server)
export const receivedMetaData = createSelector(formogen, formogen => formogen.receivedMetaData || {});

// received meta data fields (from remote server)
export const receivedFields = createSelector(receivedMetaData, metaData => metaData.fields || []);

// initial meta data (from own props)
export const initialMetaData = createSelector(initial, formogenProps => formogenProps.initialMetaData || {});

// initial meta data fields (from own props)
export const initialFields = createSelector(initialMetaData, metaData => metaData.fields || []);

// when meta data ready to be rendered it's true
export const isMetaDataReady = createSelector(formogen, formogen => formogen.isMetaDataReady);


// =============== FINAL DATA (TOTAL DATA) ===============

// final title (ready for use)
export const title = createSelector(
    [initialMetaData, receivedMetaData],
    (initial, received) => _.get(initial, 'title', null) || received.title
);

// final description (ready for use)
export const description = createSelector(
    [initialMetaData, receivedMetaData],
    (initial, received) => _.get(initial, 'description', null) || received.description
);

// final fields (ready for use)
export const fields = createSelector(
    [initialFields, receivedFields],
    (initial, received) => _([...initial, ...received]).uniqBy('name').value()
);

// names of all fields that's presented in the form
export const fieldNames = createSelector(fields, fields => _.map(fields, 'name'));

// all file fields that's presented in the form
export const fileFields = createSelector(fields, fields => _.filter(fields, { type: 'FileField' }));

// names of all file fields that's presented in the form
export const fileFieldNames = createSelector(fileFields, fileFields => _.map(fileFields, 'name'));


// =============== FORMDATA ===============

// should contain data objects that present file uploading progress
export const formFilesUploadProgress = createSelector(formogen, formogen => formogen.formFilesUploadProgress || {});

// should contain form data (from own props)
export const initialFormData = createSelector(initial, initial => initial.initialFormData);

// should contain received (from remote server) form data
export const receivedFormData = createSelector(formogen, formogen => formogen.receivedFormData);

// should contain initialFormData && receivedFormData + should be updated with defaults
export const pristineFormData = createSelector(
    [initialFormData, receivedFormData, fields],
    (initialFormData, receivedFormData, fields) => {
        // TODO: update pristineFormData after submitting
        // TODO: extract identities for m2m && fk fields (async only)
        return updateFormDataWithDefaults(fields, { ...initialFormData, ...receivedFormData });
    }
);

// should contain only changed fields (USER INPUT ONLY)
// when isObjectCreate === true, dirtyFormData contains all fields in form
export const dirtyFormData = createSelector(
    [formogen, pristineFormData, fileFieldNames],
    (formogen, pristineFormData, fileFieldNames) => {
        const { dirtyFormData } = formogen;
        const dirtyDataFieldMap = _.pickBy(dirtyFormData, (t, fieldName) => !(fileFieldNames.indexOf(fieldName) + 1));
        const pristineFieldMap = _.pickBy(pristineFormData, (t, fieldName) => !(fileFieldNames.indexOf(fieldName) + 1));
        return getDirtyFields(dirtyDataFieldMap, pristineFieldMap);
    }
);

// it contains only changed file fields (USER INPUT ONLY)
export const dirtyFiles = createSelector(
    [formogen, pristineFormData, fileFieldNames],
    (formogen, pristineFormData, fileFieldNames) => {
        return _.pickBy(formogen.dirtyFormData, (val, fieldName) =>
            !!(fileFieldNames.indexOf(fieldName) + 1) && !_.isEmpty(val)
        );
    }
);


// truly if user has not changed any fields (NOTE: real diff DOES matter)
export const isFormDataPristine = createSelector(dirtyFormData, dirtyFormData => _.isEmpty(dirtyFormData));

// truly if user has changed some fields (NOTE: real diff DOES matter)
export const isFormDataDirty = createSelector(dirtyFormData, dirtyFormData => !_.isEmpty(dirtyFormData));

// DEPRECATED:
// when form data ready to be rendered it's true
// export const isFormDataReady = createSelector(formogen, formogen => formogen.isFormDataReady);

// it contains current form data state (for form rendering with actual form data)
export const actualFormData = createSelector(
    [pristineFormData, dirtyFormData],
    (pristine, dirty) => ({ ...pristine, ...dirty })
);


// =============== SUBMIT DATA ===============

export const objectUpdateUrl = createSelector(
    [initial, pristineFormData],
    (initial, formData) => {
        return initial.objectUpdateUrl || initial.objectUrl ||
            _.get(formData, 'urls.update') ||
            _.get(formData, 'urls.edit') ||
            _.get(formData, 'urls.view', null);
    }
);

// truly if FormogenForm should create an object when submitting
export const isObjectCreate = createSelector(
    objectUpdateUrl,
    objectUpdateUrl => !objectUpdateUrl
);

// truly if FormogenForm should update an object when submitting
export const isObjectUpdate = createSelector(pristineFormData, formData => !!_.get(formData, 'id', null));

// method of XML Http Request when FormogenForm is submitted
export const submitMethod = createSelector(isObjectUpdate, isObjectUpdate => isObjectUpdate ? 'PATCH' : 'POST');

// URL of XML Http Request when FormogenForm is submitted
export const submitUrl = createSelector(
    [initial, isObjectCreate, objectUpdateUrl],
    (initial, isObjectCreate, objectUpdateUrl) => isObjectCreate ? initial.objectCreateUrl : objectUpdateUrl
);


// it signals if there are some files to be uploaded
export const hasFilesToUpload = createSelector(
    dirtyFiles,
    dirtyFiles => !_(dirtyFiles).values().map('files').flatten().isEmpty()
);

// it signals that files can be uploaded
export const shouldUploadFiles = createSelector(
    [isObjectCreate, hasFilesToUpload, isFormDataDirty],
    (isObjectCreate, hasFilesToUpload, isFormDataDirty) => {
        // there's nothing to send
        if (!hasFilesToUpload)
            return false;

        // don't send files if an object instance wasn't loaded (after creating)
        if (isObjectCreate)
            return false;

        // if user just want files to be uploaded and didn't touch anything
        if (isObjectUpdate && !isFormDataDirty)
            return true;

        // just no
        return false;
    }
);


// =============== SUBMIT MIDDLEWARES ===============

export const initialSubmitMiddlewares = createSelector(initial, initial => initial.submitMiddlewares || {});

// callback that's executed before form's submitting
export const initialMiddleware = createSelector(initialSubmitMiddlewares, middlewares => {
    const { initial } = middlewares;

    if (_.isFunction(initial)) {
        return data => {
            console.warn('Using custom pipeline processing');
            return initial(data);
        };
    }
    return data => data;
});

// callback that's executed before form's submitting
export const sendFormDataMiddleware = createSelector(initialSubmitMiddlewares, middlewares => {
    const { sendFormData } = middlewares;

    if (_.isFunction(sendFormData)) {
        return data => {
            console.warn('Using custom pipeline processing');
            return sendFormData(data);
        };
    }
    return data => data;
});

// callback that's executed before from's validation errors showing
export const requestFormDataMiddleware = createSelector(initialSubmitMiddlewares, middlewares => {
    const { requestFormData } = middlewares;

    if (_.isFunction(requestFormData)) {
        return data => {
            console.warn('Using custom pipeline processing');
            return requestFormData(data);
        };
    }
    return data => data;
});

// callback that's executed after form successful submitting
export const formDataSendFailMiddleware =  createSelector(initialSubmitMiddlewares, middlewares => {
    const { formDataSendFail } = middlewares;

    if (_.isFunction(formDataSendFail)) {
        return data => {
            console.warn('Using custom pipeline processing');
            return formDataSendFail(data);
        };
    }
    return data => data;
});

// callback that's executed after form successful submitting
export const otherNetworkErrorMiddleware =  createSelector(initialSubmitMiddlewares, middlewares => {
    const { otherNetworkError } = middlewares;

    if (_.isFunction(otherNetworkError)) {
        return data => {
            console.warn('Using custom pipeline processing');
            return otherNetworkError(data);
        };
    }
    return data => data;
});

// callback that's executed before form's submitting
export const submitMiddlewares = createSelector(
    [
        initialMiddleware, sendFormDataMiddleware, requestFormDataMiddleware,
        formDataSendFailMiddleware, otherNetworkErrorMiddleware
    ],
    (initial, sendFormData, requestFormData, formDataSendFail, otherNetworkError) => {
        return { initial, sendFormData, requestFormData, formDataSendFail, otherNetworkError };
    }
);

// =============== ERRORS ===============

// contains all errors
export const errors = createSelector(formogen, formogen => formogen.errors || {});

// contains ONLY validation errors
export const fieldErrorsMap = createSelector([errors, fieldNames], (errors, fieldNames) => {
    return _(errors).pick(fieldNames).value();
});

// contains ONLY non-field validation errors
export const nonFieldErrorsMap = createSelector([errors, fieldNames], (errors, fieldNames) => {
    return _(errors).pick(_(errors).keys().difference(fieldNames).value()).value();
});


// =============== MISC ===============

export const formogenName = createSelector(initial, initial => initial.name || 'formogen');

// it signals if the formogen form is loading its data (form data, meta data, etc)
export const isLoading = createSelector([formogen, isObjectUpdate], (formogen, isObjectUpdate) => {
    if (isObjectUpdate)
        return !(formogen.isFormDataReady && formogen.isMetaDataReady);
    return !formogen.isMetaDataReady;
});

//
export const skipFetchingObject = createSelector(initial, initial => !!initial.skipFetchingObject);
