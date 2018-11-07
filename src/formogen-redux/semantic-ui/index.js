import * as fields from './fields';

export { fields };

export const suiFieldComponentMap = {
  CharField: fields.CharField,
  GenericField: fields.GenericField,
};

export function getFieldComponentForType({ type, choices, data }) {
  // if (choices)
  // return suiFieldComponentMap['ChoiceField']; 

  // opts.data can be a string or a list; string treats as a url to DataSet
  // if (type === 'ForeignKey' && !isString(data))
  //   return suiFieldComponentMap.InlineForeignKeyField;

  // if (type === 'ManyToManyField' && !isString(data))
  //   return suiFieldComponentMap.InlineManyToManyField;

  if(!suiFieldComponentMap[type])
    return suiFieldComponentMap.GenericField;

  return suiFieldComponentMap[type];
}
