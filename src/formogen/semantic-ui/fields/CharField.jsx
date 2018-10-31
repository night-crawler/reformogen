import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Form } from 'semantic-ui-react';

import { errorsType, layoutOptsType } from '../../fieldPropTypes';
import { FieldLabel } from '../common/FieldLabel';
import { ErrorsList } from '../common/ErrorsList';


CharField.propTypes = {
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  max_length: PropTypes.number,
  help_text: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  errors: errorsType,

  widget: PropTypes.string,
  password: PropTypes.bool,

  required: PropTypes.bool,
  editable: PropTypes.bool,

  helpTextOnHover: PropTypes.bool,
  layoutOpts: layoutOptsType,

  updateProps: PropTypes.func,
  onChange: PropTypes.func,
};
export function CharField(props) {
  const isPassword = props.password || props.widget === 'password';
  return (
    <Form.Field
      required={ props.required }
      disabled={ !props.editable }
      width={ props.layoutOpts.width }
      error={ !_.isEmpty(props.errors) }
    >
      <FieldLabel { ...props } />
      <Form.Input 
        name={ props.name }
        value={ props.value }
        placeholder={ props.placeholder }
        onChange={ props.onChange }
        type={ isPassword ? 'password' : 'text' }
        maxLength={ props.max_length }
      />
      { !props.helpTextOnHover
        ? <span className='help-text'>{ props.help_text }</span>
        : ''
      }
      <ErrorsList messages={ props.errors } />
    </Form.Field>
  );
}
