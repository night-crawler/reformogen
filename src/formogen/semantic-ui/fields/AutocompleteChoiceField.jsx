import PropTypes from 'prop-types';
import React from 'react';
import { isEmpty } from 'lodash';
import { Form } from 'semantic-ui-react';
import Select from 'react-select';

import { errorsType, displayOptionsType } from '../../fieldPropTypes';
import { FieldLabel } from '../FieldLabel';
import { ErrorsList } from '../ErrorsList';


AutocompleteChoiceField.propTypes = {
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  choices: PropTypes.arrayOf(PropTypes.array),
  max_length: PropTypes.number,
  help_text: PropTypes.string,
  placeholder: PropTypes.string,
  errors: errorsType,

  required: PropTypes.bool,
  editable: PropTypes.bool,

  helpTextOnHover: PropTypes.bool,
  displayOptions: displayOptionsType,

  getOptionLabel: PropTypes.func,
  getOptionValue: PropTypes.func,

  onChange: PropTypes.func,
};
AutocompleteChoiceField.defaultProps = {
  choices: [],
  getOptionLabel: ([ , name ]) => name,
  getOptionValue: ([ id ]) => id,
};
export function AutocompleteChoiceField(props) {
  const handleChange = ([ id ]) => props.onChange(
    null,
    { name: props.name, value: id !== undefined ? id : null }
  );

  return (
    <Form.Field
      required={ props.required }
      disabled={ !props.editable }
      width={ props.displayOptions.width }
      error={ !isEmpty(props.errors) }
    >
      <FieldLabel { ...props } />
      <Select 
        isMulti={ false }
        clearable={ !props.required }
        name={ props.name }
        value={ props.choices.filter(([ id ]) => props.value === id ) }
        placeholder={ props.placeholder }
        options={ props.choices }
        onChange={ handleChange }

        getOptionLabel={ props.getOptionLabel }
        getOptionValue={ props.getOptionValue }
      />
      { !props.helpTextOnHover 
        ? <span className='help-text'>{ props.help_text }</span>
        : ''
      }
      <ErrorsList messages={ props.errors } />
    </Form.Field>
  );
}
