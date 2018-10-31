import { isPlainObject, isArray, isEmpty, isNumber, isString, map } from 'lodash';

export function extractIdentity(value) {
  if (!value)
    return null;

  if (isPlainObject(value))
    return +value.id;

  if (isArray(value)) {
    if (isEmpty(value))
      return [];

    if (isPlainObject(value[0]))
      return map(value, 'id').map(v => +v);
    else
      return map(value, v => +v);
  }

  if (isString(value) || isNumber(value))
    return +value;

  throw new Error(`Cannot extract identity from ${value}`);
}