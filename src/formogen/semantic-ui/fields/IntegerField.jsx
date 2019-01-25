import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'semantic-ui-react';
import { isEmpty } from 'lodash';

import { errorsType, displayOptionsType } from '../../fieldPropTypes';
import { FieldLabel } from '../FieldLabel';
import { ErrorsList } from '../ErrorsList';


IntegerField.propTypes = {
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  min_value: PropTypes.number,
  max_value: PropTypes.number,
  decimal_places: PropTypes.number,
  help_text: PropTypes.string,
  placeholder: PropTypes.string,
  errors: errorsType,

  required: PropTypes.bool,
  editable: PropTypes.bool,

  helpTextOnHover: PropTypes.bool,
  displayOptions: displayOptionsType,

  onChange: PropTypes.func,
};
export function IntegerField(props) {
  let inputOptions = {
    type: 'number',
    min: props.min_value || undefined,
    max: props.max_value || undefined,
  };

  switch(props.type) {
    case 'PositiveSmallIntegerField':
      if (inputOptions.min === undefined) {inputOptions.min = 0;}
      if (inputOptions.max === undefined) {inputOptions.max = 32767;}
      break;

    case 'PositiveIntegerField':
      if (inputOptions.min === undefined) {inputOptions.min = 0;}
      if (inputOptions.max === undefined) {inputOptions.max = 2147483647;}
      break;

      // https://docs.djangoproject.com/en/1.11/ref/models/fields/#smallintegerfield
    case 'SmallIntegerField':
      if (inputOptions.min === undefined) {inputOptions.min = -32768;}
      if (inputOptions.max === undefined) {inputOptions.max = 32767;}
      break;

    case 'IntegerField':
      if (inputOptions.min === undefined) {inputOptions.min = -2147483648;}
      if (inputOptions.max === undefined) {inputOptions.max = 2147483647;}
      break;

    case 'FloatField':
      inputOptions.step = 0.1;
      break;

    case 'DecimalField':
      inputOptions.step = 0.1;
      if (props.decimal_places) {
        if (props.decimal_places >= 2) {
          inputOptions.step = 1 / Math.pow(10, (props.decimal_places / 2));
        }
      }
      break;

    default:
      break;
  }

  return (
    <Form.Field
      required={ props.required }
      disabled={ !props.editable }
      width={ props.displayOptions.width }
      error={ !isEmpty(props.errors) }
    >
      <FieldLabel { ...props } />
      <Form.Input 
        name={ props.name }
        value={ props.value }
        placeholder={ props.placeholder }
        onChange={ props.onChange }
        { ...inputOptions } 
      />
      { !props.helpTextOnHover
        ? <span className='help-text'>{ props.help_text }</span>
        : ''
      }
      <ErrorsList messages={ props.errors } />
    </Form.Field>
  );
}
