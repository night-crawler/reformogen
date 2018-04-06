import { createSelector } from 'reselect';

import _ from 'lodash';

import { getDirtyFields, updateFormDataWithDefaults } from './utils';


// =============== STARTERS ===============

export const state = state => state.formogen;

export const props = (state, props) => props;


// =============== NAME-SPACING ===============

export const namespace = createSelector(props, props => props.formId || 'default');

export const concreteForm = createSelector([state, namespace], (state, namespace) => state[namespace] || {});


// =============== METADATA ===============

// received meta data (from remote server)
export const receivedMetaData = createSelector(concreteForm, form => form.receivedMetaData || {});

// received meta data fields (from remote server)
export const receivedFields = createSelector(receivedMetaData, metaData => metaData.fields || []);

// initial meta data (from own props)
export const initialMetaData = createSelector(props, props => props.propsMetaData || {});

// initial meta data fields (from own props)
export const initialFields = createSelector(initialMetaData, metaData => metaData.fields || []);

// when meta data ready to be rendered it's true
export const isMetaDataReady = createSelector(concreteForm, formogen => formogen.isMetaDataReady);


// =============== FINAL DATA (TOTAL DATA) ===============

// final title (ready for use)
export const title = createSelector(
    [initialMetaData, receivedMetaData],
    (initialMetaData, receivedMetaData) => _.get(initialMetaData, 'title', null) || receivedMetaData.title
);

// final description (ready for use)
export const description = createSelector(
    [initialMetaData, receivedMetaData],
    (initialMetaData, receivedMetaData) => _.get(initialMetaData, 'description', null) || receivedMetaData.description
);

// final fields (ready for use)
export const fields = createSelector(
    [initialFields, receivedFields],
    (initialFields, receivedFields) => _([...initialFields, ...receivedFields]).uniqBy('name').value()
);

// names of all fields that's presented in the form
export const fieldNames = createSelector(fields, fields => _.map(fields, 'name'));

// all file fields that's presented in the form
export const fileFields = createSelector(fields, fields => _.filter(fields, { type: 'FileField' }));

// names of all file fields that's presented in the form
export const fileFieldNames = createSelector(fileFields, fileFields => _.map(fileFields, 'name'));


// =============== FORMDATA ===============

// should contain data objects that present file uploading progress
export const formFilesUploadProgress = createSelector(concreteForm, form => form.formFilesUploadProgress);

// should contain form data (from own props)
export const initialFormData = createSelector(props, props => props.initialFormData);

// should contain received (from remote server) form data
export const receivedFormData = createSelector(concreteForm, form => form.receivedFormData);

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
    [concreteForm, pristineFormData, fileFieldNames],
    (form, pristineFormData, fileFieldNames) => {
        const { dirtyFormData } = form;
        const dirtyDataFieldMap = _.pickBy(dirtyFormData, (t, fieldName) => !(fileFieldNames.indexOf(fieldName) + 1));
        const pristineFieldMap = _.pickBy(pristineFormData, (t, fieldName) => !(fileFieldNames.indexOf(fieldName) + 1));
        return getDirtyFields(dirtyDataFieldMap, pristineFieldMap);
    }
);

// it contains only changed file fields (USER INPUT ONLY)
export const dirtyFiles = createSelector(
    [concreteForm, pristineFormData, fileFieldNames],
    (form, pristineFormData, fileFieldNames) => {
        return _.pickBy(form.dirtyFormData, (val, fieldName) =>
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
    [props, pristineFormData],
    (props, pristineFormData) => {
        return props.objectUpdateUrl || props.objectUrl ||
            _.get(pristineFormData, 'urls.update') ||
            _.get(pristineFormData, 'urls.edit') ||
            _.get(pristineFormData, 'urls.view', null);
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
    [props, isObjectCreate, objectUpdateUrl],
    (props, isObjectCreate, objectUpdateUrl) => isObjectCreate ? props.objectCreateUrl : objectUpdateUrl
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

export const initialSubmitMiddlewares = createSelector(props, props => props.submitMiddlewares || {});

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
export const errors = createSelector(concreteForm, form => form.errors || {});

// contains ONLY validation errors
export const fieldErrorsMap = createSelector([errors, fieldNames], (errors, fieldNames) => {
    return _(errors).pick(fieldNames).value();
});

// contains ONLY non-field validation errors
export const nonFieldErrorsMap = createSelector([errors, fieldNames], (errors, fieldNames) => {
    return _(errors).pick(_(errors).keys().difference(fieldNames).value()).value();
});


// =============== MISC ===============

// it signals if the formogen form is loading its data (form data, meta data, etc)
export const isLoading = createSelector([concreteForm, isObjectUpdate], (form, isObjectUpdate) => {
    if (isObjectUpdate)
        return !(form.isFormDataReady && form.isMetaDataReady);
    return !form.isMetaDataReady;
});

//
export const skipFetchingObject = createSelector(props, props => !!props.skipFetchingObject);
