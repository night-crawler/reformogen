import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'semantic-ui-react';
import Select from 'react-select';
import { isEmpty } from 'lodash';

import { errorsType, layoutOptsType } from '../../fieldPropTypes';
import Label from '../common/Label';
import { ErrorsList } from '../common/ErrorsList';

import { extractIdentity } from './utils';


const makeOptions = fieldData => fieldData.map(
  ({ id, name }) => ({ label: name, value: id })
);


InlineForeignKeyField.propTypes = {
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object]),
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

  rtl: PropTypes.bool,

  updateProps: PropTypes.func,
  onChange: PropTypes.func,
};
InlineForeignKeyField.defaultProps = {
  data: [],
  rtl: false,
};
export function InlineForeignKeyField(props) {
  const handleChange = ({ value }) => {
    props.onChange(null, { name: props.name, value: value ? value * 1 : null });
  };

  return (
    <Form.Field
      required={ props.required }
      disabled={ !props.editable }
      width={ props.layoutOpts.width }
      error={ !isEmpty(props.errors) }
    >
      <Label { ...props } />
      <Select
        clearable={ !props.required }
        closeOnSelect={ true }
        disabled={ !props.editable }
        multi={ false }
        onChange={ handleChange }
        options={ makeOptions(props.data) }
        placeholder={ props.placeholder }
        simpleValue={ true }
        value={ extractIdentity(props.value) }
        inputProps={ { type: 'react-type' } }
        removeSelected={ true }
        rtl={ props.rtl }
      />
      { !props.helpTextOnHover
        ? <span className='help-text'>{ props.help_text }</span>
        : ''
      }
      <ErrorsList messages={ props.errors } />
    </Form.Field>
  );
}
