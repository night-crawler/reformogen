import PropTypes from 'prop-types';
import React from 'react';
import _ from 'lodash';
import { Form } from 'semantic-ui-react';
import Select from 'react-select';

import { errorsType, layoutOptsType } from '../../fieldPropTypes';
import { FieldLabel } from '../FieldLabel';
import { ErrorsList } from '../ErrorsList';

/**
 * Converts structures like [ [ 1, 'Choice' ] ] -> [ { value: 1, label: 'Choice' } ]
 * @param {Array} choices 
 */
const makeReactSelectOptions = choices => choices.map(
  ([ value, label ]) => ({ value, label }));


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
  layoutOpts: layoutOptsType,

  onChange: PropTypes.func,
};
AutocompleteChoiceField.defaultProps = {
  choices: [],
};
export function AutocompleteChoiceField(props) {
  const handleChange = newVal => {
    props.onChange(
      null,
      { name: props.name, value: newVal ? newVal.value : null }
    );
  };

  return (
    <Form.Field
      required={ props.required }
      disabled={ !props.editable }
      width={ props.layoutOpts.width }
      error={ !_.isEmpty(props.errors) }
    >
      <FieldLabel { ...props } />
      <Select 
        clearable={ !props.required }
        name={ props.name }
        value={ props.value }
        placeholder={ props.placeholder }
        options={ makeReactSelectOptions(props.choices) }
        onChange={ handleChange }
        inputProps={ { type: 'react-type' } }
      />
      { !props.helpTextOnHover 
        ? <span className='help-text'>{ props.help_text }</span>
        : ''
      }
      <ErrorsList messages={ props.errors } />
    </Form.Field>
  );
}
