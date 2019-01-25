import React from 'react';
import _ from 'lodash';
import { Form } from 'semantic-ui-react';

import propTypes from '../../fieldPropTypes';
import { FieldLabel } from '../FieldLabel';
import { ErrorsList } from '../ErrorsList';


/**
 * Generic Field Component to use in DEBUG MODE ONLY
 * @param {Object} props
 * @returns {XML}
 * @constructor
 */
GenericField.propTypes = propTypes;
export function GenericField(props) {
  // eslint-disable-next-line
  console.warn(`Using a placeholder GenericFieldComponent to render field "${ props.name }" of type "${ props.type }"`);

  let _props = Object.assign({}, props);
  if (_.isFunction(props.updateProps)) {
    _props = props.updateProps(_props, props);
  }

  return (
    <Form.Field
      required={ props.required }
      disabled={ !props.editable }
      width={ props.displayOptions.width }
      error={ !_.isEmpty(props.errors) }
    >
      <FieldLabel { ...props } />
      <pre>
        { JSON.stringify(_props, null, 4) }
      </pre>
      { !props.helpTextOnHover
        ? <span className='help-text'>{ props.help_text }</span>
        : ''
      }
      <ErrorsList messages={ props.errors } />
    </Form.Field>
  );
}
