import { createSelector } from 'reselect';


export const formogen = state => {
  return state.formogen;
};
export const props = (state, props) => props;

export const formId = createSelector(
  props, props => props.formId
);

export const formData = createSelector(
  [ formogen, formId ], 
  (formogen, formId) => formogen[`formData:${formId}`]
);


export const metaData = createSelector(
  [ formogen, formId ], 
  (formogen, formId) => {
    return formogen[`formMetaData:${formId}`];
  }
);
