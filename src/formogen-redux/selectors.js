import { createSelector } from 'reselect';


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
  (formogen, formId) => {
    return formogen[`Form:${formId}:metaData`];
  }
);

export const formData = createSelector(
  [ formogen, formId ], 
  (formogen, formId) => formogen[`Form:${formId}:data`]
);


export const fieldValue = createSelector(
  [ formogen, formId, fieldName ],
  (formogen, formId, fieldName) => // '' is the default value
    formogen[`Form:${formId}:field:${fieldName}`] || ''
);
