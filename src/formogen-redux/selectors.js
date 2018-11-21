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

export const metaDataDefaultsMap = createSelector(
  metaDataFields, 
  metaDataFields => zip(
    map(metaDataFields || [], 'name'),
    map(metaDataFields || [], 'default')
  ) |> fromPairs
);

export const metaDataFieldsByNameMap = createSelector(
  metaDataFields, 
  metaDataFields => keyBy(metaDataFields, 'name')
);

export const formData = createSelector(
  [ formogen, formId ], 
  (formogen, formId) => formogen[`Form:${formId}:data`]
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


export const fieldOptionsNextPageNumber = createSelector(
  [ formogen, formId, fieldName ],
  (formogen, formId, fieldName) => // '' is the default value
    formogen[`Form:${formId}:field:${fieldName}:nextPageNumber`]
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
export const fieldFileUploadUrl = createSelector(
  [ fieldName, objectUrls, metaDataFieldsByNameMap ],
  (fieldName, objectUrls, metaDataFieldsByNameMap) => 
    objectUrls[`${fieldName}_upload`] ||
    metaDataFieldsByNameMap[fieldName]?.upload_url
);

/**
 * * NOTICE: it is possible to save with PATCH changed fields if we have objectId
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
  (formogen, formId, metaDataFileFields) => 
    metaDataFileFields.map(fieldMeta => ({
      fieldMeta,
      uploadUrl: fieldFileUploadUrl({ formogen }, { formId, name: fieldMeta.name }),
      files: dirtyFieldValue({ formogen }, { formId, name: fieldMeta.name }) 
    }))
);

/**
 * 
 * Form:${formId}:field:${fieldName}:q:${fieldInputSearch}
 */
