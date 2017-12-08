import { createSelector } from 'reselect';

import { mergeMetaData, updateFormDataWithDefaults } from './utils';


export const formogen = state => state.formogen;
export const formogenProps = (state, props) => props;

export const receivedMetaData = createSelector(formogen, formogen => formogen.receivedMetaData);
export const assignedMetaData = createSelector(formogenProps, formogenProps => formogenProps.metaData);
export const isMetaDataReady = createSelector(formogen, formogen => formogen.isMetaDataReady);

export const metaData = createSelector(
    [assignedMetaData, receivedMetaData],
    (assignedMetaData, receivedMetaData) => mergeMetaData(assignedMetaData, receivedMetaData)
);


export const metaDataFields = createSelector(metaData, (metaData) => metaData.fields);

/* ================================================================================================================== */

export const receivedFormData = createSelector(formogen, formogen => formogen.receivedFormData);
export const assignedFormData = createSelector(formogenProps, formogenProps => formogenProps.formData);
export const isFormDataReady = createSelector(formogen, formogen => formogen.isFormDataReady);

export const formData = createSelector(
    [assignedFormData, receivedFormData, metaDataFields],
    (assignedFormData, receivedFormData, metaDataFields) => {
        return updateFormDataWithDefaults(metaDataFields, {...assignedFormData, ...receivedFormData});
    }
);
