import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'semantic-ui-react';
import Select from 'react-select';
import { isEmpty } from 'lodash';

import { errorsType, displayOptionsType } from '../../fieldPropTypes';
import { FieldLabel } from '../FieldLabel';
import { ErrorsList } from '../ErrorsList';


InlineForeignKeyField.propTypes = {
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object]),
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

  isRtl: PropTypes.bool,

  getOptionLabel: PropTypes.func,
  getOptionValue: PropTypes.func,

  onChange: PropTypes.func,
};
InlineForeignKeyField.defaultProps = {
  data: [],
  isRtl: false,
  getOptionLabel: ({ name }) => name,
  getOptionValue: ({ id }) => id,
};
export function InlineForeignKeyField(props) {
  const handleChange = ({ id }) => props.onChange(null, { 
    name: props.name, 
    value: id || null
  });

  return (
    <Form.Field
      required={ props.required }
      disabled={ !props.editable }
      width={ props.displayOptions.width }
      error={ !isEmpty(props.errors) }
    >
      <FieldLabel { ...props } />
      <Select
        isClearable={ !props.required }
        closeOnSelect={ true }
        disabled={ !props.editable }
        isMulti={ false }
        onChange={ handleChange }
        options={ props.data }
        placeholder={ props.placeholder }
        simpleValue={ true }
        
        value={ props.data.filter(({ id }) => props.value === id ) }

        inputProps={ { type: 'react-type' } }
        removeSelected={ true }
        isRtl={ props.isRtl }

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
