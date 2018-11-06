import { createSelector } from 'reselect';


export const formogen = state => state.formogen;
export const props = (state, props) => props;

export const formId = createSelector(
  props, props => props.formId
);

export const formData = createSelector(
  [formogen, props], 
  formogen => ''
);


export const formMetaData = createSelector(
  formogen, formogen => ''
);
