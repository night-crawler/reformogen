import { createSelector } from 'reselect';

import _ from 'lodash';
import { extractIdentity } from '../formogen/utils';

import { mergeMetaData, updateFormDataWithDefaults } from './utils';


// STARTERS
export const formogen = state => state.formogen;
export const formogenProps = (state, props) => props;


// METADATA
export const receivedMetaData = createSelector(formogen, formogen => formogen.receivedMetaData);
export const assignedMetaData = createSelector(formogenProps, formogenProps => formogenProps.metaData);
export const isMetaDataReady = createSelector(formogen, formogen => formogen.isMetaDataReady);

export const totalMetaData = createSelector(
    [assignedMetaData, receivedMetaData],
    (assignedMetaData, receivedMetaData) => mergeMetaData(assignedMetaData, receivedMetaData)
);

export const metaDataFields = createSelector(totalMetaData, (metaData) => metaData.fields);
export const metaDataFieldMap = createSelector(metaDataFields, (metaDataFields) => _.keyBy(metaDataFields, 'name'));
export const formFieldNames = createSelector(metaDataFields, metaDataFields => _.map(metaDataFields, 'name'));


// FORMDATA
export const pristineFormData = createSelector(formogen, formogen => _.get(formogen, 'pristineFormData', {}));
export const receivedFormData = createSelector(formogen, formogen => formogen.receivedFormData);
export const assignedFormData = createSelector(formogenProps, formogenProps => formogenProps.formData);
export const isFormDataReady = createSelector(formogen, formogen => formogen.isFormDataReady);

export const totalFormData = createSelector(
    [assignedFormData, receivedFormData, metaDataFields],
    (assignedFormData, receivedFormData, metaDataFields) => {
        return updateFormDataWithDefaults(metaDataFields, { ...assignedFormData, ...receivedFormData });
    }
);


// SUBMIT
export const hasId = createSelector(totalFormData, formData => !!_.get(formData, 'id', null));
export const submitMethod = createSelector(hasId, hasId => hasId ? 'PATCH' : 'POST');
export const submitUrl = createSelector(
    [formogenProps, totalFormData],
    (props, formData) => {
        if (!_.get(formData, 'id', null)) {
            return props.objectCreateUrl;
        }

        return props.objectUpdateUrl || props.objectUrl ||
            _.get(formData, 'urls.update') ||
            _.get(formData, 'urls.edit') ||
            _.get(formData, 'urls.view', null);
    }
);


// FORM FILE -- PRISTINE && CHANGE DIFF
export const formFileFieldNames = createSelector(
    [metaDataFieldMap, formFieldNames],
    (metaDataFieldMap, formFieldNames) => {
        return _.filter(
            formFieldNames,
            (fieldName) => metaDataFieldMap[fieldName].type in ['FileField', 'ImageField']
        );
    }
);
export const changedFormFileFieldNames = createSelector(
    [formFileFieldNames, pristineFormData, totalFormData],
    (fieldNames, pristine, current) => {
        return _.filter(fieldNames, name => !pristine[name] ? false : pristine[name] !== current[name]);
    }
);

export const currentFormFile = createSelector(
    [changedFormFileFieldNames, totalFormData],
    (fieldNames, currentFormData) => _(currentFormData).pick(fieldNames).value()
);


// FORM DATA -- PRISTINE && CHANGE DIFF
export const formDataFieldNames = createSelector(
    [formFieldNames, formFileFieldNames],
    (formFieldNames, formFileFieldNames) => {
        return _.difference(formFieldNames, formFileFieldNames);
    }
);
export const changedFormDataFieldNames = createSelector(
    [formDataFieldNames, pristineFormData, totalFormData],
    (fieldNames, pristine, current) => {
        return _.filter(fieldNames, name => pristine[name] !== current[name]);
    }
);

export const changedFormData = createSelector(
    [changedFormDataFieldNames, totalFormData],
    (fieldNames, currentFormData) => _(currentFormData).pick(fieldNames).value()
);
