import { isEmpty, map, flatten, uniq, difference, without } from 'lodash';

export function splitExt(fileName) {
  const fparts = fileName.split('.');
  const fname = fparts.slice(0, -1).join('.');
  const ext = fparts.slice(-1).join('');

  if (ext && !fname) 
    return [ ext, fname ];

  return [ fname, ext ];
}


export function bytesToSize(bytes) {
  if (bytes === 0) 
    return '-';

  const sizes = [ 'Bytes', 'KB', 'MB', 'GB', 'TB' ];
  // const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);
  const i = Math.log(bytes) / Math.log(1024)
    |> (_ => Math.floor(_, 10))
    |> parseInt;

  if (i === 0) 
    return `${ bytes } ${ sizes[i] }`;

  return `${ ( bytes / ( 1024 ** i ) ).toFixed(1) } ${ sizes[i] }`;
}


/**
 * Unfolds a single asterisk-wildcarded fields, populates the resulting fieldsets with
 * some default values suitable for SUI.
 * @param {Array} metaDataFields: [ { type, name, ... }, ... ] 
 * @param {Array} fieldsets: [ { header, fields: ['*', 'name1'], getDisplayOptions }, ...,  ]
 */
export function unfoldWildcardFieldsets(metaDataFields=[], fieldsets=[]) {
  const metaDataFieldNames = map(metaDataFields, 'name');
  const fieldsetFieldNames = map(fieldsets, 'fields') |> flatten;
  if (uniq(fieldsetFieldNames).length !== fieldsetFieldNames.length)
    throw new Error(`You've used some field names more than once: ${fieldsetFieldNames}`);
  
  const wildcardFieldNames = difference(
    metaDataFieldNames, 
    without(fieldsetFieldNames, ['*']) // * we don't need `*` by itself, it's not a field
  );

  // fieldsets with unfolded `*` fields
  return fieldsets.map(({ header=null, fields, getDisplayOptions = () => ({ width: 16 }) }) => {
    fields || !isEmpty(fields) || throw new Error('You must specify non-empty `fields` in the fieldset!');
    
    if (!fields.includes('*')) 
      return { header, fields, getDisplayOptions };

    const unfolded = [ ...fields ];
    unfolded[fields.indexOf('*')] = wildcardFieldNames;
    return { header, getDisplayOptions, fields: flatten(unfolded) };
  });
}
