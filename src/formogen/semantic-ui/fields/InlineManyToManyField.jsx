import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'semantic-ui-react';
import Select from 'react-select';
import { map, isEmpty } from 'lodash';

import { errorsType, layoutOptsType } from '../../fieldPropTypes';
import { FieldLabel } from '../common/FieldLabel';
import { ErrorsList } from '../common/ErrorsList';


InlineManyToManyField.propTypes = {
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.arrayOf(PropTypes.any),
  data: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
  })),
  max_length: PropTypes.number,
  help_text: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  errors: errorsType,

  required: PropTypes.bool,
  editable: PropTypes.bool,

  helpTextOnHover: PropTypes.bool,
  layoutOpts: layoutOptsType,

  getOptionLabel: PropTypes.func,
  getOptionValue: PropTypes.func,
  closeOnSelect: PropTypes.bool,

  onChange: PropTypes.func,
};
InlineManyToManyField.defaultProps = {
  getOptionLabel: ({ name }) => name,
  getOptionValue: ({ id }) => id,
  closeOnSelect: true,
};
export function InlineManyToManyField(props) {
  const handleChange = val =>
    props.onChange(null, { name: props.name, value: map(val, 'id') });

  return (
    <Form.Field
      required={ props.required }
      disabled={ !props.editable }
      width={ props.layoutOpts.width }
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
