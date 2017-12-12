import { createSelector } from 'reselect';

import _ from 'lodash';
import { idsList } from '../formogen/utils';

import { updateFormDataWithDefaults } from './utils';


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

export const fieldNames = createSelector(fields, (fields) => _.map(fields, 'name'));

// =============== FORMDATA ===============

// should contains form data (from own props)
export const initialFormData = createSelector(initial, initial => initial.initialFormData);

// should contain received (from remote server) form data
export const receivedFormData = createSelector(formogen, formogen => formogen.receivedFormData);

// TODO: is it correct?
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
    [formogen, pristineFormData],
    (formogen, pristineFormData)=> {
        let dirty = formogen.dirtyFormData || {};

        if (!_.get(pristineFormData, 'id', null))
            return { ...pristineFormData, ...dirty };

        for (const [fieldName, fieldValue] of Object.entries(dirty)) {
            // TODO: if files are present it's changed
            let changed = fieldValue !== pristineFormData[fieldName];

            if (changed && (_.isObject(fieldValue) || _.isObject(pristineFormData[fieldName]))) {
                const pristineFieldValueId = idsList(pristineFormData[fieldName]);
                const fieldValueId = idsList(fieldValue);

                if (_(fieldValueId).xor(pristineFieldValueId).isEmpty())
                    changed = false;
            }

            if (!changed) {
                delete dirty[fieldName];
            }

        }

        return dirty;
    }
);

// truly if user has not changed any fields (NOTE: real diff does not matter)
export const isFormDataPristine = createSelector(dirtyFormData, dirtyFormData => _.isEmpty(dirtyFormData));

// truly if user has changed some fields (NOTE: real diff does not matter)
export const isFormDataDirty = createSelector(dirtyFormData, dirtyFormData => !_.isEmpty(dirtyFormData));

// when form data ready to be rendered it's true
export const isFormDataReady = createSelector(formogen, formogen => formogen.isFormDataReady);

// it contains current form data state (for form rendering with actual form data)
export const actualFormData = createSelector(
    [pristineFormData, dirtyFormData],
    (pristine, dirty) => ({ ...pristine, ...dirty })
);


// =============== SUBMIT DATA ===============

// truly if FormogenForm should create an object when submitting
export const isObjectCreate = createSelector(pristineFormData, formData => !_.get(formData, 'id', null));

// truly if FormogenForm should update an object when submitting
export const isObjectUpdate = createSelector(pristineFormData, formData => !!_.get(formData, 'id', null));

// method of XML Http Request when FormogenForm is submitted
export const submitMethod = createSelector(isObjectUpdate, isObjectUpdate => isObjectUpdate ? 'PATCH' : 'POST');

// URL of XML Http Request when FormogenForm is submitted
export const submitUrl = createSelector(
    [initial, pristineFormData, isObjectCreate],
    (initial, formData, isObjectCreate) => {
        if (isObjectCreate)
            return initial.objectCreateUrl;

        return initial.objectUpdateUrl || initial.objectUrl ||
            _.get(formData, 'urls.update') ||
            _.get(formData, 'urls.edit') ||
            _.get(formData, 'urls.view', null);
    }
);


// =============== SUBMIT DATA ===============

export const pipePreSubmit = createSelector(initial, initial => {
    const { pipePreSubmit } = initial;

    if (_.isFunction(pipePreSubmit)) {
        return data => {
            console.log('Using custom pipeline processing for pipePreSubmit()');
            return pipePreSubmit(data);
        };
    }
    return data => data;
});
export const pipePreValidationError = createSelector(initial, initial => {
    const { pipePreValidationError } = initial;

    if (_.isFunction(pipePreValidationError)) {
        return data => {
            console.log('Using custom pipeline processing for pipePreValidationError()');
            return pipePreValidationError(data);
        };
    }
    return data => data;
});
export const pipePreSuccess =  createSelector(initial, initial => {
    const { pipePreSuccess } = initial;

    if (_.isFunction(pipePreSuccess)) {
        return data => {
            console.log('Using custom pipeline processing for pipePreSuccess()');
            return pipePreSuccess(data);
        };
    }
    return data => data;
});





export const errors = createSelector(formogen, formogen => formogen.errors || {});

export const fieldErrorsMap = createSelector([errors, fieldNames], (errors, fieldNames) => {
    return _(errors).pick(fieldNames).value();
});

export const nonFieldErrorsMap = createSelector([errors, fieldNames], (errors, fieldNames) => {
    return _(errors).pick(
        _(errors).keys().difference(fieldNames).value()
    ).value();
});
