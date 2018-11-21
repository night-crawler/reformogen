import React from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import { Form, Checkbox } from 'semantic-ui-react';

import { errorsType, displayOptionsType } from '../../fieldPropTypes';
import { FieldLabel } from '../FieldLabel';
import { ErrorsList } from '../ErrorsList';


BooleanField.propTypes = {
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  help_text: PropTypes.string,
  placeholder: PropTypes.string,
  widget: PropTypes.string,
  errors: errorsType,

  required: PropTypes.bool,
  editable: PropTypes.bool,

  helpTextOnHover: PropTypes.bool,
  displayOptions: displayOptionsType,

  onChange: PropTypes.func,
};
BooleanField.defaultProps = {
  widget: '',
};
export function BooleanField(props) {
  const handleChange = (e, newValue) => {
    props.onChange(e, { name: props.name, value: newValue.checked });
  };

  return (
    <Form.Field
      required={ props.required }
      disabled={ !props.editable }
      width={ props.displayOptions.width }
      error={ !isEmpty(props.errors) }
    >
      <FieldLabel { ...props } />
      <Checkbox 
        name={ props.name }
        checked={ !!props.value || false }
        placeholder={ props.placeholder }
        onChange={ handleChange }
        toggle={ props.widget.toLowerCase() === 'toggle' || undefined }
        slider={ props.widget.toLowerCase() === 'slider' || undefined }
      />
      { !props.helpTextOnHover
        ? <span className='help-text'>{ props.help_text }</span>
        : ''
      }
      <ErrorsList messages={ props.errors } />
    </Form.Field>
  );
}
