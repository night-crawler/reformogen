import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Form } from 'semantic-ui-react';

import { errorsType, displayOptionsType } from '../../fieldPropTypes';
import { FieldLabel } from '../FieldLabel';
import { ErrorsList } from '../ErrorsList';

TextField.propTypes = {
  type: PropTypes.string.isRequired,

  displayOptions: displayOptionsType,

  name: PropTypes.string.isRequired,
  verbose_name: PropTypes.string.isRequired,
  help_text: PropTypes.string,
  errors: errorsType,

  max_length: PropTypes.number,

  editable: PropTypes.bool,
  required: PropTypes.bool,

  value: PropTypes.string,

  placeholder: PropTypes.string,

  helpTextOnHover: PropTypes.bool,

  updateProps: PropTypes.func,

  onChange: PropTypes.func,
};
export function TextField(props) {
  return (
    <Form.Field
      required={ props.required }
      disabled={ !props.editable }
      width={ props.displayOptions.width }
      error={ !_.isEmpty(props.errors) }
    >
      <FieldLabel { ...props } />
      <Form.TextArea 
        name={ props.name }
        value={ props.value }
        onChange={ props.onChange }
        placeholder={ props.placeholder }
      />
      { !props.helpTextOnHover
        ? <span className='help-text'>{ props.help_text }</span>
        : ''
      }
      <ErrorsList messages={ props.errors } />
    </Form.Field>
  );
}
