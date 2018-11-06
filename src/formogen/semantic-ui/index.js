import { isString } from 'lodash';

import * as fields from './fields';

export { fields };
export { FormComponent } from './FormComponent';

export const suiFieldComponentMap = {
  CharField: fields.CharField,
  TextField: fields.TextField,

  DateTimeField: fields.DateTimeField,
  DateField: fields.DateField,
  TimeField: fields.TimeField,

  PositiveSmallIntegerField: fields.IntegerField,
  SmallIntegerField: fields.IntegerField,
  IntegerField: fields.IntegerField,
  PositiveIntegerField: fields.IntegerField,
  DecimalField: fields.IntegerField,
  FloatField: fields.IntegerField,

  // FileField: fields.DropzoneField,
  BooleanField: fields.BooleanField,

  ChoiceField: fields.AutocompleteChoiceField,

  GenericField: fields.GenericField,

  InlineForeignKeyField: fields.InlineForeignKeyField,
  InlineManyToManyField: fields.InlineManyToManyField,
};

/**
 * 
 * @param {*} param0 
 */
export function getFieldComponentForType({ type, choices, data }) {
  if (choices)
    return suiFieldComponentMap['ChoiceField']; 

  // opts.data can be a string or a list; string treats as a url to DataSet
  if (type === 'ForeignKey' && !isString(data))
    return suiFieldComponentMap.InlineForeignKeyField;

  if (type === 'ManyToManyField' && !isString(data))
    return suiFieldComponentMap.InlineManyToManyField;

  if(!suiFieldComponentMap[type])
    return suiFieldComponentMap.GenericField;

  return suiFieldComponentMap[type];
}
