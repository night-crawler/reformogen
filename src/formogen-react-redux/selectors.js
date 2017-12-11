import { createSelector } from 'reselect';

import _ from 'lodash';
import { extractIdentity } from '../formogen/utils';

import { mergeMetaData, updateFormDataWithDefaults } from './utils';


// STARTERS
export const formogen = state => state.formogen;
export const formogenProps = (state, props) => props;


// METADATA
export const receivedMetaData = createSelector(formogen, formogen => formogen.receivedMetaData);
export const assignedMetaData = createSelector(formogenProps, formogenProps => formogenProps.initialMetaData);
export const isMetaDataReady = createSelector(formogen, formogen => formogen.isMetaDataReady);

export const totalMetaData = createSelector(
    [assignedMetaData, receivedMetaData],
    (assignedMetaData, receivedMetaData) => mergeMetaData(assignedMetaData, receivedMetaData)
);

export const totalMetaDataFields = createSelector(totalMetaData, (metaData) => metaData.fields);
export const metaDataFieldMap = createSelector(totalMetaDataFields, (metaDataFields) => _.keyBy(metaDataFields, 'name'));
export const formFieldNames = createSelector(totalMetaDataFields, metaDataFields => _.map(metaDataFields, 'name'));


// FORMDATA
export const pristineFormData = createSelector(formogen, formogen => _.get(formogen, 'pristineFormData', {}));
export const receivedFormData = createSelector(formogen, formogen => formogen.receivedFormData);
export const assignedFormData = createSelector(formogenProps, formogenProps => formogenProps.initialFormData);
export const isFormDataReady = createSelector(formogen, formogen => formogen.isFormDataReady);

export const totalFormData = createSelector(
    [assignedFormData, receivedFormData, totalMetaDataFields],
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
        return _.filter(fieldNames, name => pristine[name] !== current[name]);
    }
);

export const changedFormFile = createSelector(
    [changedFormFileFieldNames, totalFormData],
    (fieldNames, currentFormData) => {


        return _(currentFormData).pick(fieldNames).value();
    }
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
        if type == 'fk' return sdfsadf()
        return sdfasdf()
        return _.filter(fieldNames, name => pristine[name] !== current[name]);
    }
);

export const changedFormData = createSelector(
    [changedFormDataFieldNames, totalFormData],
    (fieldNames, currentFormData) => _(currentFormData).pick(fieldNames).value()
);





export const totalFieldsMap = createSelector(
    [totalFormData, formFieldNames],
    (data, fieldNames) => _.pick(data, fieldNames)
);


const getChangedFields = (totalFieldsMap, pristineFormData) => {
    return _(totalFieldsMap)
        .entries()
        .filter(([fieldName, fieldValue]) => {
            const pristineValue = pristineFormData[fieldName];

            // TODO: case with files (if files are serialized on server)

            if (_.isObject(fieldValue)) {  // is Array and Object (simultaneously)
                const pristineIdentity = extractIdentity(pristineValue);
                console.log('pristineIdentity', fieldName, pristineIdentity);
                console.log('current identity', fieldName, extractIdentity(fieldValue));

                return !_(extractIdentity(fieldValue)).difference(pristineIdentity).isEmpty();
            }

            return pristineValue !== fieldValue;
        })
        .fromPairs();
};


export const changedFieldsMap = createSelector([totalFieldsMap, pristineFormData], getChangedFields);

/*


1. totalFieldsMap = {
    [ totalMetaData.fields.name ]: [ totalFormData.value ]
}

2. changedFields = ['lol1', 'trash12']

3. submitFormData = totalFieldsMap.pick(changedFields)

totalBundle.inital

 */