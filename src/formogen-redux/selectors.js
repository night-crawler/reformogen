import { createSelector } from 'reselect';
import { isString, zip, map, fromPairs } from 'lodash';


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

export const metaDataM2MFields = createSelector(
  metaDataFields, metaDataFields => metaDataFields.filter(value => 
    isString(value.data) && value.type === 'ManyToManyField'
  )
);

export const metaDataDefaultsMap = createSelector(
  metaData, metaDataFields => zip(
    map(metaDataFields || [], 'name'),
    map(metaDataFields || [], 'default')
  ) |> fromPairs
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
  (dirtyFieldValue, storedFieldValue, defaultFieldValue) => {
    const value = dirtyFieldValue || storedFieldValue || defaultFieldValue;
    if (value === undefined)
      return '';
    return value;
  }
);


export const fieldOptionsNextPageNumber = createSelector(
  [ formogen, formId, fieldName ],
  (formogen, formId, fieldName) => // '' is the default value
    formogen[`Form:${formId}:field:${fieldName}:nextPageNumber`]
);
