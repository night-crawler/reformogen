import { createSelector, createSelectorCreator, defaultMemoize } from 'reselect';

import _ from 'lodash';

import loglevel from 'loglevel';
import prefix from 'loglevel-plugin-prefix';

import { getDirtyFields, updateFormDataWithDefaults } from './utils';

prefix.apply(loglevel, { template: '[%t] %l (%n)' });
const logger = loglevel.getLogger('selectorFactories');


// ★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★ UTILS ★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★

function getFields(init, received) {
    const initialFields = init && init.fields || [];
    const receivedFields = received && received.fields || [];

    return _([...initialFields, ...receivedFields]).uniqBy('name').value();
}


// ★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★ PLAIN (used by factory's instances) ★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★

const concreteFormId = (state, props) => props.formId || 'default';

const submitMiddlewares = (state, props) => props.submitMiddlewares;

const skipFetchingObject = (state, props) => !!props.skipFetchingObject;

const concreteForm = (state, props) => state.formogen[props.formId || 'default'];

// =============== STATES ===============
const isFormDataReady = (state, props) => {
    const form = concreteForm(state, props);
    return form && form.isMetaDataReady;
};

const isMetaDataReady = (state, props) => {
    const form = concreteForm(state, props);
    return form && form.isMetaDataReady;
};

const isObjectUpdate = (state, props) => {
    const form = concreteForm(state, props);
    return !!_.get(form, 'receivedFormData.id', null);
};

const isFormDataDirty = (state, props) => {
    const form = concreteForm(state, props);
    if (form)
        return !_.isEmpty(form.dirtyFormData);
    return false;
};

// =============== URLs ===============
const objectCreateUrl = (state, props) => props.objectCreateUrl;

const objectUpdateUrl = (state, props) => {
    const form = concreteForm(state, props);
    return props.objectUpdateUrl || props.objectUrl ||
            _.get(form, 'receivedFormData.urls.update') ||
            _.get(form, 'receivedFormData.urls.edit') ||
            _.get(form, 'receivedFormData.urls.view', null);
};

// =============== ERRORS ===============
const errors = (state, props) => {
    const form = concreteForm(state, props);
    return form && form.errors;
};

// =============== METADATA ===============
// initial meta data (from own props)
const initialMetaData = (state, props) => props.initialMetaData;

// received meta data (from remote server)
const receivedMetaData = (state, props) => {
    const form = concreteForm(state, props);
    return form && form.receivedMetaData;
};

// =============== FORMDATA ===============
// should contain form data (from own props)
const initialFormData = (state, props) => props.initialFormData;

// should contain received (from remote server) form data
const receivedFormData = (state, props) => {
    const form = concreteForm(state, props);
    return form && form.receivedFormData;
};

const dirtyFormData = (state, props) => {
    const form = concreteForm(state, props);
    return form && form.dirtyFormData;
};

const formFilesUploadProgress = (state, props) => {
    const form = concreteForm(state, props);
    return form && form.formFilesUploadProgress;
};


// ★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★ FACTORIES ★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★

export function makeFormId() {
    return createSelector(
        concreteFormId,
        concreteFormId => {
            logger.debug('formId');

            return concreteFormId;
        }
    );
}

export function makeSkipFetchingObject() {
    return createSelector(
        skipFetchingObject,
        skipFetchingObject => {
            logger.debug('skipFetchingObject');

            return skipFetchingObject;
        }
    );
}

export function makeFormFilesUploadProgress() {
    return createSelector(
        formFilesUploadProgress,
        formFilesUploadProgress => {
            logger.debug('formFilesUploadProgress');

            return formFilesUploadProgress;
        }
    );
}

// =============== STATES ===============
export function makeIsLoading() {
    return createSelector(
        [isMetaDataReady, isFormDataReady, objectUpdateUrl],
        (isMetaDataReady, isFormDataReady, objectUpdateUrl) => {
            logger.debug('isLoading');

            return objectUpdateUrl ?
                !(isFormDataReady && isMetaDataReady) : !isMetaDataReady;
        }
    );
}

// truly if user has not changed any fields (NOTE: real diff DOES matter)
export function makeIsFormDataPristine() {
    return createSelector(
        concreteForm,
        concreteForm => {
            logger.debug('isFormDataPristine');

            return concreteForm && _.isEmpty(concreteForm.dirtyFormData);
        }
    );
}

// truly if user has changed some fields (NOTE: real diff DOES matter)
export function makeIsFormDataDirty() {
    return createSelector(
        concreteForm,
        concreteForm => {
            logger.debug('isFormDataDirty');

            return concreteForm && !_.isEmpty(concreteForm.dirtyFormData);
        }
    );
}

// truly if user has changed some fields (NOTE: real diff DOES matter)
export function makeShouldUploadFiles() {
    return createSelector(
        [initialFormData, receivedMetaData, dirtyFormData, objectCreateUrl, isFormDataDirty],
        (initialFormData, receivedMetaData, dirtyFormData, objectCreateUrl, isFormDataDirty) => {
            logger.debug('shouldUploadFiles');

            const fields = getFields(initialMetaData, receivedMetaData);
            const fileFields = _.filter(fields, { type: 'FileField' });
            const fileFieldNames = _.map(fileFields, 'name');

            const dirtyFileData = _.pickBy(dirtyFormData, (val, name) => !!(fileFieldNames.indexOf(name) + 1) && !_.isEmpty(val));
            const hasFilesToUpload = !_(dirtyFileData).values().map('files').flatten().isEmpty();

            // there's nothing to send
            if (!hasFilesToUpload)
                return false;

            // don't send files if an object instance wasn't loaded (after creating)
            if (objectCreateUrl)
                return false;

            // if user just want files to be uploaded and didn't touch anything
            if (objectCreateUrl && !isFormDataDirty)
                return true;

            // just no
            return false;
        }
    );
}

// =============== FINAL DATA (TOTAL DATA) ===============
// final title (ready for use)
export function makeTitle() {
    return createSelector(
        [initialMetaData, receivedMetaData],
        (initialMetaData, receivedMetaData) => {
            logger.debug('title');

            if (!(initialMetaData && receivedMetaData)) return;
            return _.get(initialMetaData, 'title', null) || receivedMetaData.title;
        }
    );
}

// final description (ready for use)
export function makeDescription() {
    return createSelector(
        [initialMetaData, receivedMetaData],
        (initialMetaData, receivedMetaData) => {
            logger.debug('description');

            if (!(initialMetaData && receivedMetaData)) return;
            return _.get(initialMetaData, 'description', null) || receivedMetaData.description;
        }
    );
}

// final fields (ready for use)
export function makeFields() {
    return createSelector(
        [initialMetaData, receivedMetaData],
        (initialMetaData, receivedMetaData) => {
            logger.debug('fields');

            return getFields(initialMetaData, receivedMetaData);
        }
    );
}

// =============== FORMDATA ===============
// it contains initialFormData && receivedFormData + should be updated with defaults (WITHOUT USER INPUT)
export function makePristineFormData() {
    return createSelector(
        [initialMetaData, receivedMetaData, initialFormData, receivedFormData],
        (initialMetaData, receivedMetaData, initialFormData, receivedFormData) => {
            logger.debug('pristineFormData');

            // TODO: update pristineFormData after submitting
            // TODO: extract identities for m2m && fk fields (async only)

            const fields = getFields(initialMetaData, receivedMetaData);
            return updateFormDataWithDefaults(fields, { ...initialFormData, ...receivedFormData });
        }
    );
}

// it contains only changed fields (USER INPUT ONLY)
// when isObjectCreate === true, dirtyFormData contains all fields in form
export function makeDirtyFormData() {
    return createSelector(
        [initialMetaData, receivedMetaData, initialFormData, receivedFormData, dirtyFormData],
        (initialMetaData, receivedMetaData, initialFormData, receivedFormData, dirtyFormData) => {
            logger.debug('dirtyFormData');

            const fields = getFields(initialMetaData, receivedMetaData);
            const fileFields = _.filter(fields, { type: 'FileField' });
            const fileFieldNames = _.map(fileFields, 'name');

            const pristineFormData = updateFormDataWithDefaults(fields, { ...initialFormData, ...receivedFormData });

            const pristineFieldMap =
                _.pickBy(pristineFormData, (t, fieldName) => !(fileFieldNames.indexOf(fieldName) + 1));

            const dirtyDataFieldMap =
                _.pickBy(dirtyFormData, (t, fieldName) => !(fileFieldNames.indexOf(fieldName) + 1));

            return getDirtyFields(dirtyDataFieldMap, pristineFieldMap);
        }
    );
}

// it contains only changed file fields (USER INPUT ONLY)
export function makeDirtyFileData() {
    return createSelector(
        [initialMetaData, receivedMetaData, dirtyFormData],
        (initialMetaData, receivedMetaData, dirtyFormData) => {
            logger.debug('dirtyFiles');

            const fields = getFields(initialMetaData, receivedMetaData);
            const fileFields = _.filter(fields, { type: 'FileField' });
            const fileFieldNames = _.map(fileFields, 'name');

            return _.pickBy(dirtyFormData, (val, name) => !!(fileFieldNames.indexOf(name) + 1) && !_.isEmpty(val));
        }
    );
}

// it contains current form data state (for form rendering with actual form data)
export function makeActualFormData() {
    return createSelector(
        [initialMetaData, receivedMetaData, initialFormData, receivedFormData, dirtyFormData],
        (initialMetaData, receivedMetaData, initialFormData, receivedFormData, dirtyFormData) => {
            logger.debug('actualFormData');

            const fields = getFields(initialMetaData, receivedMetaData);
            const fileFields = _.filter(fields, { type: 'FileField' });
            const fileFieldNames = _.map(fileFields, 'name');

            const pristineFormData = updateFormDataWithDefaults(fields, { ...initialFormData, ...receivedFormData });

            const pristineFieldMap =
                _.pickBy(pristineFormData, (t, fieldName) => !(fileFieldNames.indexOf(fieldName) + 1));
            const dirtyDataFieldMap =
                _.pickBy(dirtyFormData, (t, fieldName) => !(fileFieldNames.indexOf(fieldName) + 1));

            return { ...pristineFormData, ...getDirtyFields(dirtyDataFieldMap, pristineFieldMap) };
        }
    );
}

// =============== SUBMIT MIDDLEWARES ===============
export function makeSubmitMiddlewares() {
    return createSelector(
        submitMiddlewares,
        submitMiddlewares => {
            logger.debug('submitMiddlewares');

            let middlewares = { ...submitMiddlewares };

            const makeMiddleware = (middleware, middlewareName) => {
                if (_.isFunction(middleware)) {
                    return data => {
                        logger.warn(`Using custom pipeline processing by ${middlewareName}`);
                        return middleware(data);
                    };
                }
                return data => data;
            };

            return {
                initial: makeMiddleware(middlewares.initial, 'initial'),
                sendFormData: makeMiddleware(middlewares.sendFormData, 'sendFormData'),
                requestFormData: makeMiddleware(middlewares.requestFormData, 'requestFormData'),
                formDataSendFail: makeMiddleware(middlewares.formDataSendFail, 'formDataSendFail'),
                otherNetworkError: makeMiddleware(middlewares.otherNetworkError, 'otherNetworkError')
            };
        }
    );
}

// =============== SUBMIT DATA ===============
// method of XML Http Request when FormogenForm is submitted
export function makeSubmitMethod() {
    return createSelector(
        isObjectUpdate,
        isObjectUpdate => {
            logger.debug('submitMethod');

            return isObjectUpdate ? 'PATCH' : 'POST';
        }
    );
}

// URL of XML Http Request when FormogenForm is submitted
export function makeSubmitUrl() {
    return createSelector(
        [objectCreateUrl, objectUpdateUrl],
        (objectCreateUrl, objectUpdateUrl) => {
            logger.debug('submitUrl');

            return objectUpdateUrl || objectCreateUrl;
        }
    );
}

// =============== ERRORS ===============
// contains ONLY validation errors
export function makeFieldErrorsMap() {
    return createSelector(
        [initialMetaData, receivedMetaData, errors],
        (initialMetaData, receivedMetaData, errors) => {
            logger.debug('fieldErrorsMap');

            if (!errors) return;

            const fields = getFields(initialMetaData, receivedMetaData);
            const fieldNames = _.map(fields, 'name');

            return _(errors).pick(fieldNames).value();
        }
    );
}

// contains ONLY non-field validation errors
export function makeNonFieldErrorsMap() {
    return createSelector(
        [initialMetaData, receivedMetaData, errors],
        (initialMetaData, receivedMetaData,  errors) => {
            logger.debug('nonFieldErrorsMap');

            if (!errors) return;

            const fields = getFields(initialMetaData, receivedMetaData);
            const fieldNames = _.map(fields, 'name');

            return _(errors).pick(_(errors).keys().difference(fieldNames).value()).value();
        }
    );
}


// ★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★ EXPORT ★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★

export default {
    makeFormId,
    makeSkipFetchingObject, makeFormFilesUploadProgress,
    makeIsLoading, makeIsFormDataPristine, makeIsFormDataDirty, makeShouldUploadFiles,
    makeTitle, makeDescription, makeFields,
    makePristineFormData, makeDirtyFormData, makeDirtyFileData, makeActualFormData,
    makeSubmitMiddlewares,
    makeSubmitMethod, makeSubmitUrl,
    makeFieldErrorsMap, makeNonFieldErrorsMap,
};
