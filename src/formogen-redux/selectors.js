import { createSelector } from 'reselect';
import { isString, zip, map, fromPairs, keyBy } from 'lodash';


export const formogen = state => {
  return state.formogen;
};
export const props = (state, props) => props;

export const formId = createSelector(
  props, props => props.formId
);

export const fieldName = createSelector(
  props, props => props.name
);

export const describeUrl = createSelector(
  props, props => props.describeUrl
);
export const createUrl = createSelector(
  props, props => props.createUrl
);
export const objectUrl = createSelector(
  props, props => props.objectUrl
);

export const metaData = createSelector(
  [ formogen, formId ], 
  (formogen, formId) => formogen[ `Form:${formId}:metaData` ]
);

export const metaDataFields = createSelector(
  metaData, metaData => metaData.fields
);

export const metaDataNonFileFields = createSelector(
  metaDataFields, metaDataFields => metaDataFields.filter(value => 
    ![ 'FileField', 'ImageField' ].includes(value.type)
  )
);

export const metaDataFileFields = createSelector(
  metaDataFields, metaDataFields => metaDataFields.filter(value => 
    [ 'FileField', 'ImageField' ].includes(value.type)
  )
);

export const metaDataM2MFields = createSelector(
  metaDataFields, metaDataFields => metaDataFields.filter(value => 
    isString(value.data) && value.type === 'ManyToManyField'
  )
);

export const metaDataFKFields = createSelector(
  metaDataFields, metaDataFields => metaDataFields.filter(value => 
    isString(value.data) && value.type === 'ForeignKey'
  )
);

export const metaDataDefaultsMap = createSelector(
  metaDataFields, 
  metaDataFields => zip(
    map(metaDataFields || [], 'name'),
    map(metaDataFields || [], 'default')
  ) |> (pairs => pairs.filter(([ , value ]) => value !== undefined))
    |> fromPairs
);

export const metaDataFieldsByNameMap = createSelector(
  metaDataFields, 
  metaDataFields => keyBy(metaDataFields, 'name')
);

export const formData = createSelector(
  [ formogen, formId ], 
  (formogen, formId) => formogen[`Form:${formId}:data`]
);

export const fieldErrors = createSelector(
  [ formogen, formId, fieldName ],
  (formogen, formId, fieldName) => 
    formogen[`Form:${formId}:field:${fieldName}:errors`] 
);

export const defaultFieldValue = createSelector(
  [ fieldName, metaDataDefaultsMap ],
  (fieldName, metaDataDefaultsMap) => metaDataDefaultsMap[fieldName]
);
export const storedFieldValue = createSelector(
  [ formogen, formId, fieldName ],
  (formogen, formId, fieldName) => 
    formogen[`Form:${formId}:field:${fieldName}:stored`] 
);
export const dirtyFieldValue = createSelector(
  [ formogen, formId, fieldName ],
  (formogen, formId, fieldName) => 
    formogen[`Form:${formId}:field:${fieldName}:dirty`] 
);
export const initialFieldValue = createSelector(
  [ storedFieldValue, defaultFieldValue ],
  (storedFieldValue, defaultFieldValue) => {
    const value = storedFieldValue || defaultFieldValue;
    if (value === undefined)
      return '';
    return value;
  }
);
export const finalFieldValue = createSelector(
  [ dirtyFieldValue, storedFieldValue, defaultFieldValue ],
  (...args) => [ ...args, '' ].filter(val => val !== undefined)[0]
);

export const objectId = createSelector(
  [ formogen, formId ],
  (formogen, formId) => 
    formogen[`Form:${formId}:field:id:stored`] 
);

export const fieldOptionsNextPageNumber = createSelector(
  [ formogen, formId, fieldName ],
  (formogen, formId, fieldName) => // '' is the default value
    formogen[ `Form:${formId}:field:${fieldName}:nextPageNumber` ]
);


export const asyncFieldInputSearch = createSelector(
  [ formogen, formId, fieldName ],
  (formogen, formId, fieldName) => // '' is the default value
    formogen[ `Form:${formId}:field:${fieldName}:q` ]
);

export const asyncFieldOptions = createSelector(
  [ formogen, formId, fieldName, asyncFieldInputSearch ],
  (formogen, formId, fieldName, fieldInputSearch) => // '' is the default value
    formogen[ `Form:${formId}:field:${fieldName}:q:${fieldInputSearch}:options` ]
);


export const objectUrls = createSelector(
  [ formogen, formId ],
  (formogen, formId) => 
    formogen[ `Form:${formId}:field:__urls__:stored` ] ||
    formogen[ `Form:${formId}:field:urls:stored` ]
);

/**
 * If we have an object, we prefer urls received from it, then urls from metadata.
 */
export const fieldFileUploadUrl = createSelector(
  [ fieldName, objectUrls, metaDataFieldsByNameMap ],
  (fieldName, objectUrls, metaDataFieldsByNameMap) => 
    objectUrls[`${fieldName}_upload`] ||
    metaDataFieldsByNameMap[fieldName]?.upload_url
);

/**
 * NOTICE: it is possible to save only modified fields with PATCH (if we have an object fetched).
 * Also, we exclude files from here, since they are uploaded separately.
 */
export const finalFormData = createSelector(
  [ formogen, formId, metaDataNonFileFields ],
  (formogen, formId, metaDataNonFileFields) => 
    metaDataNonFileFields.map(({ name }) => [ 
      name, 
      finalFieldValue({ formogen }, { formId, name }) 
    ]) |> fromPairs
);

export const dirtyFormFiles = createSelector(
  [ formogen, formId, metaDataFileFields ],
  (formogen, formId, metaDataFileFields) => {
    const fileBundles = [];
    metaDataFileFields.forEach(fileFieldMeta => {
      const url = fieldFileUploadUrl({ formogen }, { formId, name: fileFieldMeta.name });
      const files = dirtyFieldValue({ formogen }, { formId, name: fileFieldMeta.name }) || [];
      files.forEach(file => fileBundles.push({
        fieldName: fileFieldMeta.name,
        filename: file.name,
        file,
        url,
      }));
    });
    return fileBundles;
  }
);

export const formSaveHTTPMethod = createSelector(
  objectId,
  objectId => objectId ? 'put' : 'post'
);

export const formSaveUrl = createSelector(
  [ objectId, createUrl, objectUrl ],
  (objectId, createUrl, objectUrl) => 
    objectId ? objectUrl : createUrl
);
