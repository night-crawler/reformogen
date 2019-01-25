import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'semantic-ui-react';
import Select from 'react-select';
import { map, isEmpty } from 'lodash';

import { errorsType, displayOptionsType } from '../../fieldPropTypes';
import { FieldLabel } from '../FieldLabel';
import { ErrorsList } from '../ErrorsList';


InlineManyToManyField.propTypes = {
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.arrayOf(PropTypes.any),
  data: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
  })),
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
  closeOnSelect: PropTypes.bool,

  onChange: PropTypes.func,
};
InlineManyToManyField.defaultProps = {
  getOptionLabel: ({ name }) => name,
  getOptionValue: ({ id }) => id,
  closeOnSelect: true,
  data: [],
  value: [],
};
export function InlineManyToManyField(props) {
  const handleChange = val =>
    props.onChange(null, { name: props.name, value: map(val, 'id') });

  return (
    <Form.Field
      required={ props.required }
      disabled={ !props.editable }
      width={ props.displayOptions.width }
      error={ !isEmpty(props.errors) }
    >
      <FieldLabel { ...props } />
      <Select 
        isClearable={ props.editable }
        closeOnSelect={ props.closeOnSelect }
        isDisabled={ !props.editable }
        isMulti={ true }
        onChange={ handleChange }
        options={ props.data }
        placeholder={ props.placeholder }
        value={ props.data.filter(({ id }) => props.value.includes(id) ) }

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
